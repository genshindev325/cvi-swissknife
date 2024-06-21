Exposes a HTTP service with below end-point to ChatGPT

# Swagger

Swagger Docs: http://127.0.0.1:8003/docs
Swagger JSON: http://127.0.0.1:8003/openapi.json

## Install

pip3 install -r requirements.txt

## Run the server (fast-api)

python3 -m uvicorn main:app --reload --port 8003

## Test a request made to server using cURL

curl -X 'POST' \
 'http://127.0.0.1:8003/chatgpt-summarize-text' \
 -H 'accept: application/json' \
 -H 'Content-Type: application/json' \
 -d '{
"query": "Please summarize the following text in bullets",  
"text": "When you say it'\''s one. That does is it sort of like in juxtaposition with saying we all believe here that this industry is so small? And is a speck of dust as an asset class, you can'\''t really say it'\''s like won the battle. Like like, you know what I mean? I this is why I struggle with any sort of maximalism thinking here, which is God like. It is so hard to build in crypto because you don'\''t understand the real user base. God damn it, there'\''s like ten people using defi protocols and a couple maybe a million people using is like, you know, I mean, like."
}'
