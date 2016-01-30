import requests
import argparse
from bs4 import BeautifulSoup
import re
import os
from urlparse import urljoin
from time import sleep

def normalizeFilenameToCommonDateFormat(filename):
    """ Takes a name like exam_2015-01-28.pdf and 
    returns 20150128.pdf which is the format that Xmr uses.
    """
    rgx_date = re.search(r'(\d+)-(\d+)-(\d+)', filename)

    if (rgx_date == None):
        raise ValueError("Not interested in this file!")
    
    year = rgx_date.group(1)
    month = rgx_date.group(2)
    day = rgx_date.group(3)

    return "%s%s%s.pdf" % (year, month, day)

# nicked from http://stackoverflow.com/questions/16694907/how-to-download-large-file-in-python-with-requests-py
# modified with custom destination
def download_file(url, local_path):
    """ Downloads a file and stores it locally.

    Keyword arguments:
    url -- url to the file
    local_path -- local path to save file
    """
    try:
        local_filename = normalizeFilenameToCommonDateFormat(url.split('/')[-1])
        
        destination_dir = local_path  #os.path.join(local_path, os.path.splitext(os.path.basename(local_filename))[0])
    
        #if not os.path.exists(destination_dir):
        #    os.makedirs(destination_dir)
        
        destination_file = os.path.join(destination_dir, local_filename)
    
        if not os.path.exists(destination_file):
            # NOTE the stream=True parameter    
            r = requests.get(url, stream=True)
            with open(destination_file, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024): 
                    if chunk: # filter out keep-alive new chunks
                        f.write(chunk)
                        #f.flush() commented by recommendation from J.F.Sebastian
                        # Sleep so that we aren't rude
            sleep(1)
        else:
            return destination_file + ' already '
     
        return destination_file
    except ValueError as err:
        return "Skipping %s, not " % (url.split('/')[-1])

def downloadPdfs(soup, full_path, pattern, subdir):
    """ Download all pdfs found in the HTML source.

    Keyword arguments:
    soup -- BeautifulSoup object containing the HTML source code
    full_path -- base location to store PDFs, ex: ./exams/fmaa01a1
    pattern -- regex to search for PDF files
    subdir -- subdir to store PDFs found inside full_path, ex: solutions -> ./exams/fmaa01a1/solutions
    """
    # Create subdir, exams or solutions, if not already exists
    path_to_pdfs = os.path.join(full_path, subdir)
    if not os.path.exists(path_to_pdfs):
        os.makedirs(path_to_pdfs)

    # Download all the pdfz!
    for x in soup.find_all('a', text=re.compile(pattern)):
        url_to_exam = x['href']
        if url_to_exam.endswith('.pdf'):
            print download_file(url_to_exam, path_to_pdfs), ' downloaded'

def makeDirIfNotExists(base, new):
    # Create the course directory if it does not exist,
    # ex: ./exams/frtn05/
    full_path = os.path.join(base, new)
    if not os.path.exists(full_path):
        os.makedirs(full_path)
    return full_path

parser = argparse.ArgumentParser(description='PDF downloader for Vitahyllan @ LTH.se')

parser.add_argument('--d', type=str, default="./exams", help='Destination for pdfs, ex: ./exams')
parser.add_argument('--u', type=str, help='URL to download PDFs from.')
parser.add_argument('--c', type=str, help='code for course')

args = parser.parse_args()

if __name__ == '__main__':
    if args.u != None and args.c != None:
        dst_path = args.d
        code = args.c
        full_path = makeDirIfNotExists(dst_path, code)
        url = args.u
        r = requests.get(url)    
        soup = BeautifulSoup(r.content, 'html.parser')
        
        # (regex, subdir-name), for xmr course file structure compatibility
        pdf_types = [(r'^(Exam.*|Tenta.*)$', 'exams'), (r'^(Solution.*|L.*)$', 'solutions')]
                
        # download exams and solutions
        for rgx, subdir in pdf_types:
            downloadPdfs(soup, full_path, rgx, subdir), ' downloaded'
            
    else:
        dst_path = args.d

        base = 'http://www.maths.lth.se'
    
        r = requests.get('http://www.maths.lth.se/utbildning/matematiklth/')
    
        soup_courses = BeautifulSoup(r.content, 'html.parser')

        rgx = re.compile('^/course/(.+)$')

        # For every course page
        for u in soup_courses.find_all(lambda tag: tag.name == 'a' and
                                       rgx.match(tag.attrs['href']) != None and
                                       len(rgx.match(tag.attrs['href']).groups()) > 0):
            print u
            url = u['href']
            code = u['href'].split('/')[-2]
            r = requests.get(urljoin(base, url))
            content = r.content
            soup_pdfs = BeautifulSoup(content, 'html.parser')
            
            full_path = makeDirIfNotExists(dst_path, code)

            # (regex, subdir-name), for xmr course file structure compatibility
            pdf_types = [(r'^(Exam.*|Tenta.*)$', 'exams'), (r'^(Solution.*|L.*)$', 'solutions')]
                
            # download exams and solutions
            for rgx, subdir in pdf_types:
                downloadPdfs(soup_pdfs, full_path, rgx, subdir), ' downloaded'
