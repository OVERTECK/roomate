using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class AnnouncementHouseRepository(
    MyDbContext dbContext)
{
    public async Task<bool> IsExist(Guid id)
    {
        return await dbContext.HouseAnnouncements.FirstOrDefaultAsync(c => c.Id == id) != null;
    }

    public async Task<List<HouseAnnouncementEntity>> GetAll()
    {
        return await dbContext.HouseAnnouncements.Include(c => c.CreatedUser).ToListAsync();
    }

    public async Task<HouseAnnouncementEntity?> GetById(Guid id)
    {
        var searchedAnnouncement = await dbContext.HouseAnnouncements
            .Include(c => c.CreatedUser)
            .Include(c => c.Photos)
            .FirstOrDefaultAsync(a => a.Id == id);

        return searchedAnnouncement;
    }

    public async Task<Guid> Add(HouseAnnouncementEntity houseAnnouncement)
    {
        await dbContext.AddAsync(houseAnnouncement);

        await dbContext.SaveChangesAsync();

        return houseAnnouncement.Id;
    }

    public async Task<Guid> Update(HouseAnnouncementEntity houseAnnouncementEntity)
    {
        await dbContext.HouseAnnouncements
            .Where(c => c.Id == houseAnnouncementEntity.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.City, houseAnnouncementEntity.City)
                .SetProperty(c => c.Price, houseAnnouncementEntity.Price)
                .SetProperty(c => c.HouseNumber, houseAnnouncementEntity.HouseNumber)
                .SetProperty(c => c.UpdatedAt, DateTime.UtcNow)
                .SetProperty(c => c.IsPayUtilities, houseAnnouncementEntity.IsPayUtilities)
                .SetProperty(c => c.MainPhotoUrl, houseAnnouncementEntity.MainPhotoUrl)
                .SetProperty(c => c.Country, houseAnnouncementEntity.Country)
                .SetProperty(c => c.CreatedHouse, houseAnnouncementEntity.CreatedHouse)
                .SetProperty(c => c.Street, houseAnnouncementEntity.Street)
                .SetProperty(c => c.CountRooms, houseAnnouncementEntity.CountRooms)
                .SetProperty(c => c.Description, houseAnnouncementEntity.Description)
                .SetProperty(c => c.HasGarage, houseAnnouncementEntity.HasGarage)
                .SetProperty(c => c.FullAddress, houseAnnouncementEntity.FullAddress)
                .SetProperty(c => c.HasLift, houseAnnouncementEntity.HasLift)
                .SetProperty(c => c.MaxFloor, houseAnnouncementEntity.MaxFloor));

        return houseAnnouncementEntity.Id;
    }

    public async Task<string?> Delete(Guid id)
    {
        var searchedAnnouncement = await dbContext
            .HouseAnnouncements
            .Include(c => c.Photos)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (searchedAnnouncement == null)
            return null;

        dbContext.HouseAnnouncements.Remove(searchedAnnouncement);

        await dbContext.SaveChangesAsync();

        return id.ToString();
    }
}