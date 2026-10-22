FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY . .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 81

CMD ["nginx", "-g", "daemon off;"]