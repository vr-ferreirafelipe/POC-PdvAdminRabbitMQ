#!/bin/bash

if [ -f .npmrc ]; then
  rm .npmrc
fi
touch .npmrc && \
    echo "registry=https://npm.pkg.github.com/vrsoftbr" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc

npm i && \
npm run build && \
npm run lint && \

if ! [ -z $TEST ] && [ $TEST == 'unit' ]; then
    npm run test:cov
elif ! [ -z $TEST ] && [ $TEST == 'e2e' ]; then
    npm run test:e2e:cov
elif ! [ -z $TEST ] && [ $TEST == 'dev' ]; then
    npm run start:dev
fi