using System.ComponentModel.DataAnnotations.Schema;
using DokkanAPI.Models.DTOS;

namespace DokkanAPI.Models
{
    [Table("categories")]
    public class Category
    {
        [Column("category_id")]
        public int Id { get; set; }
        
        [Column("category_name")]
        public string? Name { get; set; }
        public IEnumerable<CardCategory>? CategoryCards { get; set; }

        public static GetCategoryDto ToCategoryDto(Category category)
        {
            return new GetCategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }
    }
}