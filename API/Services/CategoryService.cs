using DokkanAPI.Data;
using DokkanAPI.Models;
using DokkanAPI.Models.DTOS;
using Microsoft.EntityFrameworkCore;

namespace DokkanAPI.Services;

public interface ICategoryService
{
    Task<IEnumerable<GetCategoryDto?>> GetCategories();
    // Task<GetCategoryDto?> FindCategoryId(int id);
    // Task<GetCategoryDto> FindCategoryName(string name);
}

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    
    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GetCategoryDto?>> GetCategories()
    {
        List<Category> categories = await _context.Categories.ToListAsync();
        return categories.Select(Category.ToCategoryDto);
    }
}