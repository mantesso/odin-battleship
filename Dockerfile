FROM node:22-alpine
EXPOSE 3000
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN adduser -D appuser
USER appuser
CMD npm run start
