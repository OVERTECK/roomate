'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/create/user_announcement/styles.module.css';
import ImageUser from '@/components/ImageUser/ImageUser';
import TextArea from '@/components/TextArea/TextArea';
import MyInput from '@/components/UI/input/MyInput';
import SelectRussiaCity from '@/components/SelectRussiaCity/SelectRussiaCity';
import MyError from '@/components/Error/MyError';
import MyButton from '@/components/UI/button/MyButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserAnnouncementService } from '@/services/UserAnnouncementService';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'node:crypto';
import Notification from '@/components/Notification/Notification';
import MyModal from '@/components/MyModal/MyModal';
import { userAnnouncementSchema } from '@/schemas/userAnnouncement.schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader/Loader';
import { userAnnouncementService } from '@/services';

type FormType = z.infer<typeof userAnnouncementSchema>;

const Page = () => {
    const { id } = useParams<{ id: UUID }>();
    const router = useRouter();
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isShowSuccessNotification, setIsShowSuccessNotification] =
        useState(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['user_announcement', id],
        queryFn: async () => await userAnnouncementService.getById(id),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<FormType>({
        resolver: zodResolver(userAnnouncementSchema),
    });

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data, reset]);

    const editMutation = useMutation({
        mutationFn: (data: FormType) => {
            return userAnnouncementService.edit(data);
        },
        onSuccess: (data) => {
            setIsShowSuccessNotification(true);

            router.push(`/user_announcement/${id}`);
        },
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });

    if (isLoading) return <Loader />;

    return (
        <div className={styles.container}>
            <MyModal
                visible={isShowSuccessNotification}
                setVisible={setIsShowSuccessNotification}
                positionStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                }}
                isCloseOnClickToVoid={true}
            >
                <Notification title="Успешное обновление" />
            </MyModal>
            <header className={styles.header}>
                Редактирование объявления пользователя
            </header>
            <form
                className={styles.form}
                onSubmit={handleSubmit((data) => editMutation.mutate(data))}
            >
                <Controller
                    name="mainPhotoUrl"
                    control={control}
                    render={({ field }) => (
                        <ImageUser
                            urlToImage={field.value}
                            setUrlToImage={field.onChange}
                        />
                    )}
                />
                <TextArea title="Описание:" {...register('description')} />
                {errors.description && (
                    <MyError error={errors.description.message!} />
                )}
                <MyInput title="Имя:" {...register('name')} />
                {errors.name && <MyError error={errors.name.message!} />}
                <MyInput title="Фамилия:" {...register('surname')} />
                {errors.surname && <MyError error={errors.surname.message!} />}
                <MyInput
                    title="Готов(а) платить в месяц:"
                    {...register('price', { valueAsNumber: true })}
                />
                {errors.price && <MyError error={errors.price.message!} />}
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <SelectRussiaCity
                            title="Город проживания:"
                            city={field.value}
                            setAddress={field.onChange}
                        />
                    )}
                />
                {errors.city && <MyError error={errors.city.message!} />}
                <MyButton type="submit" disabled={editMutation.isPending}>
                    {editMutation.isPending ? 'Загрузка...' : 'Сохранить'}
                </MyButton>
            </form>
        </div>
    );
};

export default Page;
