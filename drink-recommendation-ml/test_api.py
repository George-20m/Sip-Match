#!/usr/bin/env python3
"""Manual smoke-test script for the local Flask recommendation API."""
import requests
import json
from datetime import datetime

<<<<<<< HEAD
=======
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

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
# API base URL
BASE_URL = "http://192.168.110.63:3000"

def test_health_check():
    """Test the health check endpoint"""
<<<<<<< HEAD
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
=======
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 1: Health Check{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    response = requests.get(f"{BASE_URL}/")
    print(f"{COLORS['BLUE']}Status Code: {response.status_code}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}Response: {json.dumps(response.json(), indent=2)}{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    return response.status_code == 200

def test_recommendation_with_song():
    """Test recommendation with song"""
<<<<<<< HEAD
    print("\n" + "="*60)
    print("TEST 2: Recommendation WITH Song (Energetic Mood)")
    print("="*60)
    
=======
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 2: Recommendation WITH Song (Energetic Mood){COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
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
<<<<<<< HEAD
    
    response = requests.post(f"{BASE_URL}/recommend", json=data)
    print(f"Status Code: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        print(f"\n✅ Got {len(result['recommendations'])} recommendations:")
        for i, rec in enumerate(result['recommendations'][:3], 1):
            print(f"\n{i}. {rec['name']} ({rec['nameArabic']})")
            print(f"   Score: {rec['score']}")
            print(f"   Category: {rec['category']}")
            print(f"   Temperature: {rec['temperature']}")
            print(f"   Caffeine: {rec['caffeineLevel']}")
            print(f"   Reasons: {', '.join(rec['reasons'])}")
    else:
        print(f"❌ Error: {result.get('error')}")
    
=======

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

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    return response.status_code == 200

def test_recommendation_without_song():
    """Test recommendation without song"""
<<<<<<< HEAD
    print("\n" + "="*60)
    print("TEST 3: Recommendation WITHOUT Song (Happy Mood)")
    print("="*60)
    
=======
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 3: Recommendation WITHOUT Song (Happy Mood){COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
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
<<<<<<< HEAD
    
    response = requests.post(f"{BASE_URL}/recommend", json=data)
    print(f"Status Code: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        print(f"\n✅ Got {len(result['recommendations'])} recommendations:")
        for i, rec in enumerate(result['recommendations'][:3], 1):
            print(f"\n{i}. {rec['name']} ({rec['nameArabic']})")
            print(f"   Score: {rec['score']}")
            print(f"   Category: {rec['category']}")
            print(f"   Temperature: {rec['temperature']}")
            print(f"   Reasons: {', '.join(rec['reasons'])}")
    else:
        print(f"❌ Error: {result.get('error')}")
    
=======

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

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    return response.status_code == 200

def test_all_moods():
    """Test all available moods"""
<<<<<<< HEAD
    print("\n" + "="*60)
    print("TEST 4: Testing All Moods")
    print("="*60)
    
    moods = ["Happy", "Calm", "Energetic", "Tired", "Romantic", "Focused"]
    
=======
    print(f"\n{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}TEST 4: Testing All Moods{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

    moods = ["Happy", "Calm", "Energetic", "Tired", "Romantic", "Focused"]

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    for mood in moods:
        data = {
            "user_id": f"user_mood_test_{mood.lower()}",
            "email": "mood_test@example.com",
            "mood": mood,
            "song": None,
            "weather": {"temperature": 20, "condition": "clear"},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
<<<<<<< HEAD
        
        response = requests.post(f"{BASE_URL}/recommend", json=data)
        result = response.json()
        
        if result.get('success') and result['recommendations']:
            top_drink = result['recommendations'][0]
            print(f"\n{mood:12} → {top_drink['name']:30} (score: {top_drink['score']})")
        else:
            print(f"\n{mood:12} → Error or no recommendations")

def test_stats():
    """Test statistics endpoint"""
    print("\n" + "="*60)
    print("TEST 5: Model Statistics")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/stats")
    print(f"Status Code: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        print(f"\n✅ Model Statistics:")
        print(f"   Total Drinks: {result['total_drinks']}")
        print(f"\n   By Category:")
        for cat, count in result['categories'].items():
            print(f"      {cat}: {count}")
        print(f"\n   By Temperature:")
        for temp, count in result['temperatures'].items():
            print(f"      {temp}: {count}")
        print(f"\n   By Caffeine Level:")
        for caff, count in result['caffeine_levels'].items():
            print(f"      {caff}: {count}")
    else:
        print(f"❌ Error: {result.get('error')}")
    
=======

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

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    return response.status_code == 200

def main():
    """Run all tests"""
<<<<<<< HEAD
    print("\n🧪 STARTING API TESTS")
    print("="*60)
    
=======
    print(f"\n{COLORS['BLUE']}STARTING API TESTS{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'='*60}{COLORS['ENDC']}")

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    tests = [
        ("Health Check", test_health_check),
        ("Recommendation with Song", test_recommendation_with_song),
        ("Recommendation without Song", test_recommendation_without_song),
        ("All Moods", test_all_moods),
        ("Statistics", test_stats)
    ]
<<<<<<< HEAD
    
=======

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except requests.exceptions.ConnectionError:
<<<<<<< HEAD
            print(f"\n❌ ERROR: Could not connect to {BASE_URL}")
            print("   Make sure the Flask server is running!")
            return
        except Exception as e:
            print(f"\n❌ ERROR in {test_name}: {e}")
            results.append((test_name, False))
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\n{passed}/{total} tests passed")
    print("="*60 + "\n")
=======
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
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

if __name__ == "__main__":
    main()
