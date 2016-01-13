import requests
import argparse
from bs4 import BeautifulSoup
import re
import os
from urlparse import urljoin
from time import sleep

# nicked from http://stackoverflow.com/questions/16694907/how-to-download-large-file-in-python-with-requests-py
# modified with custom destination
def download_file(url, local_path):
    local_filename = url.split('/')[-1]
    
    destination_dir = os.path.join(local_path, os.path.splitext(os.path.basename(local_filename))[0])
    
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)
        
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

def downloadPdfs(soup, full_path, pattern, subdir):
    # Create subdir, exams or solutions, if not already exists
    path_to_pdfs = os.path.join(full_path, subdir)
    if not os.path.exists(path_to_pdfs):
        os.makedirs(path_to_pdfs)

    # Download all the pdfz!
    for x in soup.find_all('a', text=re.compile(pattern)):
        url_to_exam = x['href']
        if url_to_exam.endswith('.pdf'):
            print download_file(url_to_exam, path_to_pdfs), ' downloaded'
        

parser = argparse.ArgumentParser(description='PDF downloader for Vitahyllan @ LTH.se')

parser.add_argument('--d', type=str, default="./exams", help='Destination for pdfs, ex: ./exams')

args = parser.parse_args()

if __name__ == '__main__':
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

        # Create the course directory if it does not exist,
        # ex: ./exams/frtn05/
        full_path = os.path.join(dst_path, code)
        if not os.path.exists(full_path):
            os.makedirs(full_path)

        # (regex, subdir-name), for xmr course file structure compatibility
        pdf_types = [(r'^(Exam.*|Tenta.*)$', 'exams'), (r'^(Solution.*|L.*)$', 'solutions')]

        # download exams and solutions
        for rgx, subdir in pdf_types:
            downloadPdfs(soup_pdfs, full_path, rgx, subdir), ' downloaded'
