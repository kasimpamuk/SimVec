# Django view for handling image or text conversion with external services
import requests
import csv
from glob import glob
from pathlib import Path
from statistics import mean
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from towhee import pipe, ops, DataCollection
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
from django.core.files.storage import FileSystemStorage

# Towhee parameters
MODEL = 'resnet50'
DEVICE = None # if None, use default device (cuda is enabled if available)

# Milvus parameters
HOST = '127.0.0.1'
PORT = '19530'
TOPK = 8 # number of results to return
DIM = 2048 # dimension of embedding extracted by MODEL
COLLECTION_NAME = 'reverse_image_search'
INDEX_TYPE = 'IVF_FLAT'
METRIC_TYPE = 'L2'

# path to csv (column_1 indicates image path) OR a pattern of image paths
INSERT_SRC = '../data/reverse_image_search.csv'
QUERY_SRC = '../data/test/*/*.JPEG'

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


p_insert = (
        p_embed.map(('img_path', 'vec'), 'mr', ops.ann_insert.milvus_client(
                    host=HOST,
                    port=PORT,
                    collection_name=COLLECTION_NAME
                    ))
          .output('mr')
    )


p_insert(INSERT_SRC)


def get_embeddings(data, data_type):
    if data_type == 'image':
        pass
        
    elif data_type == 'text':  # text
        pass
        # Placeholder for text processing - replace with actual model logic
        #embeddings = your_text_model_function(data)

    return [1, 2, 3, 4, 5] 

def store_in_vector_db(embeddings):
    """
    Store embeddings in the internal vector database.

    :param embeddings: Embeddings to be stored.
    :return: Identifier of the stored embeddings.
    """
    # Placeholder for database storage logic - replace with actual DB logic
    #stored_id = your_database_storage_function(embeddings)

    #return stored_id
    return 1


@csrf_exempt
@require_http_methods(["POST"])
def image_conversion(request):
    # BURASI DÜZELTİLEBİLİR
    print(request.POST)
    try:
        # Determine if the request has an image or text
        if 'image' in request.FILES:
            image = request.FILES['image']
            
            # Process image using ML model
            embeddings = get_embeddings(image, 'image')

            # Store embeddings in external vector database
            stored_id = store_in_vector_db(embeddings)
            return JsonResponse({'message': 'Image processed successfully', 'stored_id': stored_id})
        else:
            return JsonResponse({'error': 'No valid image provided'}, status=400)
    except Exception as e:
        # Handle any errors that occur during the process
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def text_conversion(request):
    #print(request.body.decode('utf-8'))
    return JsonResponse({'message': 'Text conversion hit'})
    try:
        # Determine if the request has an image or text
        text = request.body.decode('utf-8')
        print(text)
        data = {'text': text}
            
        # Process text using ML model
        embeddings = get_embeddings(data, 'text')

        # Store embeddings in external vector database
        stored_id = store_in_vector_db(embeddings)
        return JsonResponse({'message': 'Text processed successfully', 'stored_id': stored_id})
    
        return JsonResponse({'error': 'No valid text provided'}, status=400)

    except Exception as e:
        # Handle any errors that occur during the process
        return JsonResponse({'error': str(e)}, status=500)
