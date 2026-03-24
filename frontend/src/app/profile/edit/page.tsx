'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';
import MyInput from '@/components/UI/input/MyInput';
import MyButton from '@/components/UI/button/MyButton';
import MyError from '@/components/Error/MyError';
import MyModal from '@/components/MyModal/MyModal';
import Notification from '@/components/Notification/Notification';
import { useRouter, useParams } from 'next/navigation';
import SelectRussiaCity from '@/components/SelectRussiaCity/SelectRussiaCity';
import { userService } from '@/services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ImageUser from '@/components/ImageUser/ImageUser';
import { updateUserSchema } from '@/schemas/updateUserSchema';

type FormType = z.infer<typeof updateUserSchema>;

const Page = () => {
    const { user } = useAuth();
    const [isShowNotification, setIsShowNotification] =
        useState<boolean>(false);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    if (!user) return;

    const { data, isLoading, error } = useQuery({
        queryKey: ['user', user?.id],
        queryFn: async () => await userService.getById(user?.id),
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(updateUserSchema),
    });

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data])

    const editMutation = useMutation({
        mutationFn: (form: FormType) => {
            return userService.update(form);
        },
        onSuccess: (data) => {
            setIsShowNotification(true);

            setTimeout(() => {
                setIsShowNotification(false);

                router.push(`/profile/${user?.id}`);
            }, 1500);
        },
        onError: (error) => {
            setErrorMessage(error.message)
            console.error(error.message)
        },
    });

    return (
        <div className={styles.container}>
            <MyModal
                positionStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                }}
                visible={isShowNotification}
                setVisible={setIsShowNotification}
                isCloseOnClickToVoid={true}
            >
                <Notification title="Успешное изменение профиля" />
            </MyModal>
            <header className={styles.header}>Редактирование профиля</header>
            <form className={styles.fields} onSubmit={handleSubmit((form) => editMutation.mutate(form))}>
                <Controller
                    name="photoUrl"
                    control={control}
                    render={({ field }) => (
                        <ImageUser
                            urlToImage={field.value}
                            setUrlToImage={field.onChange}
                        />
                    )}
                />
                {errors.photoUrl && <MyError error={errors.photoUrl.message!} />}
                <MyInput title="Фамилия:" {...register('surname')} />
                {errors.surname && <MyError error={errors.surname.message!} />}
                <MyInput title="Имя:" {...register('name')} />
                {errors.name && <MyError error={errors.name.message!} />}
                <MyInput
                    title="Отчетство:"
                    placeholder="Не указано"
                    {...register('patronymic')}
                />
                {errors.patronymic && <MyError error={errors.patronymic.message!} />}
                <MyInput
                    title="Возраст:"
                    placeholder="Не указано"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                />
                {errors.age && <MyError error={errors.age.message!} />}
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <SelectRussiaCity
                            city={field.value}
                            setAddress={field.onChange}
                        />
                    )}
                />
                {errors.city && <MyError error={errors.city.message!} />}
                {/* {errorMessage && <MyError error={errorMessage} />} */}
                <MyButton
                    disabled={editMutation.isPending}
                >
                    {editMutation.isPending ? 'Загрузка...' : 'Сохранить'}
                </MyButton>
            </form>
        </div>
    );
};

export default Page;
