export interface User {
    id_user?: number; // opzionale perché viene generato dal backend
    name: string;
    surname: string;
    email: string;
    role: 'Amministratore' | 'BuildingManager' | 'Dipendente';
}