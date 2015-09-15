FROM node:4.0.0
MAINTAINER Marius Gundersen <me@mariusgundersen.net>

# Install Bower & Gulp 
RUN npm install -g bower gulp

RUN mkdir -p /app
# Set instructions on build. 
COPY package.json /app/
RUN npm install
COPY bower.json .bowerrc /app/
RUN bower install --allow-root
COPY . /app
RUN gulp build

# Define working directory. 
WORKDIR /app

# Set environment 
ENV PORT 8080 

# Define default command. 
CMD ["npm", "start"]

EXPOSE 8080

VOLUME ["/app/config"]

ENV NODE_ENV=production