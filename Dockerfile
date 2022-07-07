FROM node:14-alpine as builder

WORKDIR /code

RUN npm install pnpm -g

ADD package.json yarn.lock /code/
RUN pnpm

ADD . /code/
RUN pnpm build

FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/docs/.vitepress/dist /usr/share/nginx/html
