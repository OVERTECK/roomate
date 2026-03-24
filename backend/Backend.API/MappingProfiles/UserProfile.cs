using AutoMapper;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Entities;

namespace Backend.API.MappingProfiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserEntity, CreatedUserResponse>();
    }    
}