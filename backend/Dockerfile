FROM node:14

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3030

CMD ["yarn", "start"]