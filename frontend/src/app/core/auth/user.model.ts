export interface User {
    id_user?: number;      // facoltativo
    nome: string;
    cognome: string;
    email: string;
    password: string;
    enabled?: boolean;     // facoltativo
}
