using System.ComponentModel.DataAnnotations.Schema;

namespace DokkanAPI.Models
{
    [Table("Categories")]
    public class Category
    {
        [Column("category_id")]
        public int Id { get; set; }
        
        [Column("category_name")]
        public string? Name { get; set; }
        public IEnumerable<CardCategory>? CategoryCards { get; set; }
    }
}