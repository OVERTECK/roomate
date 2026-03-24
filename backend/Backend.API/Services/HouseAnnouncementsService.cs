using System.Text.Json;
using Backend.API.DTO;
using Backend.DataAccess;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Backend.API.Services;

public class HouseAnnouncementsService(
    AnnouncementHouseRepository announcementHouseRepository,
    UsersService usersService,
    AnnouncementPhotoRepository announcementPhotoRepository,
    IDistributedCache cache,
    MyDbContext dbContext,
    FlatsRepository flatsRepository)
{
    public async Task<List<HouseAnnouncementEntity>> GetAll()
    {
        const string cacheKey = "announcements_";

        var cachedData = await cache.GetStringAsync(cacheKey);

        if (!string.IsNullOrWhiteSpace(cachedData))
        {
            return JsonSerializer.Deserialize<List<HouseAnnouncementEntity>>(cachedData) ?? new List<HouseAnnouncementEntity>();
        }

        var announcements = await announcementHouseRepository.GetAll();

        await cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(announcements), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2),
            SlidingExpiration = TimeSpan.FromMinutes(2)
        });

        return announcements;
    }

    public async Task<List<HouseAnnouncementEntity>> GetByCity(string city)
    {
        var announcements = await dbContext
            .HouseAnnouncements
            .Include(c => c.CreatedUser)
            .Where(c => c.City == city)
            .ToListAsync();

        return announcements;
    }

    public async Task<HouseAnnouncementEntity?> GetById(Guid id)
    {
        var announcement = await announcementHouseRepository.GetById(id);

        return announcement;
    }

    public async Task<List<HouseAnnouncementEntity>> GetByUserId(Guid userId)
    {
        var announcements = await dbContext
            .HouseAnnouncements
            .Include(c => c.CreatedUser)
            .Where(c => c.CreatedUserId == userId)
            .ToListAsync();

        return announcements;
    }

    public async Task<Guid?> Create(AnnouncementFlatRequest announcementFlatRequest)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            var searchedUser = await usersService.GetById(announcementFlatRequest.CreatedUserId);

            var countAnnouncements = await dbContext
                .HouseAnnouncements
                .Where(c => c.CreatedUserId == announcementFlatRequest.CreatedUserId)
                .CountAsync();

            if (countAnnouncements > 5) return null;

            if (searchedUser == null) return null;

            var announcementId = Guid.NewGuid();

            var photos = new List<HouseAnnouncementPhotoEntity>();

            foreach (var photoUrl in announcementFlatRequest.Photos)
            {
                var photoEntity = await announcementPhotoRepository.Create(photoUrl, announcementId);

                photos.Add(photoEntity);
            }

            var announcement = new HouseAnnouncementEntity
            {
                Id = announcementId,
                Description = announcementFlatRequest.Description,
                Country = announcementFlatRequest.Country,
                City = announcementFlatRequest.City,
                Street = announcementFlatRequest.Street,
                Photos = photos,
                MainPhotoUrl = announcementFlatRequest.MainPhotoUrl,
                HouseNumber = announcementFlatRequest.HouseNumber,
                HasGarage = announcementFlatRequest.HasGarage,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Price = announcementFlatRequest.Price,
                CreatedHouse = announcementFlatRequest.CreatedHouse,
                CountRooms = announcementFlatRequest.CountRooms,
                HasLift = announcementFlatRequest.HasLift,
                MaxFloor = announcementFlatRequest.MaxFloor,
                CreatedUserId = announcementFlatRequest.CreatedUserId,
                IsPayUtilities = announcementFlatRequest.IsPayUtilities,
                FullAddress = announcementFlatRequest.FullAddress,
                Floor = announcementFlatRequest.Floor,
                HasFridge = announcementFlatRequest.HasFridge,
                HasMicrowave = announcementFlatRequest.HasMicrowave,
                HasStove = announcementFlatRequest.HasStove,
                HasWashingMachine = announcementFlatRequest.HasWashingMachine,
                RequiredNumberNeighbors = announcementFlatRequest.RequiredNumberNeighbors
            };

            await announcementHouseRepository.Add(announcement);

            // var flatId = Guid.NewGuid();

            // var newFlat = new FlatEntity
            // {
            //     Id = flatId,
            //     Floor = announcementFlatRequest.Floor,
            //     AnnouncementId = announcementId,
            //     UserId = announcementFlatRequest.CreatedUserId,
            // };

            // await flatsRepository.Create(newFlat);

            await transaction.CommitAsync();

            return announcementId;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();

            throw new Exception(ex.Message);
        }
    }

    public async Task<Guid?> Update(UpdateAnnouncementRequest announcementRequest)
    {
        var isExist = await announcementHouseRepository.IsExist(announcementRequest.Id);

        if (!isExist) return null;

        await dbContext
            .AnnouncementPhotos
            .Where(c => c.HouseAnnouncementId == announcementRequest.Id)
            .ExecuteDeleteAsync();

        var oldAnnouncement = await announcementHouseRepository.GetById(announcementRequest.Id);

        var announcement = new HouseAnnouncementEntity
        {
            Id = announcementRequest.Id,
            Photos = [],
            Description = announcementRequest.Description,
            City = announcementRequest.City,
            Street = announcementRequest.Street,
            Country = "Россия",
            HasGarage = announcementRequest.HasGarage,
            CreatedAt = oldAnnouncement.CreatedAt,
            UpdatedAt = DateTime.UtcNow,
            MainPhotoUrl = announcementRequest.MainPhotoUrl,
            HouseNumber = announcementRequest.HouseNumber,
            CreatedHouse = announcementRequest.CreatedHouse,
            Price = announcementRequest.Price,
            CreatedUserId = announcementRequest.CreatedUserId,
            CountRooms = announcementRequest.CountRooms,
            HasLift = announcementRequest.HasLift,
            MaxFloor = announcementRequest.MaxFloor,
            IsPayUtilities = announcementRequest.IsPayUtilities,
            FullAddress = announcementRequest.FullAddress,
            Floor = announcementRequest.Floor,
            HasFridge = announcementRequest.HasFridge,
            HasMicrowave = announcementRequest.HasMicrowave,
            HasStove = announcementRequest.HasStove,
            HasWashingMachine = announcementRequest.HasWashingMachine,
            RequiredNumberNeighbors = announcementRequest.RequiredNumberNeighbors
        };

        var updatedId = await announcementHouseRepository.Update(announcement);

        foreach (var photoUrl in announcementRequest.Photos)
        {
            await dbContext
                .AnnouncementPhotos
                .AddAsync(new HouseAnnouncementPhotoEntity
                {
                    Id = Guid.NewGuid(),
                    HouseAnnouncementId = announcementRequest.Id,
                    UrlToImage = photoUrl
                });
        }

        await dbContext.SaveChangesAsync();

        return updatedId;
    }

    public async Task<string?> DeleteById(Guid id)
    {
        var searchedId = await announcementHouseRepository.Delete(id);

        return searchedId;
    }
}