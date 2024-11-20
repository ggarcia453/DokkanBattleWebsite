using DokkanAPI;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DokkanAPI.Models
{
    public class CardCategory
    {
        [Column("card_id")]
        public int CardId { get; set; }
        public Card? Card { get; set; }
        
        [Column("category_id")]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }   
}