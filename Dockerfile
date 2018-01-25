FROM node

WORKDIR /

COPY . /apps

WORKDIR /apps

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" ~/.npmrc

RUN yarn

RUN yarn test

RUN yarn lerna run build-test

WORKDIR /
