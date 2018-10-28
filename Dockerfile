FROM ubuntu

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update -y
RUN apt-get install sudo -y
RUN apt-get install curl -y
RUN apt-get install gnupg -y
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN npm i -g serverless@1.30.3

CMD rm -rf node_modules && npm install && serverless deploy
