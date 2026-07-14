import pickle

try:
    with open('../../model.pkl', 'rb') as f:
        model = pickle.load(f)
    print(type(model))
    if hasattr(model, 'feature_names_in_'):
        print("Features:", model.feature_names_in_)
    else:
        print("Model doesn't have feature_names_in_ attribute.")
except Exception as e:
    print("Error:", e)
