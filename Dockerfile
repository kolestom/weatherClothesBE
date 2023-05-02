FROM node:18-alpine
WORKDIR /appdir
ADD . /appdir
RUN npm run build
CMD [ "npm", "start" ]
EXPOSE 3005