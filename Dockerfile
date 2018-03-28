FROM node

# Temporary workaround for https://github.com/nodejs/docker-node/issues/649
RUN mkdir -p /opt/yarn/bin && ln -s /opt/yarn/yarn-v1.5.1/bin/yarn /opt/yarn/bin/yarn

WORKDIR /

COPY . /apps

WORKDIR /apps

RUN yarn install --pure-lockfile

RUN yarn test

RUN yarn lerna run build-test

WORKDIR /
