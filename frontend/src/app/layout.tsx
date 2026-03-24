'use client';

import Header from '@/components/Header/Header';
import AuthProvider from '@/provider/AuthProvider';
import './globals.css';
import styles from './layout.module.css';
import MyModal from '@/components/MyModal/MyModal';
import Chat from '@/components/Chat/Chat';
import { ReactNode, useEffect } from 'react';
import ShowChatButton from '@/components/ShowChatButton/ShowChatButton';
import { useAuth } from '@/hooks/useAuth';
import ChatProvider from '@/provider/ChatProvider';
import useChat from '@/hooks/useChat';
import { QueryClientProvider } from '@tanstack/react-query';
import { useQueryClientProvider } from '@/lib/react-query';
import { Ubuntu } from 'next/font/google';
const ubuntuFont = Ubuntu({
    subsets: ['latin', 'cyrillic-ext', 'cyrillic'],
    weight: '400',
    display: 'swap',
})

function ChatWrapper() {
    const { isAuth } = useAuth();
    const { isVisible, setIsVisible } = useChat();

    if (!isAuth) {
        return null;
    }

    return (
        <>
            {!isVisible && (
                <ShowChatButton onClick={() => setIsVisible(true)} />
            )}
            <MyModal
                visible={isVisible}
                setVisible={setIsVisible}
                positionStyle={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'end',
                }}
                isCloseOnClickToVoid={true}
            >
                <Chat />
            </MyModal>
        </>
    );
}

function MainLayout({ children }: { children: ReactNode }) {
    const { isAuth } = useAuth();

    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>{children}</main>
            {isAuth && <ChatWrapper />}
        </div>
    );
}

function AuthenticatedLayout({ children }: { children: ReactNode }) {
    return (
        <ChatProvider>
            <MainLayout>{children}</MainLayout>
        </ChatProvider>
    );
}

function LayoutContent({ children }: { children: ReactNode }) {
    const { isAuth } = useAuth();

    return isAuth ? (
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
    ) : (
        <MainLayout>{children}</MainLayout>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const queryClient = useQueryClientProvider();

    return (
        <html lang="ru">
            <head>
                <meta name="title" content="roomate - Поиск соседей" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name='description' content='roomate - сайт для поиска людей для совместного проживания по всей России. Добавляй объявление жилья или анкету соседа, ищи соседей походящих именно тебе.' />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://roomate.ru" />
                <meta property="og:title" content="roomate - Поиск соседей" />
                <meta property="og:description" content="roomate - сайт для поиска людей для совместного проживания по всей России. Добавляй объявление жилья или анкету соседа, ищи соседей походящих именно тебе." />
                <meta property="og:image" content="https://roomate.ru/preview.png" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body
                className={ubuntuFont.className}
            >
                {/*<YMaps*/}
                {/*    query={{*/}
                {/*        apikey: myConfig.NEXT_PUBLIC_API_MAP,*/}
                {/*        suggest_apikey: myConfig.NEXT_PUBLIC_API_SUGGEST,*/}
                {/*    }}*/}
                {/*>*/}
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <LayoutContent>{children}</LayoutContent>
                    </AuthProvider>
                </QueryClientProvider>
                {/*</YMaps>*/}
            </body>
        </html>
    );
}
