#!/bin/bash
# This is to test API.
API_URL="http://127.0.0.1:8080/llm_api"

PAYLOAD='{
  "user_prompt": "Tell me a short joke."
}'

response=$(curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$API_URL")

echo "Tested Response from API:"
echo "$response"
