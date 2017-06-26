FROM node

RUN git config --global user.email "servant@userfeeds.io"
RUN git config --global user.name "Userfeeds Servant"

WORKDIR /

RUN npm install yarn
COPY . /apps

WORKDIR /apps

RUN yarn

RUN find apps -maxdepth 1 -type d -regex '\apps/[a-z]+.*' -exec \
    bash -c "echo '{}' && cd '{}' && [ -f package.json ] && yarn build && mkdir -p /release/{} && mv build/* /release/{}/" \;

WORKDIR /
