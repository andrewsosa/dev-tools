#!/bin/sh

# Install the deps
DEPS=(
    eslint
    eslint-config-airbnb-base
    eslint-config-prettier
    eslint-plugin-import
    eslint-plugin-jest
    eslint-plugin-prettier
    eslint-plugin-react
    jest
    prettier
)

npm i --save-dev ${DEPS[@]}
# echo ${DEPS[@]}


# # Copy in config files
if [ -n "$PWD" ]; then
    cp dist/.* $PWD
    cp dist/* $PWD
fi
