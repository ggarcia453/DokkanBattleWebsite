using DokkanAPI.Data;
using DokkanAPI.Models;
using DokkanAPI.Models.DTOS;
using Microsoft.EntityFrameworkCore;


public class CardSearchParameters
{
    public string? Name { get; set; }
    public string? Category { get; set; }
    public string? Link { get; set; }   
    public string? Title { get; set; }
}

public interface ICardService
{
    Task<GetCardsDTO?> FindCardID(int cardId);
    Task<IEnumerable<GetCardsDTO>> GetCards();
    Task<IEnumerable<GetCardsDTO>?> FindCardName(string name);
    Task<IEnumerable<GetCardsDTO>?> FindCardCategory(string category);
    Task<IEnumerable<GetCardsDTO>?> FindCardLink(string link);
    Task<IEnumerable<GetCardsDTO>?> FindCardTitle(string title);
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
        var searchWords = name.Replace("\"", "") 
            .Split(' ', StringSplitOptions.RemoveEmptyEntries) 
            .Select(word => word.ToLower()) 
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

    public async Task<IEnumerable<GetCardsDTO>?> FindCardCategory(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return Enumerable.Empty<GetCardsDTO>();
        List<Card> cards = await _context.Cards.AsNoTracking()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Where(c => c.CardCategories != null && c.CardCategories.Any(cc =>
                cc.Category!.Name!.ToLower().Contains(category.ToLower())))
            .ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }

    public async Task<IEnumerable<GetCardsDTO>?> FindCardLink(string link)
    {
        if (string.IsNullOrWhiteSpace(link))
            return Enumerable.Empty<GetCardsDTO>();
        List<Card> cards = await _context.Cards.AsNoTracking()
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link)
            .Where(c => c.CardLinks != null && c.CardLinks.Any(cc => 
                cc.Link!.Name!.ToLower().Contains(link.ToLower()))
                ).ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }

    public async Task<IEnumerable<GetCardsDTO>?> FindCardTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Enumerable.Empty<GetCardsDTO>();
        List<Card> cards = await _context.Cards.AsNoTracking().ToListAsync();
        List<Card> filteredCards = cards.Where(card => card.Title != null && card.Title.ToLower().StartsWith(title)).ToList();
        return filteredCards.Select(Card.ToGetCardsDto);
    }
}