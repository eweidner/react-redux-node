FROM node:6.9.5

ENV WEB_PORT 3001

ENV NODE_ENV production
ENV APP_BASE /var
ENV APP_HOME /var/application

RUN mkdir -p $APP_BASE && chmod ogu+rwx $APP_BASE
WORKDIR $APP_BASE

USER node
COPY application.tgz $APP_BASE

WORKDIR $APP_BASE
RUN     tar xzvf application.tgz

COPY entrypoint.sh $APP_HOME
COPY wait_for_port.sh  $APP_HOME

WORKDIR $APP_HOME

RUN npm install

EXPOSE $WEB_PORT

ENTRYPOINT ["/var/application/entrypoint.sh"]
