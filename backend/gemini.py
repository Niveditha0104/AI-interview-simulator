import requests

OPENROUTER_API_KEY = "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"

def call_ai(prompt):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ai-interview-simulator-five.vercel.app",
            "X-Title": "AI Interview Simulator"
        },
        json={
            "model": "meta-llama/llama-3.3-70b-instruct:free",
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