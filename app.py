from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Configuration de la base de données
# Pour Render, vous pouvez définir DATABASE_URL dans vos variables d'environnement
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Counter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tests_commences = db.Column(db.Integer, default=0)
    tests_finies = db.Column(db.Integer, default=0)

with app.app_context():
    db.create_all()
    counter = Counter.query.first()
    if not counter:
        counter = Counter(tests_commences=0, tests_finies=0)
        db.session.add(counter)
        db.session.commit()

@app.route('/')
def home():
    return "Flask fonctionne avec Render !"

@app.route('/start_test', methods=['POST'])
def start_test():
    data = request.get_json()
    print("Données reçues par Flask :", data)

    # Protection anti-bot simple (champ honeypot)
    honeypot_value = data.get("antiBot", "")
    if honeypot_value:
        return jsonify({"success": False, "message": "Bot détecté (honeypot)"}), 403

    counter = Counter.query.first()
    counter.tests_commences += 1
    db.session.commit()
    return jsonify({"success": True, "tests_commences": counter.tests_commences})

@app.route('/finish_test', methods=['POST'])
def finish_test():
    counter = Counter.query.first()
    counter.tests_finies += 1
    db.session.commit()
    return jsonify({"message": "Test terminé", "tests_finies": counter.tests_finies})

@app.route('/stats', methods=['GET'])
def get_stats():
    counter = Counter.query.first()
    return jsonify({"tests_commences": counter.tests_commences, "tests_finies": counter.tests_finies})

if __name__ == '__main__':
    app.run(debug=True)





