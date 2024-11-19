using System.ComponentModel.DataAnnotations;
namespace DokkanAPI.Models.DTOS;

public class GetCardsDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Title { get; set; }
    public int Hp { get; init; }
    public int Atk { get; init; }
    public int Def { get; init; }

    public static Card ToCard(GetCardsDTO getCardsDto)
    {
        return new Card
        {
            Id = getCardsDto.Id,
            Name = getCardsDto.Name,
            Title = getCardsDto.Title,
            Hp = getCardsDto.Hp,
            Atk = getCardsDto.Atk,
            Def = getCardsDto.Def
        };
    }
}