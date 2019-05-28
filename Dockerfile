FROM node:8

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g nodemon
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 8000
CMD [ "npm", "run","dev" ]