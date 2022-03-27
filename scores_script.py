import requests
from bs4 import BeautifulSoup as bs

import re

import tabula as tb
import pandas as pd

def scrape_survey_data(verbose=False):

    page = requests.get("https://www.uta.edu/ier/student-feedback-survey/students.php")

    if verbose:
        print("Accessing site...")
        print("status code is {}".format(page.status_code))

    soup = bs(page.content, 'html.parser')

    if verbose:
        print("\ncontents downloaded... Outputting content below\n\n")
        print(soup.prettify())

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

def clean_data(filepath):

    columns_list = ["Instructor and Course", "Enrolled", "Responses", "Response Rate", 
    "Prepardeness", "Communication", "Clarity", "Encouragement", "Availability"]

    df = pd.read_csv(filepath, header=0)

    df.dropna(axis=1, how="all", inplace=True)
    df.columns = columns_list
    df.drop("Response Rate", axis=1, inplace=True)

    type_corrections_list = ["Enrolled", "Responses","Prepardeness", 
    "Communication", "Clarity", "Encouragement", "Availability"]

    for col in type_corrections_list:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df.dropna(inplace=True)

    print(df.head())

scrape_survey_data(True)
clean_data("Fall 2021.csv")