using AutoMapper;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Entities;

namespace Backend.API.MappingProfiles;

public class HouseAnnouncementProfile : Profile
{
    public HouseAnnouncementProfile()
    {
        CreateMap<HouseAnnouncementEntity, AnnouncementResponse>()
            .ForMember(dest => dest.CreatedUserId,
                opt => 
                    opt.MapFrom(src => src.CreatedUser.Id))
            .ForMember(dest => dest.PhotosUrls, 
                opt =>
            opt.MapFrom(src => src.Photos.Select(c => c.UrlToImage).ToList()));
    }
}