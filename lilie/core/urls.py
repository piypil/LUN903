from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, ResultsAPIView


router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/results/<int:file_id>/', ResultsAPIView.as_view(), name='results-api'),
]
