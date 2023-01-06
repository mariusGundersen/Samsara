FROM node:14
MAINTAINER Marius Gundersen <samsara@mariusgundersen.net>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Bower & Gulp
RUN npm install -g bower gulp

COPY . /usr/src/app
RUN npm ci --silent && npm cache clean --force
RUN bower install --allow-root

RUN gulp build

ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080

VOLUME ["/usr/src/app/config"]
CMD [ "npm", "start" ]
