'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '@/app/create/user_announcement/styles.module.css';
import MyModal from '@/components/MyModal/MyModal';
import Notification from '@/components/Notification/Notification';
import TextArea from '@/components/TextArea/TextArea';
import MyInput from '@/components/UI/input/MyInput';
import MyButton from '@/components/UI/button/MyButton';
import { UpdateHouseAnnouncementSchema } from '@/schemas/updateHouseAnnouncementSchema';
import { z } from 'zod';
import HouseAnnouncementService from '@/services/HouseAnnouncementService';
import Loader from '@/components/Loader/Loader';
import SelectPhotos from '@/components/SelectPhotos/SelectPhotos';
import AddressInput from '@/components/AddressInput/AddressInput';
import MyCheckbox from '@/components/UI/input/MyCheckbox';
import { DaDataAddress, DaDataSuggestion } from 'react-dadata';
import MyError from '@/components/Error/MyError';
import { houseAnnouncementService } from '@/services';

type FormType = z.infer<typeof UpdateHouseAnnouncementSchema>;

const Page = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isShowSuccessNotification, setIsShowSuccessNotification] =
        useState(false);
    const [addressSuggestion, setAddressSuggestion] =
        useState<DaDataSuggestion<DaDataAddress>>();
    const { data, isLoading, error } = useQuery({
        queryKey: ['house_announcement', id],
        queryFn: async () => await houseAnnouncementService.getById(id),
    });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormType>({
        resolver: zodResolver(UpdateHouseAnnouncementSchema),
        defaultValues: {
            photos: [],
        },
    });

    const photos = watch('photos');

    useEffect(() => {
        if (data) {
            if (user?.id !== data?.createdUserId) {
                router.push('/');
            }
            reset({ ...data, photos: data.photos.map((x) => x.urlToImage) });
        }
    }, [data, reset]);

    const editMutation = useMutation({
        mutationFn: async (data: FormType) => {
            return await houseAnnouncementService.edit(data);
        },
        onSuccess: (data) => {
            setIsShowSuccessNotification(true);

            router.push(`/house_announcement/${id}`);
        },
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });

    if (isLoading || !data) return <Loader />;

    function handleAddressChange(suggestion?: DaDataSuggestion<DaDataAddress>) {
        setAddressSuggestion(suggestion);

        const data = suggestion?.data;

        if (!data) return null;

        setValue('city', data?.city as string);
        setValue('street', data?.street as string);
        setValue('houseNumber', data?.house as string);
    }

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
                <SelectPhotos
                    title="Выбрать фотогофии"
                    photos={photos}
                    setPhotos={(urls) => setValue('photos', urls)}
                    setMainPhoto={(photo) => setValue('mainPhotoUrl', photo)}
                    folderName="announcements"
                    maxCountPhotos={10}
                />
                {errors.photos && <MyError error={errors.photos.message!} />}
                <TextArea title="Описание:" {...register('description')} />
                {errors.description && (
                    <MyError error={errors.description.message!} />
                )}
                <Controller
                    control={control}
                    name="fullAddress"
                    render={({ field }) => (
                        <AddressInput
                            address={addressSuggestion}
                            setAddress={handleAddressChange}
                            fullAddress={field.value}
                            setFullAddress={field.onChange}
                        />
                    )}
                />
                {errors.city && <MyError error={errors.city.message!} />}
                {errors.street && <MyError error={errors.street.message!} />}
                {errors.houseNumber && (
                    <MyError error={errors.houseNumber.message!} />
                )}
                {/*<YMap />*/}
                <MyInput
                    title="Сколько должен платить сосед в месяц:"
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                />
                {errors.price && <MyError error={errors.price.message!} />}
                <MyCheckbox
                    title="Оплата за коммунальные услуги отдельно: "
                    {...register('isPayUtilities')}
                />
                <MyInput
                    title="Количество комнат:"
                    type="number"
                    {...register('countRooms', { valueAsNumber: true })}
                />
                {errors.countRooms && (
                    <MyError error={errors.countRooms.message!} />
                )}
                <MyInput
                    title="Количество этажей здания:"
                    type="number"
                    {...register('maxFloor', { valueAsNumber: true })}
                />
                {errors.maxFloor && (
                    <MyError error={errors.maxFloor.message!} />
                )}
                <MyCheckbox title="Есть гараж:" {...register('hasGarage')} />
                <MyCheckbox title="Есть лифт:" {...register('hasLift')} />
                <MyCheckbox
                    title="Имеется микроволновка: "
                    {...register('hasMicrowave')}
                />
                <MyCheckbox
                    title="Имеется холодильник: "
                    {...register('hasFridge')}
                />
                <MyCheckbox
                    title="Имеется плита: "
                    {...register('hasStove')}
                />
                <MyCheckbox
                    title="Имеется стиральная машина: "
                    {...register('hasWashingMachine')}
                />
                {errorMessage && <MyError error={errorMessage} />}
                <MyButton type="submit" disabled={editMutation.isPending}>
                    {editMutation.isPending ? 'Загрузка...' : 'Сохранить'}
                </MyButton>
            </form>
        </div>
    );
};

export default Page;
