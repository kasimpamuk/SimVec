# Django view for handling image or text conversion with external services
import json
import requests
import numpy as np
import csv
from glob import glob
from pathlib import Path
from statistics import mean
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from towhee import pipe, ops, DataCollection
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
#from django.core.files.storage import FileSystemStorage

##############
from PIL import Image
import pandas as pd
import torch
from transformers import CLIPProcessor, CLIPModel

# Load the dataset
dataset_path = 'reverse_image_search.csv'  # Replace with your dataset path
df = pd.read_csv(dataset_path)

# Load the CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")

search_params = {
    "metric_type": "L2", 
    "offset": 0, 
    "ignore_growing": False, 
    "params": {"nprobe": 10}
}

##############

# Towhee parameters
MODEL = 'resnet50'
DEVICE = None # if None, use default device (cuda is enabled if available)

# Milvus parameters
HOST = '127.0.0.1'
PORT = '19530'
TOPK = None # number of results to return

DIM = 512 
INDEX_TYPE = 'IVF_FLAT'
METRIC_TYPE = 'L2'

# path to csv (column_1 indicates image path) OR a pattern of image paths
INSERT_SRC = 'reverse_image_search.csv'
QUERY_SRC = './test/*/*.JPEG'

# Load image path
def load_image(x):
    if x.endswith('csv'):
        with open(x) as f:
            reader = csv.reader(f)
            next(reader)
            for item in reader:
                yield item[1]
    else:
        for item in glob(x):
            yield item

p_embed = (
    pipe.input('src')
    .flat_map('src', 'img_path', load_image)
    .map('img_path', 'img', ops.image_decode())
    .map('img', 'vec', ops.image_embedding.timm(model_name=MODEL, device=DEVICE))
)

# Create milvus collection (delete first if exists)
def create_milvus_collection(collection_name):
    if utility.has_collection(collection_name):
        utility.drop_collection(collection_name)
    
    fields = [
        FieldSchema(name='path', dtype=DataType.VARCHAR, description='path to image', max_length=500, 
                    is_primary=True, auto_id=False),
        FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, description='image embedding vectors', dim=DIM)
    ]
    schema = CollectionSchema(fields=fields, description='image search')
    collection = Collection(name=collection_name, schema=schema)

    index_params = {
        'metric_type': METRIC_TYPE,
        'index_type': INDEX_TYPE,
        'params': {"nlist": DIM}
    }
    collection.create_index(field_name='embedding', index_params=index_params)
    return collection

def create_milvus_entities():
    embeddings = []

    for index, row in df.iterrows():
        image_path = row['path']  # Assuming the path is in a column named 'path'
        image = Image.open(image_path).convert('RGB')  # Ensure image is in RGB
        inputs = processor(images=image, return_tensors="pt")
        image_features = model.get_image_features(**inputs)
        # Ensure the tensor is detached from the computational graph before converting
        embeddings.append(image_features.squeeze(0).detach().numpy().tolist())

    paths = df['path'].tolist()
    entities = [[path for path in paths],
                [embedding for embedding in embeddings]]
    return entities


def initialize_milvus(collection_name):
    # Connect to Milvus service
    connections.connect(host=HOST, port=PORT)

    # display all the collections
    #print(utility.list_collections())
    #drop all collections
    #collections = utility.list_collections()
    #for collection in collections:
    #    utility.drop_collection(collection)
    
    # Check if the collection already exists
    if(utility.has_collection(collection_name)):
        collection = Collection(collection_name)
        print(f"Using existing collection: {collection_name}")
    
    else:
        print(f"Creating new collection: {collection_name}")
        collection = create_milvus_collection(collection_name)
        entities = create_milvus_entities()
        mr = collection.insert(entities)
        print("mr: ", mr)

    return collection

@csrf_exempt
@require_http_methods(["POST"])
def image_based_search(request):
    # request decoding
    data = json.loads(request.body)
    topk = data.get('topk')
    query_image_path = data.get('input')
    user_id = data.get('user_id')

    # Connect to Milvus service
    collection_name = 'user_' + (str) (user_id) + '_gallery'
    collection = initialize_milvus(collection_name)
    collection.load()

    try:    
        query_image = Image.open(query_image_path).convert('RGB')  
        query_inputs = processor(images=query_image, return_tensors="pt")
        query_image_features = model.get_image_features(**query_inputs)
        image_embedding = query_image_features.squeeze(0).detach().numpy().tolist()

        results = collection.search(
        data=[image_embedding], 
        anns_field="embedding", 
        # the sum of `offset` in `param` and `limit` 
        # should be less than 16384.
        param=search_params,
        limit=(int) (topk),
        expr=None,
        )
        result_list = results[0].ids
        
        for i in range(len(result_list)):
            result_list[i] = result_list[i][1:]
            result_list[i] = "/home/leto/simvec/VectorDatabase/api_for_database" + result_list[i]
        print(result_list)
        
        return JsonResponse({'message': 'Image processed successfully', 'results': list(result_list)})

    except Exception as e:
        # Handle any errors that occur during the process
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def text_based_search(request):
    # request decoding
    data = json.loads(request.body)
    topk = data.get('topk')
    query_text = data.get('input')
    user_id = data.get('user_id')

    # Connect to Milvus service
    collection_name = 'user_' + (str) (user_id) + '_gallery'
    collection = initialize_milvus(collection_name)
    collection.load()

    try:
        text_inputs = processor(text=query_text, return_tensors="pt", padding=True, truncation=True, max_length=77)
        query_text_features = model.get_text_features(**text_inputs)
        text_embedding = query_text_features.squeeze(0).detach().numpy().tolist()

        results = collection.search(
        data=[text_embedding], 
        anns_field="embedding", 
        # the sum of `offset` in `param` and `limit` 
        # should be less than 16384.
        param=search_params,
        limit=(int) (topk),
        expr=None,
        )
        result_list = results[0].ids
        
        for i in range(len(result_list)):
            result_list[i] = result_list[i][1:]
            result_list[i] = "/home/leto/simvec/VectorDatabase/api_for_database" + result_list[i]
        print(result_list)
        return JsonResponse({'message': 'Image processed successfully', 'results': list(result_list)})

    except Exception as e:
        # Handle any errors that occur during the process
        return JsonResponse({'error': str(e)}, status=500)
       

@csrf_exempt
@require_http_methods(["POST"])
def image_embedding_and_storage(request):
    #return JsonResponse({'message': 'Hit image_embedding_and_storage'})
    collection = initialize_milvus()
    
    try:
        # Assuming the request body will contain the path to the image(s)
        image_paths = request.body.decode('utf-8').split('\n')  

        # Process each image and store the embeddings
        stored_ids = []
        for image_path in image_paths:
            
            # Use the Towhee pipeline to process and insert the image embedding into Milvus
            # Insert data
            p_insert = (
                p_embed.map(('img_path', 'vec'), 'mr', ops.ann_insert.milvus_client(
                            host=HOST,
                            port=PORT,
                            collection_name='image_based_search'
                            ))
                .output('mr')
            )
            p_insert_result = p_insert(image_path)
            stored_ids.extend(p_insert_result)

        # Commit the changes to the Milvus database
        collection.load()

        # Return the list of Milvus primary keys as a response
        return JsonResponse({'message': 'Images processed and stored successfully', 'stored_ids': stored_ids})

    except Exception as e:
        # Handle any errors that occur during the process
        return JsonResponse({'error': str(e)},status=500)
