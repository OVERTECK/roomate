import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatContext } from '@/context/ChatContext';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';
import { IMessage } from '@/models/IMessage';
import { getApiUrl } from '@/utils/getApiUrl';
import { IChatParticipant } from '@/models/IChatParticipant';
import MyError from '@/components/Error/MyError';
import { chatParticipantService } from '@/services';
import Loader from '@/components/Loader/Loader';

const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<IChatParticipant[]>([]);
    const { user, isAuth } = useAuth();
    const [connection, setConnection] = useState<HubConnection>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedChat, setSelectedChat] = useState<IChatParticipant | null>(
        null
    );
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [step, setStep] = useState<'Chat' | 'Chats'>('Chats');
    const isConnected = useRef<boolean>(false);
    const [countUnReadMessages, setCountUnReadMessages] = useState<number>(0);

    useEffect(() => {
        const fetchChats = async () => {
            setIsLoading(true);

            if (!user?.id) {
                setChats([]);
                return;
            }

            const fetchedChats = await chatParticipantService.GetByUserId(
                user?.id
            );

            if (fetchedChats) {
                setChats(fetchedChats);
                setIsLoading(false);
            }
        };

        fetchChats();
    }, [user?.id]);

    useEffect(() => {
        if (isConnected.current || !isAuth) {
            return;
        }

        isConnected.current = true;

        async function startConnection() {
            setIsLoading(true);

            const newConnection = new HubConnectionBuilder()
                .withUrl(getApiUrl() + '/chat', {
                    withCredentials: true,
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            newConnection.on('ReceiveMessage', (message: IMessage) => {
                setSelectedChat((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        chat: {
                            ...prev.chat,
                            messages: [...prev?.chat.messages, message],
                        },
                    };
                });

                // Обновляем чат в списке чатов, так как получили новое сообщение
                setChats((prev) => {
                    return prev.map((chatParticipant) => {
                        if (chatParticipant.chatId !== message.chatId)
                            return chatParticipant;

                        const messageExists =
                            chatParticipant.chat.messages.some(
                                (m) => m.id === message.id
                            );
                        if (messageExists) return chatParticipant;

                        return {
                            ...chatParticipant,
                            chat: {
                                ...chatParticipant.chat,
                                messages: [
                                    ...chatParticipant.chat.messages,
                                    message,
                                ],
                            },
                        };
                    });
                });
            });

            newConnection.on(
                'ReceiveChat',
                (chatParticipant: IChatParticipant) => {
                    setChats((prev) => {
                        const isExistChat = prev.some(
                            (chat) => chatParticipant.chatId === chat.chatId
                        );

                        if (isExistChat) {
                            return prev;
                        }

                        newConnection.invoke(
                            'JoinChat',
                            chatParticipant.chatId
                        );

                        return [...prev, chatParticipant];
                    });

                    setSelectedChat(chatParticipant);
                }
            );

            newConnection.on('ReceiveNotification', () => {
                setCountUnReadMessages((prev) => prev + 1);
            });

            await newConnection.start();

            setConnection(newConnection);
        }

        try {
            startConnection();
        } catch (ex) {
            console.error(ex);
        }

        return () => {
            connection?.stop();
        };
    }, [isAuth]);

    return (
        <ChatContext.Provider
            value={{
                setChats,
                chats,
                connection,
                selectedChat,
                setSelectedChat,
                isVisible,
                setIsVisible,
                step,
                setStep,
                countUnReadMessages,
                setCountUnReadMessages,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
