#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
from utils import prepare2symbols, load_CVI
from il_calculation import il_calculation
from constants import PERIODS, LOWER_CVI_LIMITS, UPPER_CVI_LIMITS, GECKO_IDS, START_DATE

END_DATE = pd.Timestamp("2022-07-05").date()


def very_close(a, b):
    return abs(a-b) < 1e-6


def test_il_calculation():
    print("running test_il_calculation")
    df_cvi = load_CVI()

    symbol0, symbol1 = "ETH", "USD"
    # symbol0, symbol1 = "MATIC", "ETH"
    # symbol0, symbol1 = "MATIC", "USD"
    # symbol0, symbol1 = "BTC", "ETH"
    # symbol0, symbol1 = "BTC", "USD"
    # symbol0, symbol1 = "LINK", "ETH"
    # symbol0, symbol1 = "LINK", "ETH"

    df_symbol0, df_symbol1, lower_cvi_limits, upper_cvi_limits = prepare2symbols(
        symbol0, symbol1)
    start_date = max(START_DATE[symbol0], START_DATE[symbol1])

    coefficients_dict, start_date, end_date, df_used = il_calculation(
        PERIODS, df_symbol0, df_symbol1, df_cvi, start_date, END_DATE, lower_cvi_limits, upper_cvi_limits)

    for period in PERIODS:
        print("Quadratic approximation for the term", period, "days")
        print("a=", coefficients_dict[period][0])
        print("X0=", coefficients_dict[period][1])
        print("c=", coefficients_dict[period][2])
    print("The first date is", start_date, "days, the last date is", end_date)

    # ETH-USD  for  END_DATE = pd.Timestamp("2022-05-31").date()
    test_coeff_dict = {14: [4.309399722109301e-07, 120.47613945964322, 0.004905573941735565],
                       15: [5.154023674642005e-07, 116.96927423891559, 0.005356147016002193],
                       30: [3.075885482881037e-06, 115.29842699710743, 0.010114674999252643],
                       60: [3.13818183818454e-06, 147.88628522007912, 0.021412849658545383]}

    for period in PERIODS:
        if (period >= 14):
            for (c, c_test) in zip(coefficients_dict[period], test_coeff_dict[period]):
                assert very_close(c, c_test), "period %s days; c: %s c_test: %s" % (
                    period, c, c_test)


if __name__ == "__main__":
    test_il_calculation()
