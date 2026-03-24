using Microsoft.EntityFrameworkCore;
using Backend.DataAccess.Entities;

namespace Backend.DataAccess;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
    public DbSet<UserEntity> Users { get; set; }
    
    public DbSet<HouseEntity> Houses { get; set; }
    public DbSet<FlatEntity> Flats { get; set; }
    
    public DbSet<MessageEntity> Messages { get; set; }
    
    public DbSet<ChatEntity> Chats { get; set; }
    
    public DbSet<ChatParticipantEntity> ChatParticipants { get; set; }
    
    public DbSet<HouseAnnouncementPhotoEntity> AnnouncementPhotos { get; set; }
    public DbSet<HouseAnnouncementEntity> HouseAnnouncements { get; set; }
    
    public DbSet<UserAnnouncementEntity> UsersAnnouncements { get; set; }
    
    public DbSet<EmailCodeEntity> EmailCodes { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}