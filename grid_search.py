from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from datasets import load_dataset
import numpy as np
from sklearn.metrics import accuracy_score
import itertools
import pandas as pd
# Models and datasets 
models_list = [
    "openai/clip-vit-base-patch32", "google/vit-base-patch16-224", 
    "facebook/blip-base", "facebook/deit-base-distilled-patch16-224",
    "facebook/resnet-50", "google/efficientnet-b4", 
    "facebook/densenet-121", "google/mobilenet-v2", 
    "yolov5", "facebook/detectron2-retinanet"
]
datasets_list = [
    "imagenet", "cifar10", "mnist", 
    "coco", "voc", 
    "celeba", "stl10", 
    "tiny-imagenet", "fashion-mnist", 
    "lsun"
]

# My function to load a model
def load_model(model_ckpt):
    model = AutoModelForImageClassification.from_pretrained(model_ckpt)
    extractor = AutoFeatureExtractor.from_pretrained(model_ckpt)
    return model, extractor

# My function to evaluate a model
def evaluate_model(model, extractor, dataset_name):
    dataset = load_dataset(dataset_name, split="test") # Adjust split if needed
    # Preprocess and predict
    # ... (add code for preprocessing and predicting)
    # Calculate accuracy or other metrics
    accuracy = accuracy_score(true_labels, predictions)
    return accuracy

# Storing results
results = {}

# Grid search
for model_name, dataset_name in itertools.product(models_list, datasets_list):
    model, extractor = load_model(model_name)
    accuracy = evaluate_model(model, extractor, dataset_name)
    results[(model_name, dataset_name)] = accuracy

# Finding the best model and dataset
best_combination = max(results, key=results.get)
best_accuracy = results[best_combination]

print(f"Best Model-Dataset Combination: {best_combination} with Accuracy: {best_accuracy}")

#################


# Convert the hypothetical results to DataFrame
results_df = pd.DataFrame(results, index=datasets_list)
results_df = results_df.transpose()
results_df.insert(0, "Model/Dataset", results_df.index)
results_df.reset_index(drop=True, inplace=True)

# Save to CSV
csv_filename = 'model_dataset_results.csv'
results_df.to_csv(csv_filename, index=False)

print(f"Results saved to {csv_filename}") 
