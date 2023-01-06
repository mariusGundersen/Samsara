FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm ci --silent && npm cache clean --force

RUN npm run gulp

ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080

VOLUME ["/usr/src/app/config"]
CMD [ "npm", "start" ]
