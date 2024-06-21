#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import openai
import datetime
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
import uvicorn
import requests
from utils import SummarizeTextResult, SummarizeTextDto, SummarizeURLDto, QueryDto, QueryResult
from fastapi.middleware.cors import CORSMiddleware
from cachetools import cached, LRUCache, TTLCache
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
from newspaper import Article
# from transformers import pipeline

instrumentator = Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_respect_env_var=True,
    should_instrument_requests_inprogress=True,
    excluded_handlers=[".*admin.*", "/metrics"],
    env_var_name="ENABLE_METRICS",
    inprogress_name="inprogress",
    inprogress_labels=True,
)

# Replace YOUR_API_KEY with your actual API key
openai.api_key = "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"

def extract_text_from_url(url):
    hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}
    
    article = Article(url)

    article.download()
    article.parse()

    text = article.text
    
    print(f'=======================text using article :\n{text}\n=======================')
    if text == '':
        req = Request(url, headers=hdr)
        html = urlopen(req).read()
        soup = BeautifulSoup(html, features="html.parser")

        # kill all script and style elements
        for script in soup(["script", "style"]):
            script.extract()    # rip it out

        # get text
        text = ''

        # CoinDesk
        mydivs = soup.find_all("div", {"class": "at-text"})
        for div in mydivs:
            text = text + '\n' + div.get_text()
        # cointelegraph
        mydivs = soup.find_all("div", {"class": "post-content"})
        for div in mydivs:
            text = text + '\n' + div.get_text()
        print(f'*** you need to specifically parse {url}')
        text = soup.get_text()

    # break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)
    return text



def summarize_text(query, text):
    # Split the text into chunks of 3500 characters
    chunks = [text[i:i+3500] for i in range(0, len(text), 3500)]

    # Initialize an empty list to store the summaries
    summaries = []

    # Send each chunk to ChatGPT via the API and store the summary
    
    prompt = f"{query}:\n{text}"
    # print(prompt)
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=256,
        temperature=0.7,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1)
    summary = response["choices"][0]["text"]
    
    # print(summary)
    summaries.append(summary)

    return summaries


cache_initiated = True

app = FastAPI(title="chatgpt-server API",
              version="0.0.1",
              contact={
                  "name": "",
              },
              )


origins = [
    "*",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Instrumentator().instrument(app).expose(app)


@ app.get("/")
def home():
    # check the image_version file and print version
    try:
        f = open("image_version", "r")
        image_version = f.read()
        if (image_version):
            image_version = image_version.replace("\n", "")
    except:
        image_version = None

    return {"service": "chatgpt-server", "version": image_version}


@ app.get("/readiness")
def readiness():
    global cache_initiated
    initiated_now = False

    if not cache_initiated:
        initiated_now = True
        cache_initiated = True
        # ...

    return {"service": "chatgpt-server", "initiated-cache-now":  initiated_now, "ready": "true"}

def splitTextToSmallPartsArray(text: str):
    out = []
    threshold = 3500 - 10
    for chunk in text.split('. '):
        if out and len(chunk)+len(out[-1]) < threshold:
            out[-1] += ' '+chunk+'.'
        else:
            out.append(chunk+'.')
    return out

# def huggingfaceSummarize(inputText: str):
#     summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
#     # Generate the summary
#     summaryText = summarizer(inputText, max_length=130, min_length=30, do_sample=False)

#     summary = summaryText[0]["summary_text"]
#     # Print the summary
#     print(f'summary: {summary}')

#     list = []
#     temp = []
#     total_target_chars =0

#     element = {'summary': summary}
#     total_target_chars = total_target_chars + len(summary)
#     temp.append(element)

#     ret_value = {'info': {'datetime': str(datetime.datetime.utcnow()),
#                             'meta': 'Summarize with HuggingFace',
#                             'query': '',
#                             'input_length': len(inputText),
#                             'output_length': total_target_chars,
#                             'ratio_percent': int(total_target_chars/len(inputText)*100)
#                           }, 'results': temp}
#     list.append(ret_value)
#     all = {"results": list}
#     print(json.dumps(all, indent=4))

#     return all


# can get large text, for example, 8K words, we will break to small chunks
def chatgptCommand(inputQuery: str, inputText: str, meta_data: str):
    print(f'***\nCommand "{inputQuery}" {len(inputText)} chars.\n\n{inputText}\n***')
    arr_small_text_chunks = splitTextToSmallPartsArray(inputText)

    list = []
    temp = []
    total_target_chars =0
    for i, text in enumerate(arr_small_text_chunks):
        results = summarize_text(inputQuery, text)
        for iResult, summary in enumerate(results):
            element = {'summary': summary}
            total_target_chars = total_target_chars + len(summary)
            temp.append(element)

    ret_value = {'info': {'datetime': str(datetime.datetime.utcnow()),
                            'meta': meta_data,
                            'query': inputQuery,
                            'input_length': len(inputText),
                            'output_length': total_target_chars,
                            'ratio_percent': int(total_target_chars/len(inputText)*100)
                          }, 'results': temp}
    list.append(ret_value)
    all = {"results": list}
    print(json.dumps(all, indent=4))

    return all


@ app.post("/chatgpt-query", response_model=QueryResult)
def chatgptSummarizeText(input: QueryDto):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=input.query,
        max_tokens=256,
        temperature=0.7,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1)
    result = {'result': response["choices"][0]["text"] }
    return result

@ app.post("/chatgpt-summarize-text", response_model=SummarizeTextResult)
def chatgptSummarizeText(input: SummarizeTextDto):
    return chatgptCommand (input.query, input.text, 'text')
    
# @ app.post("/huggingface-summarize-text", response_model=SummarizeTextResult)
# def huggingfaceSummarizeText(input: QueryDto):
#     return huggingfaceSummarize (input.query)
   


@ app.post("/chatgpt-summarize-url", response_model=SummarizeTextResult)
def chatgptSummarizeURL(input: SummarizeURLDto):
    textToSummarize = extract_text_from_url(input.url)
    return chatgptCommand ("Please Summarize this article for me", textToSummarize, input.url)
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
