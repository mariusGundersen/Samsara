FROM node:4.2-onbuild
MAINTAINER Marius Gundersen <me@mariusgundersen.net>

# Install Bower & Gulp
RUN npm install -g bower gulp
RUN bower install --allow-root
RUN gulp build

ENV PORT 8080
EXPOSE 8080

VOLUME ["/usr/src/app/config"]
