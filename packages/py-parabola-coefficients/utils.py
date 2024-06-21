import requests
import datetime
import pandas as pd
import numpy as np
import time
from fastapi import HTTPException
from pydantic import BaseModel, conlist
import constants
from typing import List

# input


class DailyRate(BaseModel):
    timestamp: int
    rate: float


class PairDailyRateDto(BaseModel):
    pair_daily_rates: conlist(
        DailyRate, min_items=constants.MINIMUM_DAILY_RATES_NEEDED)
    symbol0: str
    symbol1: str


class PairDto(BaseModel):
    symbol0: str
    symbol1: str

# output


class ResultInfo(BaseModel):
    datetime: str
    first_date: str
    last_date: str
    days_count: int
    symbol0: str
    symbol1: str


class Result(BaseModel):
    period: int
    a: float
    X0: float
    c: float
    description: str


class CalcResponseOnePair(BaseModel):
    info: ResultInfo
    results: List[Result]


class CalcResponseAllPairs(BaseModel):
    results: List[CalcResponseOnePair]


""" load CVI """


def load_CVI():
    url = "http://defi.r-synergy.com/V004/cvijson1000day"
    # ['minute_point', 'cvix_btc', 'cvix_eth', 'cvix', 'ema1', 'ema_btc', 'ema_eth', 'previous_point', 'previous_point_btc', 'previous_point_eth']

    # proxies = {
    #     'https': 'https://user-cotiilcvi:chileK2901!15@gate.smartproxy.com:7000'}

    res = requests.get(url)  # , proxies=proxies)  # add headers
    if res.status_code != 200:
        # check if res.json() not empty
        raise HTTPException(
            status_code=404,
            detail="load_CVI:: something went wrong (r-synergy.com)")
    else:
        df_cvi = pd.DataFrame(res.json())
        df_cvi["date"] = pd.to_datetime(df_cvi[0]).dt.date
        df_cvi.rename(columns={4: "VOL_INDEX"}, inplace=True)
        df_cvi.drop(columns=[0, 1, 2, 3, 5, 6, 7, 8, 9], inplace=True)
        df_cvi.set_index(["date"], inplace=True)
        df_cvi.sort_index(inplace=True)
        return df_cvi


def timestamp_in_milliseconds(dt):
    return time.mktime(dt.timetuple()) * 1000


def unix_timestamp_milliseconds_to_yyyy_mm_dd_with_hrs(milliseconds_timestamp):
    ts = int(milliseconds_timestamp)/1000
    return datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

# gets a date string "yyyy-mm-dd" and returns a timestamp for that date at 0:00 am (midnight)


def yyyymmdd_date_to_timestamp(date_string_yyyy_dash_mm_dash_dd: str):
    my_date = datetime.datetime.strptime(
        date_string_yyyy_dash_mm_dash_dd, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0) \
        .replace(tzinfo=datetime.timezone.utc)
    ts_utc = datetime.datetime.combine(
        my_date, my_date.time(), tzinfo=datetime.timezone.utc).timestamp()
    return int(ts_utc * 1000)


def load_symbol(symbol):
    """ load ETH from Coingecko"""
    URL = "https://api.coingecko.com/api/v3/coins/" + symbol + \
        "/market_chart?vs_currency=usd&days=1000&interval=daily"
    res = requests.get(URL)  # add headers
    if res.status_code != 200:
        # check if res.json() not empty
        print("load_symbol:: something went wrong (coingecko.com)")
    else:
        #df = pd.DataFrame(res.json()["prices"])
        #df["date"] = (pd.to_datetime(df[0]/1000, unit="s") - pd.Timedelta(days=1)).dt.date
        df = pd.DataFrame(res.json()["prices"]).iloc[:-2]
        df["date"] = (pd.to_datetime(df[0]/1000, unit="s")).dt.date

        df.rename(columns={1: "rate"}, inplace=True)
        df.drop(columns=[0], inplace=True)
        df.set_index(["date"], inplace=True)
        return df

# symbol0 and symbol1 are 3-letters symbols


def prepare2symbols(symbol0, symbol1):
    df_symbol0 = load_symbol(constants.GECKO_IDS[symbol0])
    if symbol1 == "USD":
        df_symbol1 = None
    else:
        df_symbol1 = load_symbol(constants.GECKO_IDS[symbol1])

    if (symbol0, symbol1) in constants.LOWER_CVI_LIMITS:
        (s1, s2) = (symbol0, symbol1)
    else:
        raise HTTPException(
            status_code=404,
            detail="unsupported pair")

    return df_symbol0, df_symbol1, constants.LOWER_CVI_LIMITS[(s1, s2)], constants.UPPER_CVI_LIMITS[(s1, s2)]
