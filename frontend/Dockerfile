FROM node:14

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/frontend

WORKDIR /usr/src/app/frontend

COPY build/ ./build/

RUN yarn global add serve

EXPOSE 3000

CMD ["serve", "-l", "3000", "-s", "build"]