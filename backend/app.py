import os
from flask import Flask, request, jsonify
import traceback
from flask_cors import CORS
import genai  # Assuming you have the necessary library for Gemini API

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Ensure the 'uploads' directory exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Route to handle email generation
@app.route("/generate-email", methods=["POST"])
def generate_email():
    try:
        data = request.json
        resume = data.get("resumeText", "")
        job = data.get("jobDescription", "")

        # Debug: Print the incoming data
        print(f"Received Resume: {resume[:100]}...")  # Print only first 100 chars for debugging
        print(f"Received Job Description: {job[:100]}...")

        if not resume or not job:
            return jsonify({'error': 'Missing resume or job description'}), 400

        # Construct the prompt for the AI
        prompt = f"""
        Write a personalized job application email using the following resume and job description.

        Resume:
        {resume}

        Job Description:
        {job}

        Format:
        - Include a subject line
        - Address the hiring manager
        - Highlight qualifications
        - Express interest
        - Close professionally
        """

        # Use Gemini (or other model) for content generation
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)

        # Log and check if response has content
        print(f"Gemini Response: {response.text[:100]}...")  # Log first 100 chars of response

        generated_email = response.text.strip()
        if not generated_email:
            return jsonify({'error': 'Failed to generate email, empty response from Gemini API'}), 500

        return jsonify({'email': generated_email})

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f"Gemini API error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=False)





