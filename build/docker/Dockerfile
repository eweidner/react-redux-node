FROM node:7.5.0

ENV APP_BASE /usr/src
ENV APP_HOME /usr/src/application

COPY application.tgz $APP_BASE

RUN mkdir -p $APP_HOME
WORKDIR $APP_BASE

RUN     tar xzvf application.tgz
WORKDIR $APP_BASE

RUN     npm install
