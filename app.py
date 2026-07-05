from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# Google Search Console verification
@app.route('/google56d6260d12f2903f.html')
def google_verification():
    return send_from_directory('static', 'google56d6260d12f2903f.html')

if __name__ == '__main__':
    app.run(debug=True)
