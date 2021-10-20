FROM node:latest

# Download latest listing of available packages
RUN apt-get -y update

# VSCode dependencies
RUN apt-get -y install libxshmfence1 libnss3 libatk1.0-0 libatk-bridge2.0-0 libdrm2 libgtk-3-0 libgbm1 libasound2

# X / testing dependency
RUN apt-get -y install xvfb


WORKDIR /home/node/app/

# RUN chown node .

# COPY ./package.json .
# COPY ./package-lock.json .
# RUN chown node ./package.json
# RUN chown node ./package-lock.json

# RUN npm install

# COPY . .
# RUN chown -R node ./out

USER 1000:1000

CMD [ "sh", "-c", "xvfb-run -a npm test" ]
