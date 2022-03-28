import requests
from bs4 import BeautifulSoup as bs

import re

import tabula as tb
import pandas as pd

def get_prof_names(df, verbose):

    name_pattern = re.compile("[,. ]+")
    #name_pattern = re.compile("[a-zA-z]*[,. ]+")
    course_pattern = re.compile("[A-Z]{2,6}([-][A-Z0-9]+)+", re.IGNORECASE) # Need to find out why last ones aren't matching

    size = df.shape[0]

    lnames = [None] * size
    fnames = [None] * size
    course_names = [None] * size
    course_numbers = [None] * size

    for index, value in df["Instructor and Course"].iteritems():

        value = value.strip()
        fixed = value.split("\r")
        value = ''.join(fixed)

        split_by_name = name_pattern.split(value, maxsplit=2)

        """
        if verbose:
            print(index)
            print(split_by_name)
            print()
        """

        lnames[index] = split_by_name[0]
        fnames[index] = split_by_name[1]
        leftover = split_by_name[2].split(":")

        leftover[0] = leftover[0].strip()
        leftover[1] = leftover[1].strip()

        if verbose:
            print(leftover)

        match1 = course_pattern.search(leftover[0])
        match2 = course_pattern.search(leftover[1])

        if match1 != None:
            course_numbers[index] = match1.group(0)
            course_names[index] = leftover[1]
        
        if match2 != None:
            course_numbers[index] = match2.group(0)
            course_names[index] = leftover[0]


    df["Lname"] = lnames
    df["Fname"] = fnames
    df["Course_Number"] = course_numbers
    df["Course_Name"] = course_names

    
def clean_data(filepath, verbose):

    columns_list = ["Instructor and Course", "Enrolled", "Responses", "Response Rate", 
    "Prepardeness", "Communication", "Clarity", "Encouragement", "Availability"]

    df = pd.read_csv(filepath, header=0)

    if len(df.columns) < len(columns_list):

        if verbose:
            print("\nERROR: file {} not clean - incompatible size requirement\n".format(filepath))
        return

    df.dropna(axis=1, how="all", inplace=True)
    df.columns = columns_list
    df.drop("Response Rate", axis=1, inplace=True)

    type_corrections_list = ["Enrolled", "Responses","Prepardeness", 
    "Communication", "Clarity", "Encouragement", "Availability"]

    for col in type_corrections_list:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df.dropna(inplace=True)

    df.reset_index(drop=True, inplace=True)

    if verbose:
        print("data cleaned - dataframe head below")

    get_prof_names(df, verbose)

    print(df.head())
    print("\n")

def scrape_survey_data(verbose=False):

    page = requests.get("https://www.uta.edu/ier/student-feedback-survey/students.php")

    if verbose:
        print("Accessing site...")
        print("status code is {}".format(page.status_code))

    soup = bs(page.content, 'html.parser')

    """

    if verbose:
        print("\ncontents downloaded... Outputting content below\n\n")
        print(soup.prettify())

    """

    UTA_site_path = "https://www.uta.edu/ier/student-feedback-survey/"

    for link in soup.find_all('a', string=re.compile("(Spring 20|Summer 20|Fall 20)((19)|(2[0-9]))")):
        if 'href' in link.attrs:

            filename = link.get('href')
            path = UTA_site_path + filename
            response = requests.get(path)

            if verbose:
                print("Link found matching Spring/Summer/Fall 2019+ student survey data")
                print("response code returned is {}".format(response))

            pdf_path = "{}.pdf".format(link.text)
            pdf = open(pdf_path, "wb")
            pdf.write(response.content)
            pdf.close()

            if verbose:
                print("file {} downloaded successfully".format(pdf_path))

            pdf_path = "{}.pdf".format(link.text)

            #df = tb.read_pdf(pdf_path, pages=1, multiple_tables=False, lattice=True)

            csv_path = "{}.csv".format(link.text)        
            tb.convert_into(pdf_path, csv_path, output_format='csv', pages=1)

            if verbose:
                print("file converted to csv format")

            if verbose:
                print("cleaning data...")

            clean_data(csv_path, verbose)

scrape_survey_data(True)
