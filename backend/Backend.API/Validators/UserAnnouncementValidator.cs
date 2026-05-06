using Backend.API.DTO;
using FluentValidation;

namespace Backend.API.Validators;

public sealed class UserAnnouncementValidator : AbstractValidator<UserAnnouncementRequest>
{
    public UserAnnouncementValidator()
    {
        RuleFor(x => x.Description).Length(0, 500)
            .WithMessage("Длина описания должна быть от 0 до 500 символов!");

        RuleFor(x => x.City).NotEmpty()
            .WithMessage("Укажите город!");

        RuleFor(x => x.Price)
            .InclusiveBetween(0, 1_000_000)
            .WithMessage("Стоимость проживания может быть от 0 до 1_000_000!");

        RuleFor(x => x.MainPhotoUrl).NotEmpty()
            .WithMessage("Укажите фотографию!");
    }
}