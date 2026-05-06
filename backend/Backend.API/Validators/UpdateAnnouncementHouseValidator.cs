using Backend.API.DTO;
using FluentValidation;

namespace Backend.API.Validators;

public class UpdateAnnouncementHouseValidator : AbstractValidator<UpdateAnnouncementRequest>
{
    public UpdateAnnouncementHouseValidator()
    {
        Include(new AnnouncementHouseRequestValidator());
    }
}