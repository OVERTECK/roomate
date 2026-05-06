import { z } from 'zod';

export const HouseAnnouncementSchema = z.object({
    createdUserId: z.string('Введите id пользователя'),
    price: z
        .number('Укажите цену!')
        .int('Цена должна быть указана целым числом!')
        .min(0, 'Цена не может быть меньше нуля!'),

    countRooms: z
        .number('Укажите количество комнат!')
        .int('Количество комнат должно быть целым числом!')
        .positive('Количество комнат должно быть больше нуля!'),

    maxFloor: z
        .number('Укажите максимальное количество этажей!')
        .int('Количество этажей должно быть целым числом!')
        .positive('Количество этажей должно быть больше нуля!'),

    mainPhotoUrl: z.string().min(1, 'Укажите фотографию'),

    hasGarage: z.boolean(),

    hasLift: z.boolean(),

    // country: z.string()
    //     .nonempty("Укажите страну!"),

    city: z.string('Укажите город!').min(1, 'Укажите город!'),

    street: z.string('Укажите улицу!').min(1, 'Укажите улицу!'),

    houseNumber: z.string('Укажите номер дома!').min(1, 'Укажите номер дома!'),

    isPayUtilities: z.boolean(),

    description: z
        .string()
        .max(500, 'Длина описания не должна быть больше 500 символов!'),

    photos: z
        .array(z.string('Ссылка должна быть строкой!'))
        .nonempty('Укажите хотя бы одну фотографию!')
        .max(10, 'Максимальное количество фотографий: 10шт!'),

    floor: z
        .number('Укажите этаж!')
        .int('Этаж должен быть целым числом!')
        .min(1, 'Этаж не может быть меньше 1!')
        .max(163, 'Этаж не может быть больше 163!'),

    requiredNumberNeighbors: z
        .number('Укажите количество соседей!')
        .int('Количество соседей должно быть целым числом!')
        .min(1, 'Минимум 1 сосед!')
        .max(20, 'Слишком большое количество соседей!'),

    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),

    hasWashingMachine: z.boolean(),
    hasMicrowave: z.boolean(),
    hasStove: z.boolean(),
    hasFridge: z.boolean(),
    fullAddress: z.string(),
});
