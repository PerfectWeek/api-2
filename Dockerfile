FROM node:lts

RUN apt-get update && apt-get install -y libgl1-mesa-glx && apt-get clean

WORKDIR /usr/app/api
COPY ./ ./

RUN npm install \
&& npm run postinstall \
&& rm -rf ./node_modules/websocket/.git \
&& npm run setup --plugins --debug

CMD ["npm", "start"]
