from django.urls import path
from .views import image_based_search, text_based_search, image_embedding_and_storage

urlpatterns = [
    path('api/image_based_search', image_based_search, name='image_based_search'),
    path('api/text_based_search', text_based_search, name='text_based_search'),
    path('api/image_embedding_and_storage', image_embedding_and_storage, name='image_embedding_and_storage'),
]
