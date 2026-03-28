"use client";

import { useAuth } from "@/hooks/useAuth";
import useChat from "@/hooks/useChat";
import Chat from "../Chat/Chat";
import MyModal from "../MyModal/MyModal";
import ShowChatButton from "../ShowChatButton/ShowChatButton";
import Header from "../Header/Header";
import styles from './ClientLayout.module.css';
import { QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/provider/AuthProvider";
import { ReactNode } from "react";
import { useQueryClientProvider } from "@/lib/react-query";
import ChatProvider from "@/provider/ChatProvider";

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

export function ClientLayout({ children }: { children: ReactNode }) {
    const queryClient = useQueryClientProvider();

    return (
        // {/*<YMaps*/ }
        // {/*    query={{*/ }
        // {/*        apikey: myConfig.NEXT_PUBLIC_API_MAP,*/ }
        // {/*        suggest_apikey: myConfig.NEXT_PUBLIC_API_SUGGEST,*/ }
        // {/*    }}*/ }
        // {/*>*/ }
        <QueryClientProvider client={queryClient}>
            <LayoutContent>{children}</LayoutContent>
        </QueryClientProvider>
        // {/*</YMaps>*/ }
    );
}