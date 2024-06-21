import pandas as pd

""" global parameters """
MILLISECONDS_IN_24H = 60 * 60 * 24 * 1000
#
# DailyRate[] - Valid input data to allow calculation
#
MINIMUM_DAILY_RATES_NEEDED = 360
START_DAILY_RATES__DATE_YYYY_MM_DD = "2020-01-01"  # %Y-%m-%d format
# DailyRate up to no more than 3 days ago
MAX_MISSING_DAYS_NOW_AGO_ALLOWED = 3

#
LOWER_CVI_LIMITS = {("ETH", "USD"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 65},
                    ("MATIC", "USD"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("MATIC", "ETH"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("BTC", "USD"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("BTC", "ETH"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("LINK", "USD"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("LINK", "ETH"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("ADA", "ETH"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    ("BNB", "USD"): {1: 0, 3: 0, 7: 0, 14: 0, 15: 0, 30: 0, 60: 0},
                    }
ALL_SUPPORTED_PAIRS = LOWER_CVI_LIMITS.keys()

UPPER_CVI_LIMITS = {("ETH", "USD"): {1: 140, 3: 140, 7: 140, 14: 140, 15: 140, 30: 200, 60: 200},
                    ("MATIC", "USD"): {1: 140, 3: 140, 7: 140, 14: 140, 15: 140, 30: 140, 60: 140},
                    ("MATIC", "ETH"): {1: 140, 3: 140, 7: 140, 14: 140, 15: 140, 30: 140, 60: 140},
                    ("BTC", "USD"): {1: 200, 3: 200, 7: 200, 14: 200, 15: 200, 30: 200, 60: 200},
                    ("BTC", "ETH"): {1: 200, 3: 200, 7: 200, 14: 200, 15: 200, 30: 200, 60: 200},
                    ("LINK", "USD"): {1: 200, 3: 200, 7: 200, 14: 200, 15: 200, 30: 200, 60: 200},
                    ("LINK", "ETH"): {1: 200, 3: 200, 7: 200, 14: 200, 15: 200, 30: 200, 60: 200},
                    ("ADA", "ETH"): {1: 200, 3: 200, 7: 200, 14: 200, 15: 200, 30: 200, 60: 200},
                    ("BNB", "USD"): {1: 200, 3: 200, 7: 200, 14: 200, 15: 200, 30: 200, 60: 200},
                    }

GECKO_IDS = {"BTC": "bitcoin", "ETH": "ethereum",
             "LINK": "chainlink", "MATIC": "matic-network", "USDC": "usd-coin", "ADA": "cardano", "BNB": "binancecoin"}

"""
In the future add support for:

  {
    "id": "binancecoin",
    "symbol": "bnb",
    "name": "BNB"
  },

  {
    "id": "cardano",
    "symbol": "ada",
    "name": "Cardano"
  },

"""
PERIODS = [1, 3, 7, 14, 15, 30, 60]

START_DATE = {"ETH": pd.Timestamp(START_DAILY_RATES__DATE_YYYY_MM_DD).date(),
              "BTC": pd.Timestamp(START_DAILY_RATES__DATE_YYYY_MM_DD).date(),
              "MATIC": pd.Timestamp("2021-07-01").date(),
              "LINK": pd.Timestamp(START_DAILY_RATES__DATE_YYYY_MM_DD).date(),
              "USD": pd.Timestamp("2000-01-01").date(),
              "BNB": pd.Timestamp("2000-01-01").date(),
              "ADA": pd.Timestamp("2000-01-01").date()}
END_DATE = pd.Timestamp("now").date()
