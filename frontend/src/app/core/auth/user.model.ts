export interface User {
    id_user?: number | null;      // facoltativo
    nome: string;
    cognome: string;
    email: string;
    password: string;
    authorities?: string[]; 
    enabled?: boolean | null;     // facoltativo
}
