FROM nginx:1.10.3

ENV NODE_ENV production

ENV STATIC_FILE_DIR /usr/share/nginx/html

COPY main.js $STATIC_FILE_DIR
COPY index.html $STATIC_FILE_DIR
COPY default.conf /etc/nginx/conf.d