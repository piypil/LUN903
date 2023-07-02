from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, ResultsAPIView, CodeAPIView, scan_url, ResultsUrlAPIView


router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/results/<int:file_id>/', ResultsAPIView.as_view(), name='results-api'),
    path('api/results-url/<int:project_id>/', ResultsUrlAPIView.as_view(), name='results-api'),
    path('api/code/', CodeAPIView.as_view(), name='code-api'),
    path('api/scan-url/', scan_url, name='scan_url'),
]
