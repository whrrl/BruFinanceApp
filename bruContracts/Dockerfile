FROM node:14.20.0

WORKDIR ./Bru-contracts

COPY . .


RUN npm install

RUN npx hardhat compile

ENV DEBUG "script:*"


CMD ["npx","hardhat","test","test/Core/test.ts","--network","localhost"]