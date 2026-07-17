import os
import sys

# Add the parent directory to Python path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, mail
from flask_mail import Message

app = create_app()

def test_email():
    with app.app_context():
        try:
            msg = Message("Test Subject", recipients=[app.config['MAIL_DEFAULT_SENDER']])
            msg.body = "Test email body"
            mail.send(msg)
            print("Email sent successfully!")
        except Exception as e:
            print("Failed to send email!")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {e}")

if __name__ == "__main__":
    test_email()
