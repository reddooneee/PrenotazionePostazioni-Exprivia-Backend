Importare le immagini Docker salvate in formato .tar:


docker load -i backend.tar
docker load -i postgres.tar
"docker load -i nomefile.tar"

Avviare i container con Docker Compose:

docker compose up --build


Ripristinare il database con i dati reali:

#type backup.sql | docker exec -i PrenotazioniDB psql -U smartcity -d smartcity


L’utente del database è smartcity, e il DB ha lo stesso nome.
Il container PostgreSQL si chiama PrenotazioniDB0 (controllare con docker ps).
Il dump backup.sql contiene sia struttura che dati, quindi non serve pgAdmin o procedure manuali.
Profilo attivo: prod.

Istruzioni dettagliate:

Verifica i container attivi:

docker ps


Accedi al container PostgreSQL:

docker exec -it PrenotazioniDB0(NOME CONTAINER) bash


Accedi a PostgreSQL all’interno del container:

psql -U smartcity(NOME UTENTE DOCKER-COMPOSE.YML) -d prenotazioni(NOME DB DOCKER-COMPOSE.YML)
psql -h smartcity.gleeze.com -U smartcity -d dbprenotazioni



Comandi da usare dentro psql

Navigazione DB:

\l                     -- Elenco di tutti i database
\c prenotazioni        -- Connetti al DB prenotazioni
\dt                    -- Elenco tabelle del database
\d nome_tabella        -- Struttura della tabella
\du                    -- Elenco degli utenti (ruoli)
\dn                    -- Elenco degli schemi
\conninfo              -- Info sulla connessione attiva


Modalità extra (facoltative):

\timing                -- Attiva/disattiva cronometro query
\x                     -- Modalità estesa (utile per risultati larghi)

Uscita:

\q                     -- Esci da psql


Test psql da terminale, accedere con questo comando
psql -h smartcity.gleeze.com -U smartcity -d dbprenotazioni