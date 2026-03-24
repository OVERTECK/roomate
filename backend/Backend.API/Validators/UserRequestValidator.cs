using Backend.API.DTO;
using FluentValidation;

namespace Backend.API.Validators;

public class UserRequestValidator : AbstractValidator<RegistrationRequest>
{
    public UserRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty()
            .WithMessage("Почта не должна быть пустой");

        RuleFor(x => x.Email)
            .Matches(@"^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$")
            .WithMessage("Почта должна соответствовать формату!");

        RuleFor(x => x.Password).NotEmpty()
            .WithMessage("Пароль не должен быть пустым!");

        RuleFor(x => x.Password)
            .Matches(@"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+-=|\\]).{8,32}$")
            .WithMessage("Пароль должен содержать в себе хотя бы одну цифру, " +
                         "строчную, заглавную латинскую букву, спец символ *.!@$%^&(){}[]:;<>,.?/~_+-=|\\ " +
                         "Быть в длину от 8 до 32 символов.");

        RuleFor(x => x.Name).NotEmpty()
            .WithMessage("Имя не должно быть пустым");

        RuleFor(x => x.Name).Matches(@"^\D*$")
            .WithMessage("Имя не должно содержать цифры!");
        
        RuleFor(x => x.Surname).NotEmpty()
            .WithMessage("Фамилия не должна быть пустым");

        RuleFor(x => x.Surname).Matches(@"^\D*$")
            .WithMessage("Фамилия не должна содержать цифры!");

        RuleFor(x => x.Age).NotEmpty()
            .WithMessage("Возраст не должен быть пустым!");

        RuleFor(x => x.Age).InclusiveBetween(0, 200)
            .WithMessage("Возраст должен быть от 0 до 200!");

        RuleFor(x => x.Country).NotEmpty()
            .WithMessage("Страна должна быть указана!");

        RuleFor(x => x.City).NotEmpty()
            .WithMessage("Город должен быть указан!");

        RuleFor(x => x.PhoneNumber).Matches(@"^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$")
            .WithMessage("Неверный формат номера телефона!");
    }
}