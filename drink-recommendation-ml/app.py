"""Flask API entrypoint for health checks, recommendation requests, and model maintenance."""
from datetime import datetime
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from model.predictor import DrinkPredictor

load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    predictor = DrinkPredictor(model_path='model')
    print("Predictor initialized successfully")
except Exception as e:
    print(f"Warning: Could not load model - {e}")
    print("Run 'python model/train_model.py' first to train the model")
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

        print("\nReceived request from app:")
        print(f"   User: {user_data.get('email', 'unknown')}")
        print(f"   Mood: {user_data.get('mood', 'unknown')}")
        print(f"   Song: {user_data.get('song', 'None')}")
        print(
            f"   Weather: {user_data.get('weather', {}).get('temperature', '?')} C, "
            f"{user_data.get('weather', {}).get('condition', '?')}"
        )

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

        result = predictor.predict(user_data)

        if result['success']:
            print(f"\nReturning {len(result.get('recommendations', []))} recommendations:")
            for i, rec in enumerate(result.get('recommendations', [])[:3], 1):
                print(f"   {i}. {rec['name']} (score: {rec['score']})")

        return jsonify(result), 200

    except Exception as e:
        print(f"\nError processing request: {e}")
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

        print("\nStarting model retraining...")
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
        print(f"\nError retraining model: {e}")
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

    app.run(
        host=host,
        port=port,
        debug=True,
    )
