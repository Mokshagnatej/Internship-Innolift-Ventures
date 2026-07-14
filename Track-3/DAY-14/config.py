import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cloudwatch-anomaly-secret-key'
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'machine_learning', 'artifacts', 'model.pkl')
