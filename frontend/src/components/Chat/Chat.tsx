import React, {
    ChangeEvent,
    Dispatch,
    FormEvent,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './Chat.module.css';
import SendIcon from '@/components/icons/SendIcon';
import useChat from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import MyError from '@/components/Error/MyError';
import { IChatParticipant } from '@/models/IChatParticipant';
import BackIcon from '@/components/icons/BackIcon';
import Image from 'next/image';
import Link from 'next/link';
import { IUserEntity } from '@/models/IUserEntity';

function ChatHeader({
    setStep,
    selectedChat,
    setIsVisible,
}: {
    setStep: Dispatch<SetStateAction<'Chat' | 'Chats'>>;
    selectedChat: IChatParticipant | null;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <header className={styles.header}>
            <button onClick={() => setStep('Chats')} className={styles.btnBack}>
                <BackIcon />
            </button>
            <Link
                href={`/profile/` + selectedChat?.receiverUser.id}
                className={styles.userInfo}
            >
                <Image
                    alt="Изображение пользователя"
                    className={styles.userImage}
                    src={selectedChat?.receiverUser.photoUrl || ''}
                    width={45}
                    height={45}
                />
                <span className={styles.userName}>
                    {selectedChat?.receiverUser.surname}{' '}
                    {selectedChat?.receiverUser.name}
                </span>
            </Link>
            <button
                className={styles.closeBtn}
                type="button"
                onClick={() => setIsVisible(false)}
            >
                ×
            </button>
        </header>
    );
}

function ChatMessages({
    messagesContainerRef,
    selectedChat,
    endMessages,
    user,
}: {
    messagesContainerRef: RefObject<HTMLDivElement | null>;
    selectedChat: IChatParticipant | null;
    endMessages: RefObject<HTMLDivElement | null>;
    user: IUserEntity;
}) {
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [selectedChat?.chat.messages]);

    return (
        <div className={styles.messages} ref={messagesContainerRef}>
            {selectedChat?.chat.messages.map((msg, index) => (
                <div
                    key={index}
                    className={
                        msg.userId === user.id
                            ? styles.myMessage
                            : styles.receivedMessage
                    }
                >
                    {/*<div className={styles.message}>*/}
                    {/*    {new Date(msg.createdAt).toString() !== storeDateMessage.current ?*/}
                    {/*        <div>{new Date(msg.createdAt).getDate()}.{new Date(msg.createdAt).getMonth() + 1}</div> :*/}
                    {/*        storeDateMessage.current = msg.createdAt.toString()*/}
                    {/*    }*/}
                    {/*</div>*/}
                    <div className={styles.message}>
                        <div className={styles.messageText}>{msg.text}</div>
                        <div className={styles.timeMessage}>
                            {new Date(msg.createdAt)
                                .getHours()
                                .toString()
                                .padStart(2, '0')}
                            :
                            {new Date(msg.createdAt)
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={endMessages}></div>
        </div>
    );
}

function ChatFooter({
    handleSendMessage,
    textMessage,
    setTextMessage,
}: {
    handleSendMessage: (e: FormEvent) => void;
    textMessage: string;
    setTextMessage: Dispatch<SetStateAction<string>>;
}) {
    return (
        <form
            className={styles.containerInput}
            onSubmit={(e) => handleSendMessage(e)}
        >
            <input
                className={styles.messageInp}
                value={textMessage}
                placeholder={'Напишите сообщение...'}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTextMessage(e.target.value)
                }
            />
            <button className={styles.sendBtn}>
                <SendIcon />
            </button>
        </form>
    );
}

const Chat = () => {
    const {
        chats,
        connection,
        selectedChat,
        setSelectedChat,
        setIsVisible,
        step,
        setStep,
    } = useChat();
    const { user } = useAuth();
    const [textMessage, setTextMessage] = useState<string>('');
    const endMessages = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    async function handleSendMessage(e: FormEvent) {
        e.preventDefault();

        if (!textMessage) {
            return;
        }

        const message = {
            ChatId: selectedChat?.chatId,
            UserId: user?.id,
            Text: textMessage,
        };

        await connection?.invoke('SendMessage', message);
        await connection?.invoke(
            'SendNotification',
            selectedChat?.receiverUser.id
        );

        setTextMessage('');
    }

    if (!user) {
        return <MyError error={'Пользователь не найден'} />;
    }

    if (step === 'Chat') {
        return (
            <div className={styles.container}>
                <ChatHeader
                    selectedChat={selectedChat}
                    setStep={setStep}
                    setIsVisible={setIsVisible}
                />
                <ChatMessages
                    selectedChat={selectedChat}
                    endMessages={endMessages}
                    messagesContainerRef={messagesContainerRef}
                    user={user}
                />
                <ChatFooter
                    handleSendMessage={handleSendMessage}
                    textMessage={textMessage}
                    setTextMessage={setTextMessage}
                />
            </div>
        );
    }

    function handleSelectChat(chat: IChatParticipant) {
        setSelectedChat(chat);

        setStep('Chat');
    }

    return (
        <div className={styles.container}>
            {chats.length === 0 ? (
                <div className={styles.notFoundChats}>Список чатов пуст</div>
            ) : (
                <div className={styles.chats}>
                    <button
                        className={styles.closeBtn}
                        type="button"
                        onClick={() => setIsVisible(false)}
                    >
                        ×
                    </button>
                    {chats.map((chatParticipant: IChatParticipant, index) => (
                        <button
                            key={index}
                            className={styles.chat}
                            onClick={() => handleSelectChat(chatParticipant)}
                        >
                            <div className={styles.chatContainer}>
                                <Image
                                    src={chatParticipant.receiverUser.photoUrl}
                                    width={45}
                                    height={45}
                                    alt="Фотография пользователя"
                                    className={styles.userImage}
                                />
                                <div className={styles.containerLastMessage}>
                                    <span>
                                        {chatParticipant.receiverUser.surname}{' '}
                                        {chatParticipant.receiverUser.name}
                                    </span>
                                    <div className={styles.lastMessage}>
                                        {chatParticipant.chat.messages.slice(
                                            -1
                                        )[0]?.text || ''}
                                    </div>
                                </div>
                                {
                                    chatParticipant.chat.messages.filter((msg) =>
                                        msg.isRead === false && msg.userId !== user?.id).length > 0 &&
                                    (
                                        <p className='bg-[var(--main-color)] w-7 h-6 rounded-2xl text-[15px] flex justify-center items-center'>{(() => {
                                            const amountUnReadMessages = chatParticipant.chat.messages.filter((msg) =>
                                                msg.isRead === false && msg.userId !== user?.id).length

                                            return amountUnReadMessages > 0 ? amountUnReadMessages : null;
                                        })()}</p>
                                    )
                                }
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Chat;
