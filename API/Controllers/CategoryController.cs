using DokkanAPI.Services;
using Microsoft.AspNetCore.Mvc;
namespace DokkanAPI.Controllers;

[Route("[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ILogger<CategoryController> _logger;
    private readonly ICategoryService _categoryService;
    
    public CategoryController(ILogger<CategoryController> logger, ICategoryService categoryService)
    {
        _logger = logger;
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var cards = await _categoryService.GetCategories();
            return Ok(cards);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return StatusCode(500);
        }
    }

    [HttpGet("id={id}")]
    public async Task<IActionResult> Get(int id)
    {
        var cat = await _categoryService.FindCategoryId(id);
        return Ok(cat);
    }

    [HttpGet("name={name}")]
    public async Task<IActionResult> Get(string name)
    {
        var cats = await _categoryService.FindCategoryName(name);
        return Ok(cats);
    }
}