@REM helm template pgn-frontend .\pgn-frontend\ --version 0.1.0 ^
@REM     --namespace=energy-development ^
@REM     --set resources.limits.cpu="0.25" ^
@REM     --set resources.limits.memory="1Gi" ^
@REM     --set resources.requests.cpu="0.25" ^
@REM     --set resources.requests.memory="512Mi" ^
@REM     --set serviceAccount.name="energy-vault" ^
@REM     --set podAnnotations.vault.authPath="auth/energy-development-kubernetes" ^
@REM     --set podAnnotations.vault.secretPath="energy-development/data/db_access" ^
@REM     --set imagePullSecrets.name="pgnregcred" ^
@REM     --set podAnnotations.releaseNamespace="energy-development" ^
@REM     --set image.registry_url="registry.pgn.co.id" ^
@REM     --set image.image_path="/billing-dev/pgn-frontend" ^
@REM     --set image.tag="1.0.0-alpha" ^
@REM     --set podAnnotations.vault.role="energy" > deployment.yaml

@REM for pull oci://registry.pgn.co.id/billing-dev/helm/pgn-frontend/pgn-frontend
@REM for push oci://registry.pgn.co.id/billing-dev/helm/pgn-frontend
@REM helm package pgn-frontend .\pgn-frontend\ --version 0.1.0
@REM helm push pgn-frontend-0.1.0.tgz oci://registry.pgn.co.id/billing-dev/helm/pgn-frontend
