FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --production
COPY . .
RUN npm run build
RUN adduser -D appuser
USER appuser
EXPOSE 3000
CMD npm run start
