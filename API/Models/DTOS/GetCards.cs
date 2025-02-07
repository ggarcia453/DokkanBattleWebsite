namespace DokkanAPI.Models.DTOS;

public class GetCardsDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Title { get; set; }
    public int Hp { get; init; }
    public int Atk { get; init; }
    public int Def { get; init; }
    public IEnumerable<string?>? Categories { get; set; }
    public IEnumerable<string?>? Links { get; set; } 

    public static Card ToCard(GetCardsDto getCardsDto)
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