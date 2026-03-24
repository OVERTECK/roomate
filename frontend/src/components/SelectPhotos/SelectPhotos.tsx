import styles from './SelectPhotos.module.css';
import Loader from '../Loader/Loader';
import {
    type ChangeEvent,
    useRef,
    useState,
} from 'react';
import MyButton from '@/components/UI/button/MyButton';
import Image from 'next/image';
import MyError from '@/components/Error/MyError';
import axios from 'axios';

interface Props {
    title: string;
    photos: string[];
    setPhotos: (photos: string[]) => void;
    setMainPhoto: (photo: string) => void;
    folderName: string;
    maxCountPhotos: number;
}

const SelectPhotos = ({
    title = 'Выбрать фотографии',
    photos,
    setPhotos,
    setMainPhoto,
    folderName,
    maxCountPhotos,
}: Props) => {
    const inputSelectPhotosRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handlerClickBtnSelectPhotos() {
        inputSelectPhotosRef.current?.click();
    }

    async function selectPhotos(e: ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList) return;

        const selectedPhotos = Array.from(fileList);

        if (photos.length + selectedPhotos.length > maxCountPhotos) {
            setError(
                `Максимальное количество фотографий ${maxCountPhotos}!`
            );

            return;
        }

        setIsLoading(true);

        const photosUrls: string[] = [];

        try {
            for (const file of selectedPhotos) {
                const fileSize = file.size;

                if (!file.type.startsWith('image/')) {
                    setError('Неверный формат изображения!');

                    return;
                }

                if (fileSize > 10 * 1024 * 1024) {
                    setError('File max size 10mb');

                    return;
                }

                const { data } = await axios.post<{ signedUrl: string; s3Key: string }>(
                    '/api/upload',
                    {
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        folderName,
                    }
                );

                const uploadResponse = await fetch(data.signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type },
                });

                if (uploadResponse.ok) {
                    photosUrls.push(
                        `https://b4dab939-ed98-43f6-94a4-172daa28c2a2.selstorage.ru/${data.s3Key}`
                    );
                }
            }

            setPhotos([...photos, ...photosUrls]);

            if (!photos.length) setMainPhoto(photosUrls[0]);

            setError('');

        } catch (ex: unknown) {
            if (ex instanceof Error) setError(ex.toString());
        } finally {
            setIsLoading(false);
        }
    }

    async function handleClickBtnClose(urlToPhoto: string) {
        setIsLoading(true);

        try {
            setPhotos(photos.filter((photo) => photo !== urlToPhoto));

            const s3Key = urlToPhoto.split('/').slice(-2).join('/');

            await axios.delete('/api/delete-photo', {
                data: { s3Key }
            });
        } catch (ex) {
            if (ex instanceof Error) {
                console.warn('Error deleting photo');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <MyButton type="button" onClick={handlerClickBtnSelectPhotos}>
                {title}
            </MyButton>
            <input
                style={{ display: 'none' }}
                type="file"
                ref={inputSelectPhotosRef}
                multiple
                onChange={selectPhotos}
                accept="image/*"
            />
            {!!photos?.length && (
                <div className={styles.photosList}>
                    {photos.map((photo) => (
                        <div className={styles.divPhoto} key={photo}>
                            <button
                                className={styles.btnClose}
                                type="button"
                                onClick={() => handleClickBtnClose(photo)}
                            >
                                ×
                            </button>
                            <Image
                                loading="eager"
                                width={500}
                                height={500}
                                src={photo}
                                className={styles.photo}
                                alt="фотография помещения"
                            />
                        </div>
                    ))}
                </div>
            )}
            {isLoading && <Loader />}
            {error && <MyError error={error} />}
        </>
    );
};

export default SelectPhotos;
