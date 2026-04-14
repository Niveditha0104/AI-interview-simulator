import requests

GEMINI_API_KEY = "AIzaSyAiz7ee-Z0kgIejRzORx4h45vwn66FhG1I"

def call_ai(prompt):
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}",
        headers={"Content-Type": "application/json"},
        json={"contents": [{"parts": [{"text": prompt}]}]},
        timeout=30
    )
    data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except:
        return "QUESTION: Write a function to reverse a string.\nEXAMPLE_INPUT: 'hello'\nEXAMPLE_OUTPUT: 'olleh'"

def generate_question(topic, difficulty):
    prompt = f"""You are a coding interview expert.
Generate ONE coding interview question on the topic: {topic}
Difficulty level: {difficulty}

Return in this exact format:
QUESTION: (the question here)
EXAMPLE_INPUT: (example input)
EXAMPLE_OUTPUT: (expected output)

Keep it clear and concise."""
    return call_ai(prompt)

def evaluate_answer(question, user_code, topic):
    prompt = f"""You are a coding interview evaluator.

Question: {question}
Topic: {topic}
Candidate's code:
{user_code}

Evaluate and respond in this exact format:
SCORE: (number 0-100)
FEEDBACK: (what is good and what is wrong)
MISSING: (edge cases or improvements missing)
IDEAL_SOLUTION: (best solution with explanation)"""
    return call_ai(prompt)