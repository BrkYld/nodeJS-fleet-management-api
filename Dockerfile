FROM node:alpine

RUN mkdir -p /usr/src/fleet-management-api && chown -R node:node /usr/src/fleet-management-api

WORKDIR /usr/src/fleet-management-api

COPY package.json yarn.lock ./

USER node

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn","prod"]