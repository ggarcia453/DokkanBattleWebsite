using System.ComponentModel.DataAnnotations.Schema;

namespace DokkanAPI.Models
{
 
    [Table("linkskills")]
    public class Link
    {
        [Column("link_skill_id")]
        public int Id { get; set; }

        [Column("link_name")]
        public string? Name { get; set; }
        
        public IEnumerable<CardLink>? LinkCards { get; set; } 
    }   
}