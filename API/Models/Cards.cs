using System.ComponentModel.DataAnnotations.Schema;
using DokkanAPI.Models.DTOS;
namespace DokkanAPI.Models
{
    [Table("cards")]
    public class Card
    {
        [Column("card_id")]
        public int Id { get; set; }
        [Column("title")]
        public string? Title { get; set; }
        [Column("name")]
        public string? Name { get; set; }
        [Column("hp")]
        public int Hp { get; init; }
        [Column("atk")]
        public int Atk { get; init; }

        [Column("def")] 
        public int Def { get; init; }
        public IEnumerable<CardCategory>? CardCategories { get; set; }
        public IEnumerable<CardLink>? CardLinks { get; set; }

        public static GetCardsDto ToGetCardsDto(Card card)
        {
            return new GetCardsDto
            {
                Id = card.Id,
                Name = card.Name,
                Title = card.Title,
                Hp = card.Hp,
                Atk = card.Atk,
                Def = card.Def,
                Categories = card.CardCategories?.Select(cc => cc.Category!.Name),
                Links = card.CardLinks?.Select(cc => cc.Link!.Name),
            };
        }
        
        
    }
    
}

