'use client';

import {
    FormEvent,
    useEffect,
    useState,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { DaDataAddress, DaDataSuggestion } from 'react-dadata';
import SelectPhotos from '@/components/SelectPhotos/SelectPhotos';
import styles from './styles.module.css';
import MyError from '@/components/Error/MyError';
import AddressInput from '@/components/AddressInput/AddressInput';
import TextArea from '@/components/TextArea/TextArea';
import { HouseAnnouncementSchema } from '@/schemas/HouseAnnouncementSchema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import MyButton from '@/components/UI/button/MyButton';
import MyCheckbox from '@/components/UI/input/MyCheckbox';
import MyInput from '@/components/UI/input/MyInput';
import { AxiosError } from 'axios';
import { houseAnnouncementService } from '@/services';

type FormType = z.infer<typeof HouseAnnouncementSchema>;

export default function CreateAnnouncement() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [address, setAddress] = useState<DaDataSuggestion<DaDataAddress>>();
    const { user, isAuth, isAuthLoading } = useAuth();
    const createMutation = useMutation({
        mutationFn: (form: FormType) => {
            return houseAnnouncementService.create(form);
        },
        onSuccess: (form) => {
            router.push('/');
        },
        onError: (error: AxiosError) => {
            setError(error.response?.data as string || 'Произошла ошибка при создании объявления');
            console.log(error);
        }
    })

    useEffect(() => {
        if (address) {
            setValue("city", address.data.city || "")
            setValue("street", address.data.street || "")
            setValue("houseNumber", address.data.house || "")
        }
    }, [address])

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors } } =
        useForm({
            resolver: zodResolver(HouseAnnouncementSchema),
            defaultValues: {
                createdUserId: user?.id,
                mainPhotoUrl: "default_announcement_img.png",
                photos: [],
            }
        })

    useEffect(() => {
        if (!isAuthLoading) {
            if (!isAuth || user === null) {
                router.push('/login');
            }
        }
    }, [isAuthLoading, isAuth, user, router]);

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit((form) => createMutation.mutate(form),
                (errors) => console.log(errors))}>
                <MyButton
                    type="button"
                    onClick={() => router.push('/choice_announcement')}
                >
                    Назад
                </MyButton>
                <h1 className={styles.title}>Создание объявления</h1>
                <div className={styles.formFields}>
                    <Controller
                        name="photos"
                        control={control}
                        render={({ field }) => (
                            <SelectPhotos
                                title="Выбрать фотографии"
                                photos={field.value}
                                setPhotos={field.onChange}
                                setMainPhoto={(newPhoto) =>
                                    setValue('mainPhotoUrl', newPhoto)
                                }
                                folderName="announcements"
                                maxCountPhotos={10}
                            />
                        )}
                    />
                    {errors.photos && <MyError error={errors.photos.message!} />}
                    <Controller
                        control={control}
                        name="fullAddress"
                        render={({ field }) => (
                            <AddressInput
                                address={address}
                                setAddress={setAddress}
                                fullAddress={field.value}
                                setFullAddress={field.onChange}
                            />
                        )}
                    />
                    {errors.city && <MyError error={errors.city.message!} />}
                    {errors.street && <MyError error={errors.street.message!} />}
                    {errors.houseNumber && <MyError error={errors.houseNumber.message!} />}
                    {/*<YMap />*/}
                    <MyInput
                        title="Сколько должен платить сосед в месяц:"
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && <MyError error={errors.price.message!} />}
                    <MyCheckbox
                        title="Оплата за коммунальные услуги отдельно: "
                        {...register("isPayUtilities")}
                    />
                    {errors.isPayUtilities && <MyError error={errors.isPayUtilities.message!} />}
                    <MyCheckbox
                        title="Имеется стиральная машина: "
                        {...register("hasWashingMachine")}
                    />
                    {errors.hasWashingMachine && <MyError error={errors.hasWashingMachine.message!} />}
                    <MyCheckbox
                        title="Имеется микроволновка: "
                        {...register("hasMicrowave")}
                    />
                    {errors.hasMicrowave && <MyError error={errors.hasMicrowave.message!} />}
                    <MyCheckbox
                        title="Имеется плита для готовки: "
                        {...register("hasStove")}
                    />
                    {errors.hasStove && <MyError error={errors.hasStove.message!} />}
                    <MyCheckbox
                        title="Имеется холодильник: "
                        {...register("hasFridge")}
                    />
                    {errors.hasFridge && <MyError error={errors.hasFridge.message!} />}
                    <MyInput
                        title="Нужное количество соседей:"
                        type="number"
                        {...register("requiredNumberNeighbors", { valueAsNumber: true })}
                    />
                    {errors.requiredNumberNeighbors && <MyError error={errors.requiredNumberNeighbors.message!} />}
                    <MyInput
                        title="Количество комнат:"
                        type="number"
                        {...register("countRooms", { valueAsNumber: true })}
                    />
                    {errors.countRooms && <MyError error={errors.countRooms.message!} />}
                    <MyInput
                        title="Количество этажей здания:"
                        type="number"
                        {...register("maxFloor", { valueAsNumber: true })}
                    />
                    {errors.maxFloor && <MyError error={errors.maxFloor.message!} />}
                    <MyCheckbox
                        title="Есть гараж:"
                        {...register("hasGarage")}
                    />
                    {errors.hasGarage && <MyError error={errors.hasGarage.message!} />}
                    <MyCheckbox
                        title="Есть лифт:"
                        {...register("hasLift")}
                    />
                    {errors.hasLift && <MyError error={errors.hasLift.message!} />}
                    <MyInput
                        title="Этаж жилья:"
                        type="number"
                        {...register("floor", { valueAsNumber: true })}
                    />
                    {errors.floor && <MyError error={errors.floor.message!} />}
                    <TextArea
                        toolTib='Опишите квартиру и условия проживания. Например: район, правила дома, образ жизни и какого соседа вы ищете (без вредных привычек, с животными и т.д.)'
                        title="Описание:"
                        {...register("description")}
                    />
                    {errors.description && <MyError error={errors.description.message!} />}
                </div>
                <MyError error={error} />
                <MyButton disabled={createMutation.isPending}>{createMutation.isPending ? 'Создание...' : 'Завершить'}</MyButton>
            </form>
        </div>
    );
}