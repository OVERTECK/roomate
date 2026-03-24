using Backend.API.DTO;
using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class UsersAnnouncementsService(
    MyDbContext dbContext)
{
    public async Task<List<UserAnnouncementEntity>> GetByCity(string city)
    {
        var announcements = await dbContext
            .UsersAnnouncements
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Where(x => x.City == city)
            .ToListAsync();

        return announcements;
    }

    public async Task<List<UserAnnouncementEntity>> GetByUserId(Guid userId)
    {
        var announcements = await dbContext
            .UsersAnnouncements
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Where(x => x.CreatedUserId == userId)
            .ToListAsync();

        return announcements;
    }

    public async Task<UserAnnouncementEntity?> GetById(Guid announcementId)
    {
        var announcement = await dbContext
            .UsersAnnouncements
            .Include(x => x.CreatedUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == announcementId);

        return announcement;
    }

    public async Task AddAsync(UserAnnouncementEntity announcement)
    {
        await dbContext.UsersAnnouncements.AddAsync(announcement);

        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserAnnouncementEditRequest requestAnnouncement)
    {
        await dbContext
            .UsersAnnouncements
            .Where(x => x.Id == requestAnnouncement.Id)
            .ExecuteUpdateAsync(x => x
                .SetProperty(c => c.Id, requestAnnouncement.Id)
                .SetProperty(c => c.UpdatedAt, DateTime.UtcNow)
                .SetProperty(c => c.City, requestAnnouncement.City)
                .SetProperty(c => c.Description, requestAnnouncement.Description)
                .SetProperty(c => c.Price, requestAnnouncement.Price)
                .SetProperty(c => c.Surname, requestAnnouncement.Surname)
                .SetProperty(c => c.Name, requestAnnouncement.Name)
                .SetProperty(c => c.MainPhotoUrl, requestAnnouncement.MainPhotoUrl));
    }

    public async Task<int> DeleteAsync(Guid id)
    {
        return await dbContext
            .UsersAnnouncements
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync();
    }
}