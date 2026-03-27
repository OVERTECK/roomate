using Backend.API.DTO;
using FluentValidation;

namespace Backend.API.Validators;

public sealed class AnnouncementHouseRequestValidator : AbstractValidator<AnnouncementFlatRequest>
{
    public AnnouncementHouseRequestValidator()
    {
        RuleFor(x => x.Description).Length(0, 500)
            .WithMessage("Длина описания должна быть от 0 до 500 символов!");

        RuleFor(x => x.HasGarage).NotNull()
            .WithMessage("Укажите наличие гаража!");

        RuleFor(x => x.HasLift).NotNull()
            .WithMessage("Укажите наличие лифта!");

        RuleFor(x => x.City).NotEmpty()
            .WithMessage("Укажите город!");

        RuleFor(x => x.CountRooms).GreaterThan(0)
            .WithMessage("Количество комнат не может быть меньше нуля или равно нулю!");

        RuleFor(x => x.MaxFloor).GreaterThan(0)
            .WithMessage("Количество этажей здания не может быть меньше нуля или равно нулю!");

        RuleFor(x => x.Price).GreaterThanOrEqualTo(0)
            .WithMessage("Стоимость проживания не может быть отрицательной!");

        RuleFor(x => x.Street).NotEmpty()
            .WithMessage("Укажите улицу!");

        RuleFor(x => x.MainPhotoUrl).NotEmpty()
            .WithMessage("Укажите фотографию!");

        RuleFor(x => x.CreatedUserId).NotEmpty()
            .WithMessage("Укажите id пользователя!");

        RuleFor(x => x.HouseNumber).NotEmpty()
            .WithMessage("Укажите номер дома!");

        RuleFor(x => x.CreatedHouse).InclusiveBetween(0, DateTime.Today.Year)
            .WithMessage($"Год постройки здания может быть от 0 до {DateTime.Today.Year}");

        RuleFor(x => x.Photos).NotEmpty()
            .WithMessage("Список фотографий не должен быть пустым!");
    }
}