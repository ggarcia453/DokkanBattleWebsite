using DokkanAPI.Data;
using DokkanAPI.Models;
using DokkanAPI.Models.DTOS;
using Microsoft.EntityFrameworkCore;

public interface ICardService
{
    Task<GetCardsDTO?> FindCardID(int cardId);
    Task<IEnumerable<GetCardsDTO>> GetCards();
    Task<IEnumerable<GetCardsDTO>?> FindCardName(string name);
}

public sealed class CardService : ICardService
{
    private readonly AppDbContext _context;

    public CardService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<GetCardsDTO?> FindCardID(int cardId)
    {
        var card = await _context.Cards.FindAsync(cardId);
        return card == null ? null : Card.ToGetCardsDto(card);
    }

    public async Task<IEnumerable<GetCardsDTO>?> FindCardName(string name)
    {
        var searchWords = name.Replace("\"", "")  // Remove quotation marks
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)  // Split on spaces, ignore empty entries
            .Select(word => word.ToLower())  // Convert to lower case
            .ToArray();
        if (string.IsNullOrWhiteSpace(name))
            return null;
        var cards = await _context.Cards
            .AsNoTracking()
            .ToListAsync();
        
        var filteredCards = cards
            .Where(card => searchWords.All(word => 
                card.Name != null && card.Name.Contains(word, StringComparison.CurrentCultureIgnoreCase)))
            .Select(Card.ToGetCardsDto);
        return filteredCards;
    }

    public async Task<IEnumerable<GetCardsDTO>> GetCards()
    {
        List<Card> cards = await _context.Cards.AsNoTracking().ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }
}