from django.urls import path
from .views import image_conversion, text_conversion

urlpatterns = [
    path('api/image_based_search', image_based_search, name='image_based_search'),
    path('api/text_based_search', text_based_search, name='text_based_search'),
]
