import os
import pickle

try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'artifacts', 'model.pkl')
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(type(model))
    if hasattr(model, 'feature_names_in_'):
        print("Features:", model.feature_names_in_)
    else:
        print("Model doesn't have feature_names_in_ attribute.")
except Exception as e:
    print("Error:", e)
