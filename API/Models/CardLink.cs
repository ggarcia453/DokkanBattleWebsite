using DokkanAPI;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DokkanAPI.Models
{
    [Table("cardlinkskills")]
    public class CardLink
    {
        [Column("card_id")]
        public int CardId { get; set; }
        public Card? Card { get; set; }
        
        [Column("link_skill_id")]
        public int LinkId { get; set; }
        public Link? Link { get; set; }
    }   
}