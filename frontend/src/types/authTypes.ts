import type { IUserEntity } from '../models/IUserEntity.ts';

export interface AuthContextType {
    isAuth: boolean;
    user: IUserEntity | null;
    setUser: (user: IUserEntity) => void;
    login: (token: string, user: IUserEntity) => void;
    logout: () => void;
    isAuthLoading: boolean;
}
