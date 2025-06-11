# Stage 1: Build Angular App
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Aggiungi questa variabile per aumentare la memoria
ENV NODE_OPTIONS=--max-old-space-size=16384

RUN npm run build --configuration=production --project=exprivia

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Cambiato: serve solo la sottocartella browser
COPY --from=build /app/dist/exprivia/browser /usr/share/nginx/html

# (Opzionale) Se hai un file nginx.conf personalizzato
#COPY nginx.conf /etc/nginx/conf.d/default.conf
