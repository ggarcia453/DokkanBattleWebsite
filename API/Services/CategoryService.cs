using System.Diagnostics;
using DokkanAPI.Data;
using DokkanAPI.Models;
using DokkanAPI.Models.DTOS;
using Microsoft.EntityFrameworkCore;

namespace DokkanAPI.Services;

public interface ICategoryService
{
    Task<IEnumerable<GetCategoryDto?>> GetCategories();
    Task<GetCategoryDto?> FindCategoryId(int id);
    Task<IEnumerable<GetCategoryDto?>> FindCategoryName(string name);
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

    public async Task<GetCategoryDto?> FindCategoryId(int id)
    {
        Category? category = await _context.Categories.FindAsync(id);
        return category == null ? null : Category.ToCategoryDto(category);
        
    }

    public async Task<IEnumerable<GetCategoryDto?>> FindCategoryName(string name)
    {
        List<Category> categories = await _context.Categories.ToListAsync();
        return categories.Where(c =>
        {
            Debug.Assert(c.Name != null, "c.Name != null");
            return c.Name.StartsWith(name, StringComparison.OrdinalIgnoreCase);
        }).Select(Category.ToCategoryDto);
    }
}