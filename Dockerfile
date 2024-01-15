FROM node:lts as dependencies
WORKDIR /questspace-frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]