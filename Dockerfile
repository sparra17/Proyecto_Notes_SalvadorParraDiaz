#node que necesitamos
FROM node:16  

#Donde se va a instalar el contenedor
RUN mkdir -p /usr/src/app
#direccion a la que se mueve
WORKDIR /usr/src/app

#copiar los archivos package
COPY package.json ./
COPY package-lock.json ./

RUN npm install 

#copiar todo a todo
COPY . .

EXPOSE 3000

#se ejecuta el comando para iniciar
CMD [ "npm","run","dev" ]