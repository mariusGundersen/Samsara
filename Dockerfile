FROM node:4.0.0
MAINTAINER Marius Gundersen <me@mariusgundersen.net>

# Install Bower & Gulp 
RUN npm install -g bower gulp

RUN mkdir -p /app
# Define working directory. 
WORKDIR /app
# Set instructions on build. 
COPY package.json /app/
RUN npm install
COPY bower.json .bowerrc /app/
RUN bower install --allow-root
COPY . /app
RUN gulp build

# Set environment 
ENV PORT 8080
ENV NODE_ENV production
ENV SESSION_SECRET '82c0959b-d08d-4a9c-8a3f-c0c981182a3d'

# Define default command. 
CMD ["npm", "start"]

EXPOSE 8080

VOLUME ["/app/config"]