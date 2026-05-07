import requests

url = "http://127.0.0.1:8000/market/offer"
data = {
    "request_id": 1,
    "price": 100.0,
    "message": "Test offer"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
