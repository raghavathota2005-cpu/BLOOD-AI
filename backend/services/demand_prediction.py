import json
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "trained_models",
    "blood_demand_model.json"
)


def predict_demand(blood_group, day):

    if not os.path.exists(MODEL_PATH):
        return {"error": "Model file not found. Train the model first."}

    with open(MODEL_PATH, "r") as file:
        models = json.load(file)

    if blood_group not in models:
        return {"error": "Unsupported blood group"}

    model = models[blood_group]

    prediction = (
        model["slope"] * day
        + model["intercept"]
    )

    return {
        "blood_group": blood_group,
        "predicted_demand": max(0, round(prediction)),
        "note": "Experimental estimate using synthetic data"
    }