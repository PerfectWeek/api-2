#!/usr/bin/env bash

if [[ `git branch --list heroku` ]]
then
    git branch -D heroku
fi

git checkout -b heroku
npm run setup --plugins
rm package-lock.json
git add --all
git add -f admin/admin/build
git add -f plugins/**/admin/build
git commit -am "chore: automatic heroku build"
git push -f heroku HEAD:master

git checkout dev
git branch -D heroku
