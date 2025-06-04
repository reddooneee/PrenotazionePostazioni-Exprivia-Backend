#Immagine del beckend

# Usa un'immagine base con Java 17 <java.version>17</java.version>
# FROM openjdk:17

# Imposta la directory di lavoro
# WORKDIR /backend

#Creazione file .jar  (-DskipTests skippa i test)
# RUN mvn package -DskipTests 

# Copia il file JAR compilato nell'immagine
# COPY exprv/target/exprv-0.0.1-SNAPSHOT.jar /backend

# Espone la porta 8080
# EXPOSE 8080

# Avvia l'applicazione
# CMD ["java", "-jar", "exprv-0.0.1-SNAPSHOT.jar"]

###################################################################################################

# Usa un'immagine base con Java 17
#FROM openjdk:17

# Imposta la directory di lavoro
#WORKDIR /backend

# Copia il file JAR compilato nell’immagine
#COPY exprv/target/exprv-0.0.1-SNAPSHOT.jar /backend/

# Espone la porta 8080
#EXPOSE 8080

# Avvia l’applicazione
#CMD ["java", "-jar", "exprv-0.0.1-SNAPSHOT.jar"]

##############################################################

FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copia tutto il progetto Maven
COPY . /app

# Compila il progetto
RUN mvn clean package -DskipTests

# Fase finale
FROM openjdk:17
WORKDIR /backend

# Copia il JAR dalla build precedente
COPY --from=builder /app/target/exprv-0.0.1-SNAPSHOT.jar /backend/

EXPOSE 8080

CMD ["java", "-jar", "exprv-0.0.1-SNAPSHOT.jar"]
