'use client';

import { type ReactNode, useEffect, useState } from 'react';
import type { IUserEntity } from '@/models/IUserEntity';
import { AuthContext } from '@/context/AuthContext';
import { ApiService } from '@/services/ApiService';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<IUserEntity | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsAuthLoading(true);

                const response = await ApiService.get('/GetMe');

                if (response.status === 200) {
                    setUser(response.data as IUserEntity);
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                    setUser(null);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setIsAuth(false);
                    setUser(null);
                    setError(error.message || 'Authentication failed');
                }
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuth();
    }, [isAuth]);

    function login(token: string, user: IUserEntity) {
        setIsAuth(true);
        setUser(user);
    }

    async function logout() {
        await ApiService.get('/logout');

        setIsAuth(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ isAuth, user, setUser, login, logout, isAuthLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}
