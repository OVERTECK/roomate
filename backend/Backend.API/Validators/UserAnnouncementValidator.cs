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
        
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0)
            .WithMessage("Стоимость проживания не может быть отрицательным!");
        
        RuleFor(x => x.MainPhotoUrl).NotEmpty()
            .WithMessage("Укажите фотографию!");
    }
}