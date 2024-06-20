#!/bin/bash

if [ -f .npmrc ]; then
  rm .npmrc
fi
touch .npmrc && \
    echo "registry=https://npm.pkg.github.com/vrsoftbr" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc

npm i && \
npx husky install && \
tail -f /dev/null