import requests
import argparse
from bs4 import BeautifulSoup
import re
import os
from urlparse import urljoin

# nicked from http://stackoverflow.com/questions/16694907/how-to-download-large-file-in-python-with-requests-py
# modified with custom destination
def download_file(url, local_path):
    local_filename = url.split('/')[-1]
    # NOTE the stream=True parameter    
    destination_file = os.path.join(local_path, local_filename)
    if not os.path.exists(destination_file):
        print url
        r = requests.get(url, stream=True)
        with open(destination_file, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024): 
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    #f.flush() commented by recommendation from J.F.Sebastian
    else:
         return destination_file + ' already '
     
    return destination_file

def downloadPdfs(soup, full_path, pattern, subdir):
    path_to_pdfs = os.path.join(full_path, subdir)
    if not os.path.exists(path_to_pdfs):
        os.makedirs(path_to_pdfs)
        
    for x in soup.find_all('a', text=re.compile(pattern)):
        url_to_exam = x['href']
        print download_file(url_to_exam, path_to_pdfs), ' downloaded'

parser = argparse.ArgumentParser(description='PDF downloader for Vitahyllan @ LTH.se')

parser.add_argument('--d', type=str, default="./exams", help='Destination for pdfs, code will be appended, ex: ./exams, will result in "./exams/endimb2"')

args = parser.parse_args()

if __name__ == '__main__':
    dst_path = args.d

    base = 'http://www.maths.lth.se'
    r = requests.get('http://www.maths.lth.se/utbildning/matematiklth/')
    s1 = BeautifulSoup(r.content, 'html.parser')

    rgx = re.compile('^/course/(.+)$')

    for u in s1.find_all(lambda tag: tag.name == 'a' and
                         rgx.match(tag.attrs['href']) != None and
                         len(rgx.match(tag.attrs['href']).groups()) > 0):
        print u
        url = u['href']
        code = u['href'].split('/')[-2]
        r = requests.get(base + url)
        content = r.content
        soup = BeautifulSoup(content, 'html.parser')

        full_path = os.path.join(dst_path, code)

        if not os.path.exists(full_path):
            os.makedirs(full_path)
        
        pdf_types = [(r'^(Exam.*|Tenta.*)$', 'exams'), (r'^(Solution.*|L.*)$', 'solutions')]
        
        for pdf_type in pdf_types:
            downloadPdfs(soup, full_path, pdf_type[0], pdf_type[1]), ' downloaded'
