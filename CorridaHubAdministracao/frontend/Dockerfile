FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY adm.html /usr/share/nginx/html/index.html
COPY adm.css /usr/share/nginx/html/adm.css
COPY adm.js /usr/share/nginx/html/adm.js
COPY caixa-corrida.js /usr/share/nginx/html/caixa-corrida.js

# Configura o Nginx para escutar na porta 8081
RUN echo 'server { listen 8081; location / { root /usr/share/nginx/html; index index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
