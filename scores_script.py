import requests
from bs4 import BeautifulSoup as bs

import re

import tabula.io as tb
import pandas as pd
import numpy as np

import json

def export_json(df, filepath, verbose):
    filename = filepath.split(".")
    filename = filename[0] + ".json"

    result = df.to_json(orient="index")
    parsed = json.loads(result)

    with open(filename, "w") as outfile: 
        json.dump(parsed, outfile) 

    if verbose:
        print("\nJSON file created")

    return filename

def cleanup(df):
    print(f"\nSummary of missing values below\n{df.isna().sum()}")
    print("\nrecords successfully scraped - {}".format(df.shape[0]))

def apply_split_data(index, final_split, lnames, fnames, course_numbers, course_names, full_name, full_names):

    course_pattern = re.compile("([\S]+[0-9]+)+", re.IGNORECASE) 
    alt_leftover_pattern = re.compile("[;][\s]*")

    lnames[index] = final_split[0]
    fnames[index] = final_split[1]
    full_names[index] = full_name
    leftover = final_split[2].split(":")

    if len(leftover) < 2:
        leftover = alt_leftover_pattern.split(final_split[2], maxsplit=1)

    if len(leftover) > 2:
        leftover[1] = " ".join(leftover[1:])
        leftover = leftover[:2]

    if len(leftover) == 2:

        leftover[0] = leftover[0].strip()
        leftover[1] = leftover[1].strip()

        match1 = course_pattern.search(leftover[0])
        match2 = course_pattern.search(leftover[1])

        if match1 != None:
            course_numbers[index] = match1.group(0)
            course_names[index] = leftover[1]
        
        elif match2 != None:
            course_numbers[index] = match2.group(0)
            course_names[index] = leftover[0]

        else:
            pass

def sep_name_course_data(value):

    name_pattern = re.compile("[,.; ]+")
    extraneous_lname = re.compile("[A-Z][a-z]+")

    value = value.strip()
    fixed = value.split("\r")
    value = ''.join(fixed)

    init_split = name_pattern.split(value, maxsplit=2)

    final_split = []

    full_name = []

    if len(init_split) == 3:

        middle_name_evidence = extraneous_lname.match(init_split[2])

        if middle_name_evidence != None:
            final_split.append(" ".join(init_split[0:2]))
            lname = middle_name_evidence.group(0)
            lname_and_course = init_split[2].split(maxsplit=1)
            final_split.append(lname)
            final_split.append(lname_and_course[1])
        else:
            final_split = init_split
        
        full_name.append(final_split[1])
        full_name.append(final_split[0])
        full_name = " ".join(full_name)

    return final_split, full_name

def split_prof_course(df, verbose):

    size = df.shape[0]

    full_names = [None] * size
    lnames = [None] * size
    fnames = [None] * size
    course_numbers = [None] * size
    course_names = [None] * size

    for index, value in df["Instructor and Course"].iteritems():

        final_split, full_name = sep_name_course_data(value)

        if len(final_split) == 3:

            apply_split_data(index, final_split, lnames, fnames, course_numbers, course_names, full_name, full_names)

    df["Full_Name"] = full_names
    df["Lname"] = lnames
    df["Fname"] = fnames
    df["Course_Number"] = course_numbers
    df["Course_Name"] = course_names

    df.drop("Instructor and Course", axis=1, inplace=True)
    
def clean_data(filepath, verbose):

    columns_list = ["Instructor and Course", "Enrolled", "Responses", "Response Rate", 
    "Preparedness", "Communication", "Clarity", "Encouragement", "Availability"]

    df = pd.read_csv(filepath, header=0)
    df.dropna(axis=1, how="all", inplace=True)

    if len(df.columns) < len(columns_list):
        alt_columns_list = ["Instructor and Course", "Enrolled", "Responses", "Clarity", 
        "Preparedness", "Communication", "Encouragement", "Availability"]

        if verbose:
            print("\nERROR: file {} not clean - incompatible size requirement - " + 
            "attempting to use alt columns\n".format(filepath))

        df.columns = alt_columns_list
    else:

        df.columns = columns_list
        df.drop("Response Rate", axis=1, inplace=True)

    type_corrections_list = ["Enrolled", "Responses","Preparedness", 
    "Communication", "Clarity", "Encouragement", "Availability"]

    for col in type_corrections_list:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df.dropna(inplace=True)

    df.reset_index(drop=True, inplace=True)

    split_prof_course(df, verbose)

    if verbose:
        print("data cleaned - dataframe head below\n")
        print(df.head())
        print("\n")
        cleanup(df)

    return df 

    # json_file = export_json(df, filepath, verbose)

def add_fname(row):

    name = row["Full_Name"].split(maxsplit=1)
    return name[0]

def add_lname(row):

    name = row["Full_Name"].split(maxsplit=1)
    return name[1]

def add_ovr_score(row):

    return np.mean([row["Availability"], row["Clarity"], row["Encouragement"], row["Preparedness"], row["Communication"]])

def fix_duplicates(df, verbose):

    df.drop(columns=["Enrolled", "Responses", "Course_Name", "Course_Number"], inplace=True)
    prof_groups = df.loc[df.duplicated(subset=["Full_Name"]), :].groupby(["Full_Name"]).mean().reset_index()
    df = pd.concat([df, prof_groups])

    df.drop_duplicates(subset=["Full_Name"], keep="last", inplace=True)
    df.dropna(subset=["Full_Name"], inplace=True)

    df["Fname"] = df.apply(lambda row: add_fname(row), axis=1)
    df["Lname"] = df.apply(lambda row: add_lname(row), axis=1)
    df["Ovr_Score"] = df.apply(lambda row: add_ovr_score(row), axis=1)

    df.dropna(inplace=True)
    df.set_index(["Full_Name"], inplace=True)

    return df

def output_dataframe(soup, UTA_site_path, verbose):

    links = 0
    df = pd.DataFrame()

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

                csv_path = "{}.csv".format(link.text)        
                tb.convert_into(pdf_path, csv_path, output_format='csv', pages="all")

                if verbose:
                    print("file converted to csv format")

                if verbose:
                    print("cleaning data...")

                if links > 0:
                    df = pd.concat([df, clean_data(csv_path, verbose)])
                else:
                    df = clean_data(csv_path, verbose)

                links += 1

    return df


def scrape_survey_data(verbose=False):

    records = 0

    page = requests.get("https://www.uta.edu/ier/student-feedback-survey/students.php")

    if verbose:
        print("Accessing site...")
        print("status code is {}".format(page.status_code))

    soup = bs(page.content, 'html.parser')

    if verbose:
        print("\ncontents downloaded...")

    UTA_site_path = "https://www.uta.edu/ier/student-feedback-survey/"

    df = output_dataframe(soup, UTA_site_path, verbose)

    records += df.shape[0]

    df = fix_duplicates(df, verbose)

    filename = export_json(df, "combined.whatevs", verbose)

    if verbose:
        print(f"\n\nScraping process complete\n{records} cleaned and exported to database")

if __name__ == "__main__":
    scrape_survey_data(True)
