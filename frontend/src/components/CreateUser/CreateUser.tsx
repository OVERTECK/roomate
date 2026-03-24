'use client';

import React, {
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
    useEffect,
    useState,
} from 'react';
import styles from './CreateUser.module.css';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import MyInput from '@/components/UI/input/MyInput';
import MyButton from '@/components/UI/button/MyButton';
import SelectPhotos from '@/components/SelectPhotos/SelectPhotos';
import MyError from '@/components/Error/MyError';
import { AxiosError } from 'axios';
import { createUserSchema } from '@/schemas/user.schema';
import SelectRussiaCity from '@/components/SelectRussiaCity/SelectRussiaCity';
import { RegistrationRequest } from '@/DTO/request/RegistrationRequest';
import { registrationService } from '@/services';

function CreateUser({
    email,
    password,
}: {
    email: string;
    password: string;
}): ReactNode {
    const [error, setError] = useState<string>('');
    const [formPhotos, setFormPhotos] = useState<string[]>([]);
    const [mainPhoto, setMainPhoto] = useState<string>('');
    const router = useRouter();
    const { login } = useAuth();

    const [formCreateUser, setFormCreateUser] = useState<RegistrationRequest>({
        email: email,
        password: password,
        phoneNumber: '',
        surname: '',
        name: '',
        patronymic: '',
        age: 0,
        country: 'Россия',
        city: '',
        createdAccount: new Date().toISOString().split('T')[0],
        photoUrl: '/default_user_img.svg',
    });

    useEffect(() => {
        if (mainPhoto) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormCreateUser((prev) => ({
                ...prev,
                photoUrl: mainPhoto,
            }));
        }
    }, [mainPhoto]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const resultValidate = createUserSchema.safeParse(formCreateUser);

            if (!resultValidate.success) {
                setError(resultValidate.error.issues[0].message);

                return;
            }

            const { token, user } =
                await registrationService.Registration(formCreateUser);

            login(token, user);

            router.push('/');
        } catch (ex) {
            if (ex instanceof AxiosError) {
                if (ex.response) {
                    setError(ex.response.data);
                }
            }
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Создание пользователя</h1>
                <input
                    type="email"
                    name="email"
                    readOnly
                    style={{ display: 'none' }}
                />
                <input
                    type="password"
                    name="password"
                    readOnly
                    style={{ display: 'none' }}
                />
                <SelectPhotos
                    title="Выбрать фотографию"
                    photos={formPhotos}
                    setPhotos={setFormPhotos}
                    setMainPhoto={setMainPhoto}
                    folderName="/users"
                    maxCountPhotos={1}
                />
                <MyInput
                    title="Номер телефона:"
                    type="phone"
                    value={formCreateUser.phoneNumber.toString()}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormCreateUser({
                            ...formCreateUser,
                            phoneNumber: e.target.value,
                        })
                    }
                />
                <div
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {/*{errors?.name?._errors.join(', ')}*/}
                </div>
                <MyInput
                    title="Фамилия:"
                    value={formCreateUser.surname}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormCreateUser({
                            ...formCreateUser,
                            surname: e.target.value,
                        })
                    }
                />
                <div
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {/*{errors?.name?._errors.join(', ')}*/}
                </div>
                <MyInput
                    title="Имя:"
                    value={formCreateUser.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormCreateUser({
                            ...formCreateUser,
                            name: e.target.value,
                        })
                    }
                />
                <div
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {/*{errors?.name?._errors.join(', ')}*/}
                </div>
                <MyInput
                    title="Отчество: (не обязательно)"
                    value={formCreateUser.patronymic}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormCreateUser({
                            ...formCreateUser,
                            patronymic: e.target.value,
                        })
                    }
                />
                <div
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {/*{errors?.name?._errors.join(', ')}*/}
                </div>
                <MyInput
                    title="Возраст: (лет)"
                    type="number"
                    value={formCreateUser.age <= 0 ? '' : formCreateUser.age}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormCreateUser({
                            ...formCreateUser,
                            age: Number(e.target.value),
                        })
                    }
                />
                <div
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {/*{errors?.name?._errors.join(', ')}*/}
                    {/*</div>*/}
                    {/*<MyInput*/}
                    {/*    title="Страна:"*/}
                    {/*    value={formCreateUser.country}*/}
                    {/*    onChange={(e: ChangeEvent<HTMLInputElement>) =>*/}
                    {/*        setFormCreateUser({...formCreateUser, country: e.target.value})}/>*/}
                    {/*<div style={{*/}
                    {/*    color: "red",*/}
                    {/*    fontWeight: "bold",*/}
                    {/*}}>*/}
                    {/*{errors?.name?._errors.join(', ')}*/}
                </div>
                <SelectRussiaCity
                    setAddress={(value) =>
                        setFormCreateUser({
                            ...formCreateUser,
                            city: value as string,
                        })
                    }
                />
                <div
                    style={{
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {/*{errors?.name?._errors.join(', ')}*/}
                </div>
                <MyError error={error} />
                <MyButton type="submit">Зарегистрировать</MyButton>
            </form>
        </div>
    );
}

export default CreateUser;
