@echo off
REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Docker is not installed or not in PATH. Please install Docker first.
    exit /b 1
)

REM Check if Docker service is running
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo Docker service is not running. Please start Docker service.
    exit /b 1
)

REM Check if we can connect to Docker daemon
docker ps >nul 2>nul
if %errorlevel% neq 0 (
    echo Cannot connect to Docker daemon. Please check Docker service status.
    exit /b 1
)

set KUBECONFIG="./pgnbilling-access/pgnbilling-billing.kubeconfig"

@echo "Building Docker image..."
docker build -t registry.pgn.co.id/billing-dev/pgn-frontend:latest .
if errorlevel 1 (
    @echo "Docker build failed! Please check the build logs."
    exit /b 1
) else (
    @echo "Docker build successful. Proceeding with push..."
)

@echo "Pushing Docker image to registry..."
docker push registry.pgn.co.id/billing-dev/pgn-frontend:latest
if errorlevel 1 (
    @echo "Docker push failed! Please check the push logs."
    exit /b 1
) else (
    @echo "Docker push successful. Proceeding with deployment..."
)

@echo "uninstall frontend-service"
helm uninstall pgn-frontend --namespace=billing-pgnbilling-staging > .\helm-output\uninstall_response.txt

findstr "uninstalled" .\helm-output\uninstall_response.txt
if errorlevel 1 (
    @echo Uninstall Process Failed !!
) else (
    @echo "re-install frontend-service"
    helm install pgn-frontend .\pgn-frontend\ --namespace=billing-pgnbilling-staging > .\helm-output\install_response.txt
    findstr "STATUS: deployed" .\helm-output\install_response.txt
    if errorlevel 1 (
        @echo Install Process Failed !!
    ) else (
        @echo Install Process Succeeded !!
        del .\helm-output\uninstall_response.txt
        del .\helm-output\install_response.txt
    )
)