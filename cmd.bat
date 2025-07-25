docker run --rm ^
    -v "C:\work\pgn\pgn-microservice\Energy-FrontendService:/app" ^
    -v "/app/node_modules" ^
    -w /app ^
    node:22.11.0 ^
    sh -c "npm install -g npm@10.9.0 && npm install --force && npm run build"
