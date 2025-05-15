export interface User {
    id_user: number;
    nome: string;
    cognome: string;
    email: string;
    password?: string;
    enabled: boolean;
    authorities: string[];
    creatoIl?: string;
    aggiornatoIl?: string;
} 