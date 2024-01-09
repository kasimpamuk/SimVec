import json
import numpy as np
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from transformers import AutoFeatureExtractor, AutoModel
from datasets import load_dataset
from PIL import Image
import io

model_ckpt = "facebook/detr-resnet-50"
extractor = AutoFeatureExtractor.from_pretrained(model_ckpt)
model = AutoModel.from_pretrained(model_ckpt)

def extract_embeddings(image):
    image_pp = extractor(image, return_tensors="pt")
    features = model(**image_pp).last_hidden_state[:, 0].detach().numpy()
    return features.squeeze()

seed = 42
num_samples = 100
dataset = load_dataset("zh-plus/tiny-imagenet", split="train")
candidate_dataset = dataset.shuffle(seed=seed).select(range(num_samples))
dataset_with_embeddings = candidate_dataset.map(lambda example: {'embeddings': extract_embeddings(example["image"])})
dataset_with_embeddings.add_faiss_index(column='embeddings')

def get_neighbors(query_image, top_k=5):
    qi_embedding = model(**extractor(query_image, return_tensors="pt"))
    qi_embedding = qi_embedding.last_hidden_state[:, 0].detach().numpy().squeeze()
    scores, retrieved_examples = dataset_with_embeddings.get_nearest_examples('embeddings', qi_embedding, k=top_k)
    return scores, retrieved_examples

def image_grid(imgs, rows, cols):
    w, h = imgs[0].size
    grid = Image.new('RGB', size=(cols*w, rows*h))
    for i, img in enumerate(imgs):
        grid.paste(img, box=(i%cols*w, i//cols*h))
    return grid

@csrf_exempt
@require_http_methods(["POST"])
def image_based_search(request):
    try:
        image = request.FILES.get('image').read()
        top_k = int(request.POST.get('topk', 5))

        scores, retrieved_examples = get_neighbors(image, top_k=top_k)

        images = [Image.open(io.BytesIO(image))]
        images.extend([Image.open(io.BytesIO(img)) for img in retrieved_examples["image"]])
        result_image = image_grid(images, 1, len(images) + 1)

        response = HttpResponse(content_type="image/jpeg")
        result_image.save(response, "JPEG")
        return response

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def text_based_search(request):
    return JsonResponse({'message': 'Text based search not yet implemented'}, status=501)

@csrf_exempt
@require_http_methods(["POST"])
def image_embedding_and_storage(request):
    try:
        image_paths = request.body.decode('utf-8').split('\n')  
        embeddings = []
        for image_path in image_paths:
            with open(image_path, 'rb') as img_file:
                image = Image.open(img_file)
                embedding = extract_embeddings(image)
                embeddings.append(embedding)

        with open('embeddings.json', 'w') as f:
            json.dump(embeddings, f)
        return JsonResponse({'message': 'Images processed and embeddings stored', 'embeddings': embeddings})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

