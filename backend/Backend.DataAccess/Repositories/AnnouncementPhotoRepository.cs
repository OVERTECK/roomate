using Backend.DataAccess.Entities;

namespace Backend.DataAccess.Repositories;

public class AnnouncementPhotoRepository(
    MyDbContext dbContext)
{
    public async Task<HouseAnnouncementPhotoEntity> Create(string urlToImage, Guid announcementId )
    {
        var newAnnouncementPhoto = new HouseAnnouncementPhotoEntity
        {
            Id = Guid.NewGuid(),
            HouseAnnouncementId = announcementId,
            UrlToImage = urlToImage,
        };

        await dbContext.AnnouncementPhotos.AddAsync(newAnnouncementPhoto);
        
        return newAnnouncementPhoto;
    }
}