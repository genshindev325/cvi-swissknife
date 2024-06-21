#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import datetime
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
import uvicorn
import requests
from utils import CalcResponseAllPairs
from utils import load_CVI, prepare2symbols
from fastapi.middleware.cors import CORSMiddleware
import constants
from il_calculation import il_calculation
from cachetools import cached, LRUCache, TTLCache

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


cache_initiated = False

app = FastAPI(title="py-parabola-coefficients API",
              description=""" API served by fastapi/python that does quadratic approximation for the parabola coefficients of IL Protection premium values for different periods based on history of CVI and relevant pairs historical IL.

              The API is based on the following assumptions:

              (a) For POST method below - daily data from 01-01-2020 is supplied as history. denoted by "timestamp" and "rate", e.g:

                    a list of the below items (at least %s items, one item per day with milliseconds timestamp at 0:00 UTC midnight)....

                    DailyRate(timestamp=1650585600000, rate=2967.085285238213)

                    NOTE: Use https://www.epochconverter.com/ to make sure each timestamp is a milliseconds timestamp at 0:00 UTC midnight.

              (b) API fetches daily CVI values from 29 Aug 2019 till now from http://defi.r-synergy.com/V004/cvijson1000day on its own.

              The API outputs for 3 different periods: 14, 30 and 60 days, the approximate coefficients for the parabola
              that based on the history of CVI and relevant pairs historical IL, describes the expected IL per period.

              """ % (constants.MINIMUM_DAILY_RATES_NEEDED),
              version="0.0.1",
              contact={
                  "name": "CVI",
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

    return {"service": "py-parabola-coefficients", "version": image_version}


@ app.get("/readiness")
def readiness():
    global cache_initiated
    initiated_now = False

    if not cache_initiated:
        initiated_now = True
        cache_initiated = True
        test_get_response = requests.get(
            "http://127.0.0.1:8003/calculate_coefficients_all_pairs")
        print("1st time readiness, calling self end-point to make cache ready: ",
              test_get_response)

    return {"service": "py-parabola-coefficients", "initiated-cache-now":  initiated_now, "ready": "true"}


@ app.get("/calculate_coefficients_all_pairs", response_model=CalcResponseAllPairs)
# cache results for no longer than 1 hr
@cached(cache=TTLCache(maxsize=1024, ttl=3600))
def calc_coefficients_all_pairs():
    list = []
    df_cvi = load_CVI()

    for symbol0, symbol1 in constants.ALL_SUPPORTED_PAIRS:
        temp = []
        df_symbol0, df_symbol1, lower_cvi_limits, upper_cvi_limits = prepare2symbols(
            symbol0, symbol1)
        start_date = max(
            constants.START_DATE[symbol0], constants.START_DATE[symbol1])

        coefficients_dict, start_date, end_date, df_used = il_calculation(
            constants.PERIODS, df_symbol0, df_symbol1, df_cvi, start_date, constants.END_DATE, lower_cvi_limits, upper_cvi_limits)

        for period in constants.PERIODS:
            element = {'period': period,
                       'a': coefficients_dict[period][0],
                       'X0': coefficients_dict[period][1],
                       'c': coefficients_dict[period][2],
                       'description': 'Quadratic approximation for the period of ' + str(period) + ' days based on ' + symbol0 + '-' + symbol1 + ' history',
                       }
            temp.append(element)

        ret_value = {'info': {'datetime': str(datetime.datetime.utcnow()),
                              'first_date': str(start_date),
                              'last_date': str(end_date),
                              'days_count': len(df_used),
                              'symbol0': symbol0,
                              'symbol1': symbol1,
                              }, 'results': temp}

        list.append(ret_value)
    return {"results": list}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
