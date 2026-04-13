import requests

OPENROUTER_API_KEY = "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"

def call_ai(prompt):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Interview Simulator"
        },
        json={
            "model": "openrouter/auto",
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    data = response.json()
    print("OpenRouter response:", data)
    if "choices" in data:
        return data["choices"][0]["message"]["content"]
    else:
        return "Error: " + str(data)

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