FROM node:6.9.5

ENV WEB_PORT 3080
ENV NODE_ENV production
ENV APP_BASE /var
ENV APP_HOME /var/application

RUN mkdir -p $APP_BASE && chmod ogu+rwx $APP_BASE
WORKDIR $APP_BASE

USER node
COPY portal.tgz $APP_BASE

WORKDIR $APP_BASE
RUN     tar xzvf portal.tgz

COPY entrypoint.sh $APP_HOME
COPY wait_for_port.sh  $APP_HOME

WORKDIR $APP_HOME

EXPOSE $WEB_PORT

ENTRYPOINT ["/var/application/entrypoint.sh"]
