FROM node

RUN git config --global user.email "servant@userfeeds.io"
RUN git config --global user.name "Userfeeds Servant"

WORKDIR /

RUN npm install yarn
COPY . /apps

WORKDIR /apps/
