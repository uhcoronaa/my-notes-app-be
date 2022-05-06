FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prestart:prod
EXPOSE 8081
CMD [ "npm", "run", "start:prod" ]