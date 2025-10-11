#!/usr/bin/env python
"""
Test health endpoint
"""
import requests

def test_health_endpoint():
    """Test health endpoint"""
    print("Testing Health Endpoint...")
    print("=" * 50)
    
    base_url = "http://127.0.0.1:8000"
    endpoints = [
        '/api/health/',
        '/api/health',
        '/health/',
        '/health'
    ]
    
    for endpoint in endpoints:
        print(f"\nTesting {endpoint}")
        try:
            response = requests.get(f"{base_url}{endpoint}")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print(f"   Success: {response.json()}")
            else:
                print(f"   Error: {response.text}")
        except requests.exceptions.ConnectionError:
            print("   Connection error - Django server not running")
        except Exception as e:
            print(f"   Exception: {e}")

if __name__ == '__main__':
    test_health_endpoint()
