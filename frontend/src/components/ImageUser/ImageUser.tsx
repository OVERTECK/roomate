import React, { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ImageUser.module.css';
import EditButton from '@/components/UI/button/EditButton/EditButton';
import Loader from '@/components/Loader/Loader';
import MyError from '@/components/Error/MyError';
import axios from 'axios';

export const ImageUser = ({
    urlToImage,
    setUrlToImage,
}: {
    urlToImage?: string;
    setUrlToImage?: (image: string) => void;
}) => {
    const inputSelectPhotosRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handlerClickEdit() {
        inputSelectPhotosRef.current?.click();
    }

    async function selectPhotos(e: ChangeEvent<HTMLInputElement>) {
        const selectedPhotos = e.target.files;

        if (selectedPhotos === null) {
            setError('Please select a valid photo');

            return;
        }

        const photos = Array.from(selectedPhotos);

        try {
            if (photos.length > 1) {
                setError(`Максимальное количество фотографий 1!`);

                return;
            }

            setIsLoading(true);

            for (const file of photos) {
                const fileSize = file.size;

                if (fileSize > 10 * 1024 * 1024) {
                    setError('File max size 10mb');

                    return;
                }

                const fileName = file.name;
                const fileType = file.type;

                if (!fileType.startsWith('image/')) {
                    setError('Неверный формат изображения!');

                    return;
                }

                const { data } = await axios.post<{ signedUrl: string; s3Key: string }>(
                    '/api/upload',
                    {
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        folderName: "users",
                    }
                );

                const uploadResponse = await fetch(data.signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type },
                });

                if (uploadResponse.ok) {
                    const photoUrl = `https://b4dab939-ed98-43f6-94a4-172daa28c2a2.selstorage.ru/${data.s3Key}`;

                    if (setUrlToImage) {
                        setUrlToImage(photoUrl);
                    }
                }
            }

            setError('');
        } catch (ex: unknown) {
            if (ex instanceof Error) {
                setError(ex.toString());
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.imageContainer}>
            <input
                style={{ display: 'none' }}
                type="file"
                ref={inputSelectPhotosRef}
                multiple={false}
                onChange={selectPhotos}
                accept="image/*"
            />
            <Image
                className={styles.image}
                src={urlToImage || '/default_user_img.svg'}
                width="200"
                height="200"
                alt="Изображение пользователя"
            />
            <EditButton onClick={handlerClickEdit} />
            {isLoading && <Loader />}
            {error && <MyError error={error} />}
        </div>
    );
};

export default ImageUser;
