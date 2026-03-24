using Backend.API.DTO;
using FluentValidation;

namespace Backend.API.Validators;

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty()
            .WithMessage("Имя не должно быть пустым");

        RuleFor(x => x.Name).Matches(@"^\D*$")
            .WithMessage("Имя не должно содержать цифры!");
        
        RuleFor(x => x.Surname).NotEmpty()
            .WithMessage("Фамилия не должна быть пустым");

        RuleFor(x => x.Surname).Matches(@"^\D*$")
            .WithMessage("Фамилия не должна содержать цифры!");

        RuleFor(x => x.Age);

        RuleFor(x => x.Age).InclusiveBetween(0, 200)
            .WithMessage("Возраст должен быть от 0 до 200!");

        RuleFor(x => x.Country);

        RuleFor(x => x.City);
        
        
    }
}