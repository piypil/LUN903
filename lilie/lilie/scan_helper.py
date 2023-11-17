from .kamille import bandit_scan, dependency_check_scan

def bandit_scan_worker(path, progress_queue):
    b = bandit_scan.Bandit(path)
    b.scan_direct()
    progress_queue.put(1)

def dependency_check_scan_worker(path, progress_queue):
    c = dependency_check_scan.DependencyCheckScan(path)
    c.scan_direct()
    progress_queue.put(1)

