namespace DokkanAPI.Models.DTOS;

public class GetCategoryDto
{
    public int Id { get; set; }
    public string? Name { get; set; }

    public static Category ToCategory(GetCategoryDto getCategoryDto)
    {
        return new Category
        {
            Id = getCategoryDto.Id,
            Name = getCategoryDto.Name,
        };
    }
}