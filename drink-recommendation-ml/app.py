"""Flask API entrypoint for health checks, recommendation requests, and model maintenance."""
from datetime import datetime
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from model.predictor import DrinkPredictor

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
load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    predictor = DrinkPredictor(model_path='model')
<<<<<<< HEAD
    print("Predictor initialized successfully")
except Exception as e:
    print(f"Warning: Could not load model - {e}")
    print("Run 'python model/train_model.py' first to train the model")
=======
    print(f"{COLORS['GREEN']}Predictor initialized successfully{COLORS['ENDC']}")
except Exception as e:
    print(f"{COLORS['YELLOW']}Warning: Could not load model - {e}{COLORS['ENDC']}")
    print(f"{COLORS['YELLOW']}Run 'python model/train_model.py' first to train the model{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    predictor = None


@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'running',
        'model_loaded': predictor is not None,
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
    })


@app.route('/recommend', methods=['POST'])
def recommend_drink():
    """
    Main recommendation endpoint.
    Expects JSON with: user_id, email, mood, song, location, weather, timestamp
    """
    try:
        user_data = request.get_json()

<<<<<<< HEAD
        print("\nReceived request from app:")
        print(f"   User: {user_data.get('email', 'unknown')}")
        print(f"   Mood: {user_data.get('mood', 'unknown')}")
        print(f"   Song: {user_data.get('song', 'None')}")
        print(
            f"   Weather: {user_data.get('weather', {}).get('temperature', '?')} C, "
            f"{user_data.get('weather', {}).get('condition', '?')}"
        )
=======
        print(f"\n{COLORS['BLUE']}Received request from app:{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}   User: {user_data.get('name', 'unknown')}{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}   Mood: {user_data.get('mood', 'unknown')}{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}   Song: {user_data.get('song', 'None')}{COLORS['ENDC']}")
        print(
            f"{COLORS['BLUE']}   Weather: {user_data.get('weather', {}).get('temperature', '?')} C, "
            f"{user_data.get('weather', {}).get('condition', '?')}{COLORS['ENDC']}"
        )
        print(f"{COLORS['BLUE']}   Location: {user_data.get('location', {}).get('city', 'unknown')} ({user_data.get('location', {}).get('latitude', '?')}, {user_data.get('location', {}).get('longitude', '?')}){COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}   Timestamp: {user_data.get('timestamp', 'unknown')}{COLORS['ENDC']}")
        print(f"{COLORS['BLUE']}   Favorites: {len(user_data.get('userFavorites', []))} drinks{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

        if not user_data or 'mood' not in user_data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: mood',
                'recommendations': [],
            }), 400

        if predictor is None:
            return jsonify({
                'success': False,
                'error': 'Model not trained. Run train_model.py first.',
                'recommendations': [],
            }), 500

<<<<<<< HEAD
        result = predictor.predict(user_data)

        if result['success']:
            print(f"\nReturning {len(result.get('recommendations', []))} recommendations:")
            for i, rec in enumerate(result.get('recommendations', [])[:3], 1):
                print(f"   {i}. {rec['name']} (score: {rec['score']})")
=======
        result = predictor.predict(user_data, user_favorites=user_data.get('userFavorites', []))

        if result['success']:
            print(f"\n{COLORS['GREEN']}Returning {len(result.get('recommendations', []))} recommendations:{COLORS['ENDC']}")
            for i, rec in enumerate(result.get('recommendations', []), 1):
                print(f"{COLORS['BLUE']}   {i}. {rec['name']} (score: {rec['score']}){COLORS['ENDC']}")
                # print(f"{COLORS['BLUE']}      Category: {rec.get('category', 'unknown')} | Temp: {rec.get('temperature', 'unknown')} | Caffeine: {rec.get('caffeineLevel', 'unknown')}{COLORS['ENDC']}")
                print(f"{COLORS['BLUE']}      Reasons: {', '.join(rec.get('reasons', []))}{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

        return jsonify(result), 200

    except Exception as e:
<<<<<<< HEAD
        print(f"\nError processing request: {e}")
=======
        print(f"\n{COLORS['RED']}Error processing request: {e}{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'recommendations': [],
        }), 500


