@echo off
set KUBECONFIG="..\config"
@echo "uninstall frontend-service"
helm uninstall pgn-frontend --namespace=crm-development-space > .\helm-output\uninstall_response.txt

findstr "uninstalled" .\helm-output\uninstall_response.txt
if errorlevel 1 (
    @echo Uninstall Process Failed !!
) else (
    @echo "re-install frontend-service"
    helm install pgn-frontend .\pgn-frontend\ --namespace=crm-development-space > .\helm-output\install_response.txt
    findstr "STATUS: deployed" .\helm-output\install_response.txt
    if errorlevel 1 (
        @echo Install Process Failed !!
    ) else (
        @echo Install Process Succeeded !!
        del .\helm-output\uninstall_response.txt
        del .\helm-output\install_response.txt
    )
)
