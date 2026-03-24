import { z } from 'zod';

export const userAnnouncementSchema = z.object({
    id: z.string(),

    price: z
        .number('Введите число!')
        .int('Цена должна быть указана целым числом!')
        .min(0, 'Цена не может быть меньше нуля!'),

    city: z.string().nonempty('Укажите город!'),

    description: z
        .string()
        .max(500, 'Длина описания не должна быть больше 500 символов!'),

    surname: z
        .string()
        .max(50, 'Длина фамилии не должна превышать 50 символов!'),

    name: z.string().max(50, 'Длина имени не должна превышать 50 символов!'),

    createdUserId: z.uuid().nonempty('Войдите в аккаунт!'),

    mainPhotoUrl: z.string().nonempty(),
});
