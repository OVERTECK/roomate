import AuthProvider from '@/provider/AuthProvider';
import './globals.css';
import { Ubuntu } from 'next/font/google';
import { ClientLayout } from '@/components/ClientLayout/ClientLayout';
import { ReactNode } from 'react';

const ubuntuFont = Ubuntu({
    subsets: ['latin', 'cyrillic-ext', 'cyrillic'],
    weight: '400',
    display: 'swap',
})

export const metadata = {
    title: 'roomate - Поиск соседей для совместного проживания',
    description: 'roomate - сайт для поиска людей для совместного проживания по всей России. Добавляй объявление жилья или анкету соседа, ищи соседей походящих именно тебе.',
    opensGraph: {
        type: 'website',
        url: 'https://roomate.ru',
        title: 'roomate - Поиск соседей',
        description: 'roomate - сайт для поиска людей для совместного проживания по всей России. Добавляй объявление жилья или анкету соседа, ищи соседей походящих именно тебе.',
        images: [{ url: 'https://roomate.ru/preview.png' }],
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="ru">
            <body
                className={ubuntuFont.className}
            >
                {/*<YMaps*/}
                {/*    query={{*/}
                {/*        apikey: myConfig.NEXT_PUBLIC_API_MAP,*/}
                {/*        suggest_apikey: myConfig.NEXT_PUBLIC_API_SUGGEST,*/}
                {/*    }}*/}
                {/*>*/}
                <AuthProvider>
                    <ClientLayout>{children}</ClientLayout>
                </AuthProvider>
                {/*</YMaps>*/}
            </body>
        </html>
    );
}