@app.route('/retrain', methods=['POST'])
def retrain_model():
    """Endpoint to retrain the model with fresh data from Convex."""
    try:
        from model.train_model import DrinkRecommendationModel

<<<<<<< HEAD
        print("\nStarting model retraining...")
=======
        print(f"\n{COLORS['BLUE']}Starting model retraining...{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
        model = DrinkRecommendationModel()

        if model.train():
            model.save_model()

            global predictor
            predictor = DrinkPredictor(model_path='model')

            return jsonify({
                'success': True,
                'message': 'Model retrained successfully',
            }), 200

        return jsonify({
            'success': False,
            'error': 'Training failed',
        }), 500

    except Exception as e:
<<<<<<< HEAD
        print(f"\nError retraining model: {e}")
=======
        print(f"\n{COLORS['RED']}Error retraining model: {e}{COLORS['ENDC']}")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
        }), 500


@app.route('/stats', methods=['GET'])
def get_stats():
    """Get model statistics."""
    try:
        if predictor is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded',
            }), 500

        stats = {
            'success': True,
            'total_drinks': len(predictor.drinks_df),
            'categories': predictor.drinks_df['category'].value_counts().to_dict(),
            'temperatures': predictor.drinks_df['temperature'].value_counts().to_dict(),
            'caffeine_levels': predictor.drinks_df['caffeineLevel'].value_counts().to_dict(),
        }

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
        }), 500


@app.route('/test', methods=['POST'])
def test_recommendation():
    """Test endpoint with sample data."""
    sample_data = {
        "user_id": "test_user",
        "email": "test@example.com",
        "mood": "Happy",
        "song": None,
        "location": {
            "latitude": 30.0543978,
            "longitude": 31.453874,
            "city": "Cairo",
        },
        "weather": {
            "temperature": 15,
            "condition": "cloudy",
        },
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

    user_data = request.get_json()
    if user_data:
        sample_data.update(user_data)

    result = predictor.predict(sample_data)
    return jsonify(result), 200


if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 3000))

<<<<<<< HEAD
    print(f"\n{'=' * 60}")
    print("DRINK RECOMMENDATION ML SYSTEM")
    print(f"{'=' * 60}")
    print(f"\nServer starting on http://{host}:{port}")
    print("\nAvailable Endpoints:")
    print(f"   GET  http://{host}:{port}/")
    print("        -> Health check")
    print(f"\n   POST http://{host}:{port}/recommend")
    print("        -> Get drink recommendations")
    print(f"\n   POST http://{host}:{port}/retrain")
    print("        -> Retrain model with latest data")
    print(f"\n   GET  http://{host}:{port}/stats")
    print("        -> Get model statistics")
    print(f"\n   POST http://{host}:{port}/test")
    print("        -> Test with sample data")
    print(f"\n{'=' * 60}\n")
=======
    print(f"\n{COLORS['BLUE']}{'=' * 60}{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}DRINK RECOMMENDATION ML SYSTEM{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}{'=' * 60}{COLORS['ENDC']}")
    print(f"\n{COLORS['BLUE']}Server starting on http://{host}:{port}{COLORS['ENDC']}")
    print(f"\n{COLORS['BLUE']}Available Endpoints:{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}   GET  http://{host}:{port}/            -> Health check{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}   POST http://{host}:{port}/recommend   -> Get drink recommendations{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}   POST http://{host}:{port}/retrain     -> Retrain model with latest data{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}   GET  http://{host}:{port}/stats       -> Get model statistics{COLORS['ENDC']}")
    print(f"{COLORS['BLUE']}   POST http://{host}:{port}/test        -> Test with sample data{COLORS['ENDC']}")
    print(f"\n{COLORS['BLUE']}{'=' * 60}{COLORS['ENDC']}\n")
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

    app.run(
        host=host,
        port=port,
        debug=True,
    )
