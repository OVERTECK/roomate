using Backend.API.DTO;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class FlatsRepository(MyDbContext dbContext)
{
    public async Task<List<FlatEntity>?> GetAll()
    {
        return await dbContext.Flats.AsNoTracking().ToListAsync();
    }

    public async Task<FlatEntity?> GetById(Guid id)
    {
        return await dbContext.Flats.FindAsync(id);
    }

    public async Task<Guid> Create(FlatEntity flat)
    {
        await dbContext.Flats.AddAsync(flat);
        
        await dbContext.SaveChangesAsync();
        
        return flat.Id;
    }

    public async Task Update(FlatEntity flatEntity)
    {
        await dbContext.Flats.Where(c => c.Id == flatEntity.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.Floor, flatEntity.Floor));
        
        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.Flats.Where(c => c.Id == id).ExecuteDeleteAsync();
        
        await dbContext.SaveChangesAsync();
    }
}