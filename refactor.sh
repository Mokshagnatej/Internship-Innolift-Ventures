#!/bin/bash
set -e

# Target directory
TARGET="Track-3/DAY-14"
SOURCE="Day_14"

cd "$TARGET"

# Create structured directories
mkdir -p app/templates app/static
mkdir -p model_src models data

# Move templates and static from source if we haven't already
cp -r ../../"$SOURCE"/templates/* app/templates/
cp -r ../../"$SOURCE"/static/* app/static/

# Move model artifacts
cp ../../"$SOURCE"/best_model.pkl models/
cp ../../"$SOURCE"/scaler.pkl models/
cp ../../"$SOURCE"/feature_names.pkl models/
cp ../../"$SOURCE"/developer_productivity.csv data/

# Copy train_model script
cp ../../"$SOURCE"/train_model.py model_src/train.py

# Create requirements
cp ../../"$SOURCE"/requirements.txt ./

# Create config.py
cat << 'CONFIG_EOF' > config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_model.pkl')
    SCALER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'scaler.pkl')
    FEATURES_PATH = os.path.join(os.path.dirname(__file__), 'models', 'feature_names.pkl')
CONFIG_EOF

# Create app/__init__.py
cat << 'INIT_EOF' > app/__init__.py
from flask import Flask
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
INIT_EOF

# Create app/routes.py
cat << 'ROUTES_EOF' > app/routes.py
from flask import Blueprint, render_template, request, current_app
import pickle
import numpy as np
import os

bp = Blueprint('main', __name__)

# Group features for better UI
feature_groups = {
    'Experience & Workload': ['years_of_experience', 'hours_worked_per_day', 'team_size'],
    'Output Metrics': ['bugs_fixed_per_week', 'code_reviews_completed', 'github_commits_per_week', 'story_points_completed'],
    'Habits & Environment': ['meetings_per_week', 'coffee_cups_per_day', 'StackOverflow_visits']
}

# Cache for loaded artifacts
_model = None
_scaler = None
_feature_names = None

def load_artifacts():
    global _model, _scaler, _feature_names
    if _model is None:
        with open(current_app.config['MODEL_PATH'], 'rb') as f:
            _model = pickle.load(f)
        with open(current_app.config['SCALER_PATH'], 'rb') as f:
            _scaler = pickle.load(f)
        with open(current_app.config['FEATURES_PATH'], 'rb') as f:
            _feature_names = pickle.load(f)
    return _model, _scaler, _feature_names

@bp.route('/', methods=['GET'])
def index():
    return render_template('index.html', feature_groups=feature_groups)

@bp.route('/predict', methods=['POST'])
def predict():
    try:
        model, scaler, feature_names = load_artifacts()
        
        input_data = [float(request.form.get(f, 0)) for f in feature_names]
        input_scaled = scaler.transform([input_data])
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1]
        
        result_text = "Highly Productive" if prediction == 1 else "Needs Improvement"
        
        return render_template('result.html', 
                             prediction=result_text, 
                             probability=round(probability * 100, 1),
                             features=zip(feature_names, input_data))
    except Exception as e:
        return str(e)
ROUTES_EOF

# Create run.py
cat << 'RUN_EOF' > run.py
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
RUN_EOF

# Clean up redundant files in Track-3/DAY-14
rm -f app.py train_model.py scaffold.py update_app.py
rm -rf templates static

echo "Refactoring complete."
