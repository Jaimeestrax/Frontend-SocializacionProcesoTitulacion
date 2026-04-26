export interface User {
    _id: string;
    usuario: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    setSession: (user: User, token: string) => void;
    clearSession: () => void;
    isAuthenticated: boolean;
}