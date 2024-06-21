Exposes a HTTP service with below end-point to compute and return the coefficients for
Quadratic parabola approximation for the period of X days based on history

4 periods: 14, (15), 30 and 60 days.

# Response for coefficients for hardcoded pair - Anton's work - ETH / USD

# Swagger

Swagger Docs: http://127.0.0.1:8003/docs
Swagger JSON: http://127.0.0.1:8003/openapi.json

## Install

pip3 install -r requirements.txt

## Run the server (fast-api)

python3 -m uvicorn main:app --reload --port 8003

## Test a request made to server using cURL

### All Pairs

curl --location --request GET 'http://localhost:8003/calculate_coefficients_all_pairs' | jq
