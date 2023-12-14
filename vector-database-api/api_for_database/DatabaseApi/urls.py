from django.urls import path
from .views import image_conversion, text_conversion

urlpatterns = [
    path('api/image_conversion', image_conversion, name='image_conversion'),
    path('api/text_conversion', text_conversion, name='text_conversion'),
]