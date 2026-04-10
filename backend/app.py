import jwt
import datetime
import bcrypt
import pymysql
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_db

app = Flask(__name__)
CORS(app)

# -------- REGISTER API --------
@app.route('/register', methods=['POST'])
def register():

    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    )

    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        (name, email, hashed_password)
    )
    db.commit()
    db.close()

    return jsonify({"message": "Account created successfully!"}), 201


# -------- LOGIN API --------
@app.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    email = data['email']
    password = data['password']

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    db.close()

    if not user:
        return jsonify({"error": "Email not found"}), 404

    stored_password = user[3]
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        return jsonify({"error": "Wrong password"}), 401

    token = jwt.encode({
        "user_id": user[0],
        "name": user[1],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, "secret_key", algorithm="HS256")

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "name": user[1]
    }), 200


# -------- HOME ROUTE --------
@app.route('/')
def home():
    return jsonify({"message": "Server is running!"})

from gemini import generate_question, evaluate_answer

# -------- GENERATE QUESTION API --------
@app.route('/question', methods=['POST'])
def get_question():

    data = request.get_json()
    topic = data['topic']
    difficulty = data['difficulty']

    # call gemini
    question_text = generate_question(topic, difficulty)

    # save question to database
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO questions (topic, difficulty, question_text) VALUES (%s, %s, %s)",
        (topic, difficulty, question_text)
    )
    db.commit()
    question_id = cursor.lastrowid
    db.close()

    return jsonify({
        "question_id": question_id,
        "question": question_text
    }), 200


# -------- EVALUATE ANSWER API --------
@app.route('/evaluate', methods=['POST'])
def evaluate():

    data = request.get_json()
    user_code = data['code']
    question_text = data['question']
    question_id = data['question_id']
    user_id = data['user_id']
    topic = data['topic']

    # call gemini to evaluate
    result = evaluate_answer(question_text, user_code, topic)

    # parse the result
    lines = result.strip().split('\n')
    score = 0
    feedback = result

    for line in lines:
        if line.startswith('SCORE:'):
            try:
                score = int(line.replace('SCORE:', '').strip())
            except:
                score = 0

    # save attempt to database
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """INSERT INTO attempts 
        (user_id, question_id, user_code, score, feedback) 
        VALUES (%s, %s, %s, %s, %s)""",
        (user_id, question_id, user_code, score, feedback)
    )
    db.commit()
    db.close()

    return jsonify({
        "score": score,
        "feedback": result
    }), 200
# -------- GET ATTEMPTS API --------
@app.route('/attempts/<int:user_id>', methods=['GET'])
def get_attempts(user_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT a.score, a.attempted_at, q.topic
        FROM attempts a
        JOIN questions q ON a.question_id = q.id
        WHERE a.user_id = %s
        ORDER BY a.attempted_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    db.close()

    attempts = []
    for row in rows:
        attempts.append({
            "score": row[0],
            "attempted_at": str(row[1]),
            "topic": row[2]
        })

    return jsonify({"attempts": attempts}), 200
# app.run() is ALWAYS the very last line
if __name__ == '__main__':
    app.run(debug=True)