export class User {
    constructor(
        public enabled: boolean,
        public nome: string | null,
        public cognome: string | null,
        public email: string | null,
        public password: string | null,
        public ruolo_utente: string[],
    ) { }
}