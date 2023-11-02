#!/usr/bin/env bash

git pull

yarn install
yarn encore prod

bin/console d:m:m -n
composer install
bin/console ca:cl --env=prod