from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    # Arrange input values in the same order used during training
    features = [
        data["temp"],
        data["RH"],
        data["wind"],
        data["rain"],
        data["FFMC"],
        data["DMC"],
        data["DC"],
        data["ISI"],
        data["month"],
        data["day"],
        data["area"],
        data["region"]
    ]
    features = np.array(features).reshape(1, -1)

    # Raw prediction (class)
    raw_pred = model.predict(features)[0]

    # Try to get a numeric label: common options are 1/0 or 'yes'/'no'
    def to_label(val):
        if isinstance(val, str):
            return "yes" if val.lower() in ("yes", "y", "true", "1") else "no"
        if isinstance(val, (int, float, np.integer, np.floating)):
            return "yes" if float(val) == 1.0 else "no"
        if isinstance(val, bool):
            return "yes" if val else "no"
        return "yes" if str(val).lower() in ("1", "true", "yes", "y") else "no"

    label = to_label(raw_pred)

    # Try to compute probability for the predicted class when available
    prob = None
    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features)[0]
            # If classes_ exists, find index of the predicted class
            if hasattr(model, "classes_"):
                # Map label to class value used by the model
                def class_index_for_pred(pred_label):
                    for idx, cls in enumerate(model.classes_):
                        if to_label(cls) == pred_label:
                            return idx
                    return None
                idx = class_index_for_pred(label)
                if idx is not None:
                    prob = float(probs[idx])
                else:
                    prob = float(max(probs))
            else:
                prob = float(max(probs))
    except Exception:
        prob = None

    return jsonify({
        "label": label,
        "probability": prob
    })

if __name__ == "__main__":
    app.run(debug=True)
