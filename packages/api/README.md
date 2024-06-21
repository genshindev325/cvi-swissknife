# CVI-API

# Usage:

# Endpoints: https://api.cvi-team.com

GET history - Returns the CVI history of the last 40 days in a form of [timestamp, value] <br />
Params: <br />
chain - Ethereum / Polygon. Used due to chainlink having a different renew period between the chains. Default value is Ethereum <br />
cutoff - a timestamp in seconds that determins the cutoff point between CVI V1 data and the Chainlink data. Default value is Infinity which means all data will be taken from CVI V1 <br />

GET latest - Returns the latest CVI data pointin a form of <br />
{ <br />
timestamp: number, <br />
value: number, <br />
oneDayChange: number, <br />
oneDayChangePercent: number, <br />
valueOneHourAgo: number, <br />
oneWeekHigh: number, <br />
oneWeekLow, <br />
ethVolValue: number, <br />
ethVolOneDayChange: number, <br />
ethVolOneDayChangePercent: number <br />
} <br />

[timestamp, value, oneDayChange, oneDayChangePercent, valueOneHourAgo] <br />
Params: <br />
chain - Ethereum / Polygon. Used due to chainlink having a different renew period between the chains. Default value is Ethereum <br />
