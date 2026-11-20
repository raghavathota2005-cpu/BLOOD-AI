import json
import os

data = {
    "day": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "O+": [20, 22, 18, 25, 24, 28, 30, 27, 32, 35, 33, 38],
    "A+": [15, 18, 16, 20, 19, 22, 24, 23, 25, 28, 27, 30],
    "B+": [10, 12, 11, 14, 13, 15, 17, 16, 19, 20, 18, 22],
    "AB+": [5, 6, 5, 7, 8, 7, 9, 10, 9, 11, 12, 13]
}


def train_model(x, y):
    n = len(x)

    mean_x = sum(x) / n
    mean_y = sum(y) / n

    numerator = sum(
        (x[i] - mean_x) * (y[i] - mean_y)
        for i in range(n)
    )

    denominator = sum(
        (value - mean_x) ** 2 for value in x
    )

    slope = numerator / denominator
    intercept = mean_y - slope * mean_x

    return {
        "slope": slope,
        "intercept": intercept
    }


models = {}

for group in ["O+", "A+", "B+", "AB+"]:
    models[group] = train_model(
        data["day"],
        data[group]
    )


os.makedirs("trained_models", exist_ok=True)

with open("trained_models/blood_demand_model.json", "w") as file:
    json.dump(models, file, indent=4)


print("BLOOD AI MODEL TRAINED SUCCESSFULLY!")
print("All models saved successfully!")