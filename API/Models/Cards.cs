using System.ComponentModel.DataAnnotations.Schema;
using DokkanAPI.Models.DTOS;
namespace DokkanAPI.Models
{
    [Table("Cards")]
    public class Card
    {
        [Column("card_id")]
        public int Id { get; set; }
        [Column("title")]
        public string? Title { get; set; }
        [Column("name")]
        public string? Name { get; set; }
        public int hp { get; init; }
        public int atk { get; init; }
        public int def { get; init; }

        public static GetCardsDTO ToGetCardsDto(Card card)
        {
            return new GetCardsDTO
            {
                Id = card.Id,
                Name = card.Name,
                Title = card.Title,
                Hp = card.hp,
                Atk = card.atk,
                Def = card.def
            };
        }
    }
    
}

