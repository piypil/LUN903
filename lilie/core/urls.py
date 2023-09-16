from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, ResultsAPIView, ResultsUrlAPIView, ResultsAPIViewSCA, CodeAPIView, scan_url, get_scan_progress, ScannedProjectListView

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/results/<int:file_id>/', ResultsAPIView.as_view(), name='results-api'),
    path('api/results-sca/<int:file_id>/', ResultsAPIViewSCA.as_view(), name='results-api-sca'),
    path('api/results-url/<int:project_id>/', ResultsUrlAPIView.as_view(), name='results-api-url'),
    path('api/scan-progress/', get_scan_progress),
    path('api/code/', CodeAPIView.as_view(), name='code-api'),
    path('api/scan-url/', scan_url, name='scan_url'),
    path('api/scanned-projects/', ScannedProjectListView.as_view(), name='scanned-projects-list'),
]
