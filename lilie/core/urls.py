from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, ResultsAPIView, ResultsAPIViewDAST, ResultsAPIViewSCA, CodeAPIView, scan_url, get_scan_progress, ScannedProjectListView

router = DefaultRouter()

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/results/<str:file_hash>/', ResultsAPIView.as_view(), name='results-api'),
    path('api/results-sca/<str:file_hash>/', ResultsAPIViewSCA.as_view(), name='results-api-sca'),
    path('api/results-url/<str:uuid>/', ResultsAPIViewDAST.as_view(), name='results-api-url'),
    path('api/scan-progress/', get_scan_progress),
    path('api/code/', CodeAPIView.as_view(), name='code-api'),
    path('api/scan-url/', scan_url, name='scan_url'),
    path('api/dast-projects/', ScannedProjectListView.as_view(), name='scanned-projects-list'),
    path('api/files/', FilesViewSet.as_view({'get': 'list', 'post': 'create'}), name='files-list-create'),
    path('api/files/<str:file_hash>/', FilesViewSet.as_view({'get': 'retrieve'}), name='file-detail-by-hash'),
]
