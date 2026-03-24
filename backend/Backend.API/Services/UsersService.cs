using Backend.API.DTO;
using Backend.DataAccess;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class UsersService(
    UserRepository userRepository,
    JwtService jwtService,
    MyDbContext dbContext)
{
    public async Task<UserEntity?> GetById(Guid id)
    {
        var searchedUser = await userRepository.GetById(id);
        
        return searchedUser;
    }
    
    public async Task<UserEntity> GetByEmail(string email)
    {
        var searchedUser = await userRepository.GetByEmail(email);
        
        return searchedUser;
    }
    
    public async Task<string> Registration(RegistrationRequest registrationUser)
    {
        var hashedPassword = HashPassword.CreateHash(registrationUser.Password);

        var userRequestWithHashedPassword = registrationUser with { Password = hashedPassword };
        
        var registeredUserId = await userRepository.Registration(userRequestWithHashedPassword);
        
        var token = jwtService.GetToken(registeredUserId);
        
        return token;
    }

    public async Task<string> Login(string email, string password)
    {
        var searchedUser = await userRepository.GetByEmail(email);

        if (searchedUser == null) throw new ArgumentException("Пользователь не найден.");
        
        const int MAX_AMOUNT_ATTEMPTS_LOGIN = 10;

        if (searchedUser.BlockedLoginUntil > DateTime.UtcNow)
        {
            throw new ArgumentException("Превышено количество попыток. Попробуйте позже!");
        }
        
        if (searchedUser.AmountAttemptsLogin >= MAX_AMOUNT_ATTEMPTS_LOGIN)
        {
            searchedUser.AmountAttemptsLogin = 0;
            searchedUser.BlockedLoginUntil = DateTime.UtcNow.AddMinutes(MAX_AMOUNT_ATTEMPTS_LOGIN);
            
            await userRepository.UpdateAsync(searchedUser);
            
            throw new ArgumentException("Превышено количество попыток. Попробуйте позже!");
        }
        
        if (searchedUser.HashedPassword != HashPassword.CreateHash(password))
        {
            searchedUser.AmountAttemptsLogin += 1;
            
            await userRepository.UpdateAsync(searchedUser);
            
            throw new ArgumentException("Пароль неверный");
        }

        searchedUser.AmountAttemptsLogin = 0;
        searchedUser.BlockedLoginUntil = DateTime.UtcNow;
        
        await userRepository.UpdateAsync(searchedUser);
        
        var token = jwtService.GetToken(searchedUser.Id);

        return token;
    }
    
    public async Task<string> LoginWithGoogle(RegistrationRequest user)
    {
        var searchedUser = await userRepository.GetByEmail(user.Email);

        if (searchedUser == null)
        {
            var newUser = await userRepository.Registration(user);
            
            var newToken = jwtService.GetToken(newUser);

            return newToken;
        }
        
        var token = jwtService.GetToken(searchedUser.Id);

        return token;
    }

    public async Task<UserEntity?> Update(UpdateUserRequest updatedUserRequest)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(c => c.Id == updatedUserRequest.Id);

        if (user == null) return null;
        
        if (updatedUserRequest.Surname is not null) user.Surname = updatedUserRequest.Surname;
        if (updatedUserRequest.Name is not null) user.Name = updatedUserRequest.Name;
        if (updatedUserRequest.Patronymic is not null) user.Patronymic = updatedUserRequest.Patronymic;
        if (updatedUserRequest.Age is not null) user.Age = updatedUserRequest.Age ?? user.Age;
        if (updatedUserRequest.City is not null) user.City = updatedUserRequest.City;
        if (updatedUserRequest.Country is not null) user.Country = updatedUserRequest.Country;
        if (updatedUserRequest.Email is not null) user.Email = updatedUserRequest.Email;
        if (updatedUserRequest.PhotoUrl is not null) user.PhotoUrl = updatedUserRequest.PhotoUrl;
        if (updatedUserRequest.PhoneNumber is not null) user.PhoneNumber = updatedUserRequest.PhoneNumber;

        await dbContext.SaveChangesAsync();

        return user;
    }

    public async Task<bool> IsExistByEmail(string email)
    {
        var searchedUser = await userRepository.GetByEmail(email);
        
        if (searchedUser == null) return false;
        
        return true;
    }
}