#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

# Impermanent loss formulas


def IL_held(ratio):
    return 2 * np.sqrt(ratio) / (1 + ratio) - 1


def IL_initial_value(ratio):
    return (2 * np.sqrt(ratio) - ratio - 1) / 2

# Quadratic parabola approximation


def approx1(x, a, X0, c):
    return a * (x - X0)**2 + c


def fit_curve_np(df, index, il_wrt_hedge=True, deg=2):
    il_col = 'IL_initial_value' if il_wrt_hedge else 'IL_held'
    popt = np.polyfit(df[index].values, df[il_col].values, deg)
    return [-popt[0], -popt[1]/popt[0]/2, -(popt[2] - popt[1] * popt[1] / popt[0] / 4)]


def il_calculation(periods, df_symbol0, df_symbol1, df_cvi, start_date, end_date, lower_cvi_limits, upper_cvi_limits):
    coefficients_dict = {}

    for period in periods:
        df = df_symbol0.loc[(df_symbol0.index >= start_date) &
                            (df_symbol0.index <= end_date)].copy()

        if df_symbol1 is None:
            df['k'] = df["rate"].shift(-period) / df["rate"]
        else:
            df2 = df_symbol1.loc[(df_symbol1.index >= start_date) &
                                 (df_symbol1.index <= end_date)]
            # print(df2)
            df['k'] = (df["rate"].shift(-period) / df["rate"]) / \
                (df2["rate"].shift(-period) / df2["rate"])

        start_date = df.index[0]
        end_date = df.index[-1]

        df["VOL_INDEX"] = np.nan
        df.update(df_cvi)

        df["IL_held"] = IL_held(df["k"])
        df["IL_initial_value"] = IL_initial_value(df["k"])

        df = df.dropna()

        df_filtered = df.loc[(df["VOL_INDEX"] > lower_cvi_limits[period]) & (
            df["VOL_INDEX"] < upper_cvi_limits[period])]
        papprox = fit_curve_np(
            df_filtered, index='VOL_INDEX', il_wrt_hedge=True)

        # if papprox[0] < 0:
        #     coefficients_dict[period] = [0, 100, -df["IL_initial_value"].mean()]
        # else:
        coefficients_dict[period] = papprox

    return coefficients_dict, start_date, end_date, df
