#!/usr/bin/env python3
"""Manual smoke-test script for the local Flask recommendation API."""
import requests
import json
from datetime import datetime

# ANSI color codes for terminal output
COLORS = {
    'HEADER': '\033[95m',
    'BLUE': '\033[94m',      # Info
    'GREEN': '\033[92m',     # Success
    'YELLOW': '\033[93m',    # Warning
    'RED': '\033[91m',       # Error
    'ENDC': '\033[0m',       # Reset
    'BOLD': '\033[1m',
    'UNDERLINE': '\033[4m'
}

# API base URL
BASE_URL = "http://192.168.110.63:3000"

def test_health_check():
    """Test the health check endpoint"""
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 1: Health Check{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    response = requests.get(f"{BASE_URL}/")
    print(f"{COLORS['BLUE']}Status Code: {response.status_code}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}Response: {json.dumps(response.json(), indent=2)}{COLORS['ENDC']}")
    return response.status_code == 200

def test_recommendation_with_song():
    """Test recommendation with song"""
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 2: Recommendation WITH Song (Energetic Mood){COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    data = {
        "user_id": "user_test123",
        "email": "test@example.com",
        "mood": "Energetic",
        "song": "Pump It Up - Summer Sensations",
        "location": {
            "latitude": 30.0543978,
            "longitude": 31.453874,
            "city": "Cairo"
        },
        "weather": {
            "temperature": 15,
            "condition": "cloudy"
        },
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    response = requests.post(f"{BASE_URL}/recommend", json=data)
    print(f"{COLORS['BLUE']}Status Code: {response.status_code}{COLORS['ENDC']}")
    result = response.json()

    if result.get('success'):
        print(f"\n{COLORS['GREEN']}Got {len(result['recommendations'])} recommendations:{COLORS['ENDC']}")
        for i, rec in enumerate(result['recommendations'][:3], 1):
            print(f"{COLORS['BLUE']}\n{i}. {rec['name']} ({rec['nameArabic']}){COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Score: {rec['score']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Category: {rec['category']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Temperature: {rec['temperature']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Caffeine: {rec['caffeineLevel']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Reasons: {', '.join(rec['reasons'])}{COLORS['ENDC']}")
    else:
        print(f"{COLORS['RED']}Error: {result.get('error')}{COLORS['ENDC']}")

    return response.status_code == 200

def test_recommendation_without_song():
    """Test recommendation without song"""
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 3: Recommendation WITHOUT Song (Happy Mood){COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    data = {
        "user_id": "user_test456",
        "email": "test2@example.com",
        "mood": "Happy",
        "song": None,
        "location": {
            "latitude": 30.0543978,
            "longitude": 31.453874,
            "city": "Cairo"
        },
        "weather": {
            "temperature": 28,
            "condition": "sunny"
        },
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    response = requests.post(f"{BASE_URL}/recommend", json=data)
    print(f"{COLORS['BLUE']}Status Code: {response.status_code}{COLORS['ENDC']}")
    result = response.json()

    if result.get('success'):
        print(f"\n{COLORS['GREEN']}Got {len(result['recommendations'])} recommendations:{COLORS['ENDC']}")
        for i, rec in enumerate(result['recommendations'][:3], 1):
            print(f"{COLORS['BLUE']}\n{i}. {rec['name']} ({rec['nameArabic']}){COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Score: {rec['score']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Category: {rec['category']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Temperature: {rec['temperature']}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Reasons: {', '.join(rec['reasons'])}{COLORS['ENDC']}")
    else:
        print(f"{COLORS['RED']}Error: {result.get('error')}{COLORS['ENDC']}")

    return response.status_code == 200

def test_all_moods():
    """Test all available moods"""
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 4: Testing All Moods{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    moods = ["Happy", "Calm", "Energetic", "Tired", "Romantic", "Focused"]

    for mood in moods:
        data = {
            "user_id": f"user_mood_test_{mood.lower()}",
            "email": "mood_test@example.com",
            "mood": mood,
            "song": None,
            "weather": {"temperature": 20, "condition": "clear"},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        response = requests.post(f"{BASE_URL}/recommend", json=data)
        result = response.json()

        if result.get('success') and result['recommendations']:
            top_drink = result['recommendations'][0]
            print(f"\n{COLORS['BLUE']}{mood:12} → {top_drink['name']:30} (score: {top_drink['score']}){COLORS['ENDC']}")
        else:
            print(f"\n{COLORS['YELLOW']}{mood:12} → Error or no recommendations{COLORS['ENDC']}")

def test_stats():
    """Test statistics endpoint"""
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 5: Model Statistics{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    response = requests.get(f"{BASE_URL}/stats")
    print(f"{COLORS['BLUE']}Status Code: {response.status_code}{COLORS['ENDC']}")
    result = response.json()

    if result.get('success'):
        print(f"\n{COLORS['GREEN']}Model Statistics:{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}   Total Drinks: {result['total_drinks']}{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}\n   By Category:{COLORS['ENDC']}")
        for cat, count in result['categories'].items():
            print(f"{COLORS['BLUE']}      {cat}: {count}{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}\n   By Temperature:{COLORS['ENDC']}")
        for temp, count in result['temperatures'].items():
            print(f"{COLORS['BLUE']}      {temp}: {count}{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}\n   By Caffeine Level:{COLORS['ENDC']}")
        for caff, count in result['caffeine_levels'].items():
            print(f"{COLORS['BLUE']}      {caff}: {count}{COLORS['ENDC']}")
    else:
        print(f"{COLORS['RED']}Error: {result.get('error')}{COLORS['ENDC']}")

    return response.status_code == 200

def main():
    """Run all tests"""
    print(f"\n{COLORS['BLUE']}STARTING API TESTS{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    tests = [
        ("Health Check", test_health_check),
        ("Recommendation with Song", test_recommendation_with_song),
        ("Recommendation without Song", test_recommendation_without_song),
        ("All Moods", test_all_moods),
        ("Statistics", test_stats)
    ]

    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except requests.exceptions.ConnectionError:
            print(f"\n{COLORS['RED']}ERROR: Could not connect to {BASE_URL}{COLORS['ENDC']}")
            print(f"{COLORS['BLUE']}   Make sure the Flask server is running!{COLORS['ENDC']}")
            return
        except Exception as e:
            print(f"\n{COLORS['RED']}ERROR in {test_name}: {e}{COLORS['ENDC']}")
            results.append((test_name, False))

    # Print summary
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST SUMMARY{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    for test_name, success in results:
        status = f"{COLORS['GREEN']}PASS{COLORS['ENDC']}" if success else f"{COLORS['RED']}FAIL{COLORS['ENDC']}"
        print(f"{status} - {test_name}")

    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\n{COLORS['BLUE']}{passed}/{total} tests passed{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}\n")

if __name__ == "__main__":
    main()
