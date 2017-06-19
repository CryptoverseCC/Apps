FROM node

RUN git config --global user.email "servant@userfeeds.io"
RUN git config --global user.name "Userfeeds Servant"

WORKDIR /

RUN npm install yarn
COPY . /apps

WORKDIR /apps

RUN find . -maxdepth 2 -type d -regex '\./[a-z]+.*' -exec \
    bash -c "echo '{}' && cd '{}' && [ -f package.json ] && yarn install && yarn build && mkdir -p /release/{} && mv build/* /release/{}/" \;

WORKDIR /