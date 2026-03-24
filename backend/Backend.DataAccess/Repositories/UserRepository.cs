using Backend.API.DTO;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class UserRepository(MyDbContext dbContext)
{
    public async Task<List<UserEntity>> GetAll()
    {
        return await dbContext.Users.ToListAsync();
    }

    public async Task<UserEntity?> GetByEmail(string email)
    {
        var searchedUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        
        return searchedUser;
    }

    public async Task<UserEntity?> GetById(Guid id)
    {
        var searchedUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        
        return searchedUser;
    }
    
    public async Task<Guid> Registration(RegistrationRequest registrationRequest)
    {
        var searchedUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == registrationRequest.Email);

        if (searchedUser != null)
        {
            throw new Exception("User already exists");
        }

        var newUser = new UserEntity
        {
            Id = Guid.NewGuid(),
            Surname = registrationRequest.Surname,
            Name = registrationRequest.Name,
            Age = registrationRequest.Age,
            Email = registrationRequest.Email,
            PhotoUrl = registrationRequest.PhotoUrl,
            HashedPassword = registrationRequest.Password,
            CreatedAccount = DateOnly.FromDateTime(DateTime.Today),
            Country = registrationRequest.Country,
            City = registrationRequest.City,
            PhoneNumber = registrationRequest.PhoneNumber,
            Patronymic = registrationRequest.Patronymic
        };
        
        await dbContext.Users.AddAsync(newUser);
        
        await dbContext.SaveChangesAsync();
        
        return newUser.Id;
    }
    
    public async Task UpdateAsync(UserEntity updatedUser)
    {
        await dbContext
            .Users
            .Where(c => c.Id == updatedUser.Id)
            .ExecuteUpdateAsync(c => c
                .SetProperty(x => x.Email, updatedUser.Email)
                .SetProperty(x => x.Name, updatedUser.Name)
                .SetProperty(x => x.Surname, updatedUser.Surname)
                .SetProperty(x => x.Patronymic, updatedUser.Patronymic)
                .SetProperty(x => x.Age, updatedUser.Age)
                .SetProperty(x => x.City, updatedUser.City)
                .SetProperty(x => x.Country, updatedUser.Country)
                .SetProperty(x => x.PhotoUrl, updatedUser.PhotoUrl)
                .SetProperty(x => x.PhoneNumber, updatedUser.PhoneNumber)
                .SetProperty(x => x.HashedPassword, updatedUser.HashedPassword)
                .SetProperty(x => x.AmountAttemptsLogin, updatedUser.AmountAttemptsLogin)
                .SetProperty(x => x.BlockedLoginUntil, updatedUser.BlockedLoginUntil)
                .SetProperty(x => x.IsAdmin, updatedUser.IsAdmin));
    }
}