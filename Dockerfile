FROM nginx:alpine

RUN sed '/index.html/a try_files $uri $uri/ /index.html;' -i /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY ./build/ ./

CMD ["nginx", "-g", "daemon off;"]
