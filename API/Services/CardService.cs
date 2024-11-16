using DokkanAPI.Data;
using DokkanAPI.Models;
using DokkanAPI.Models.DTOS;
using Microsoft.EntityFrameworkCore;

public interface ICardService
{
    Task<GetCardsDTO?> FindCard(int cardId);
    Task<IEnumerable<GetCardsDTO>> GetCards();
}

public sealed class CardService : ICardService
{
    private readonly AppDbContext _context;

    public CardService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<GetCardsDTO?> FindCard(int cardId)
    {
        Card? card = await _context.Cards.FindAsync(cardId);
        if (card == null)
        {
            return null;
        }
        else
        {
            return Card.ToGetCardsDto(card);
        }
    }

    public async Task<IEnumerable<GetCardsDTO>> GetCards()
    {
        List<Card> cards = await _context.Cards.AsNoTracking().ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }
}