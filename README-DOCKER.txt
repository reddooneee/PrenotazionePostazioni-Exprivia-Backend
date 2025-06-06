Importare le immagini Docker salvate in formato .tar:


docker load -i backend.tar
docker load -i postgres.tar
"docker load -i nomefile.tar"

Avviare i container con Docker Compose:

docker compose up --build


Ripristinare il database con i dati reali:

type backup.sql | docker exec -i PrenotazioniDB psql -U smartcity -d smartcity


L’utente del database è smartcity, e il DB ha lo stesso nome.
Il container PostgreSQL si chiama PrenotazioniDB (controllare con docker ps).
Il dump backup.sql contiene sia struttura che dati, quindi non serve pgAdmin o procedure manuali.
Profilo attivo: dev.