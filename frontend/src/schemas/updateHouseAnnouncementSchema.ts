import { z } from 'zod';

export const UpdateHouseAnnouncementSchema = z.object({
    id: z.string('Введите id'),
    createdUserId: z.string('Введите id пользователя'),
    price: z
        .number('Укажите стоимость проживания!')
        .int('Цена должна быть указана целым числом!')
        .min(0, 'Цена не может быть меньше нуля!'),

    countRooms: z
        .number()
        .int('Количество комнат должно быть целым числом!')
        .positive('Количество комнат должно быть больше нуля!'),

    maxFloor: z
        .number()
        .int('Количество этажей должно быть целым числом!')
        .positive('Количество этажей должно быть больше нуля!'),

    mainPhotoUrl: z.string().nonempty('Укажите фотографию'),

    hasGarage: z.boolean(),

    hasLift: z.boolean(),

    // country: z.string()
    //     .nonempty("Укажите страну!"),

    city: z.string().nonempty('Укажите город!'),

    street: z.string().nonempty('Укажите улицу!'),

    houseNumber: z.string().nonempty('Укажите номер дома!'),

    createdHouse: z.number(),

    isPayUtilities: z.boolean(),

    description: z
        .string()
        .max(500, 'Длина описания не должна быть больше 500 символов!'),

    photos: z
        .array(z.string('Ссылка должна быть строкой!'))
        .nonempty('Укажите хотя бы одну фотографию!')
        .max(10, 'Максимальное количество фотографий: 10шт!'),

    fullAddress: z.string('Укажите полный адрес!'),
    hasWashingMachine: z.boolean(),
    hasMicrowave: z.boolean(),
    hasStove: z.boolean(),
    hasFridge: z.boolean(),
    requiredNumberNeighbors: z.number(),
});
