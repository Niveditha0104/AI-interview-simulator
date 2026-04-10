import os
from google import genai

client = genai.Client(api_key="AIzaSyA8Yjsu4AuTPC853ty0wEq9vtJ4YE5hGwk")

def generate_question(topic, difficulty):
    prompt = f"""
    You are a coding interview expert.
    Generate ONE coding interview question on the topic: {topic}
    Difficulty level: {difficulty}
    
    Return your response in this exact format:
    QUESTION: (the question here)
    EXAMPLE_INPUT: (example input)
    EXAMPLE_OUTPUT: (expected output)
    
    Keep it clear and concise.
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text

def evaluate_answer(question, user_code, topic):
    prompt = f"""
    You are a coding interview evaluator.
    
    Question: {question}
    Topic: {topic}
    Candidate's code:
    {user_code}
    
    Evaluate this code and respond in this exact format:
    SCORE: (number between 0 and 100)
    FEEDBACK: (what is good and what is wrong)
    MISSING: (what edge cases or improvements are missing)
    IDEAL_SOLUTION: (the best solution with explanation)
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text