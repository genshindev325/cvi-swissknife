import requests
import datetime
import time
from fastapi import HTTPException
from pydantic import BaseModel, conlist
from typing import List

# input


class SummarizeTextDto(BaseModel):
    query: str
    text: str

class QueryDto(BaseModel):
    query: str
    
# output


class ResultInfo(BaseModel):
    datetime: str
    meta: str
    query: str
    input_length: int
    output_length: int
    ratio_percent: int

class Result(BaseModel):
    summary: str

class SingleSummary(BaseModel):
    info: ResultInfo
    results: List[Result]


class SummarizeTextResult(BaseModel):
    results: List[SingleSummary]

#

class SummarizeURLDto(BaseModel):
    url: str

class QueryResult(BaseModel):
    result: str
