from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import requests
app = Flask(__name__)
CORS(app)  # Autoriser les requêtes depuis React

RECAPTCHA_SECRET_KEY = "6LdAJvMqAAAAAKP1relcls94Fr9119xNWIqOa4FZ"

# Fichier pour stocker les compteurs
DATA_FILE = "compteurs.json"

def verify_recaptcha(token):
    """ Vérifie le jeton reCAPTCHA avec Google """
    url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {"secret": RECAPTCHA_SECRET_KEY, "response": token}
    response = requests.post(url, data=payload)
    result = response.json()
    print("Google reCAPTCHA Response:", result)
    return result.get("success", False) and result.get("score", 0) > 0.5  # Seuil anti-bot

def load_counters():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            return data.get("tests_commences", 0), data.get("tests_finies", 0)
    return 0, 0

def save_counters(tests_commences, tests_finies):
    with open(DATA_FILE, "w") as f:
        json.dump({"tests_commences": tests_commences, "tests_finies": tests_finies}, f)

# Charger les compteurs au démarrage du serveur
tests_commences, tests_finies = load_counters()
@app.route('/')
def home():
    return "Flask fonctionne avec ngrok !"

@app.route('/start_test', methods=['POST'])
def start_test():
    global tests_commences
    data = request.get_json()
    print("Données reçues par Flask :", data)
    token = data.get("token", "")

    if not verify_recaptcha(token):
        return jsonify({"success": False, "message": "Captcha invalide"}), 403

    tests_commences += 1
    return jsonify({"success": True, "tests_commences": tests_commences})

@app.route('/finish_test', methods=['POST'])
def finish_test():
    global tests_finies
    tests_finies += 1
    save_counters(tests_commences, tests_finies)
    return jsonify({"message": "Test terminé", "tests_finies": tests_finies})

@app.route('/stats', methods=['GET'])
def get_stats():
    return jsonify({"tests_commences": tests_commences, "tests_finies": tests_finies})

if __name__ == '__main__':
    app.run(debug=True)



