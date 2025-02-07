using DokkanAPI.Data;
using DokkanAPI.Models;
using DokkanAPI.Models.DTOS;
using Microsoft.EntityFrameworkCore;

namespace DokkanAPI.Services;

public interface ICardService
{
    Task<GetCardsDto?> FindCardId(int cardId);
    Task<IEnumerable<GetCardsDto>> GetCards();
    Task<IEnumerable<GetCardsDto>?> FindCardName(string name);
    Task<IEnumerable<GetCardsDto>?> FindCardCategory(string category);
    Task<IEnumerable<GetCardsDto>?> FindCardLink(string link);
    Task<IEnumerable<GetCardsDto>?> FindCardTitle(string title);
    
    Task<IEnumerable<GetCardsDto>?> FindCardHpG(int hp);
    
    Task<IEnumerable<GetCardsDto>?> FindCardHpL(int hp);
}

public sealed class CardService : ICardService
{
    private readonly AppDbContext _context;

    public CardService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<GetCardsDto?> FindCardId(int cardId)
    {
        var card = await _context.Cards.AsSplitQuery()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link)
            .FirstOrDefaultAsync(c => c.Id == cardId);
        return card == null ? null : Card.ToGetCardsDto(card);
    }

    public async Task<IEnumerable<GetCardsDto>?> FindCardName(string name)
    {
        var searchWords = name.Replace("\"", "") 
            .Split(' ', StringSplitOptions.RemoveEmptyEntries) 
            .Select(word => word.ToLower()) 
            .ToArray();
        if (string.IsNullOrWhiteSpace(name))
            return null;
        var cards = await _context.Cards.AsSplitQuery()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link)
            .AsNoTracking()
            .ToListAsync();
        
        var filteredCards = cards
            .Where(card => searchWords.All(word => 
                card.Name != null && card.Name.Contains(word, StringComparison.CurrentCultureIgnoreCase)))
            .Select(Card.ToGetCardsDto);
        return filteredCards;
    }

    public async Task<IEnumerable<GetCardsDto>> GetCards()
    {
        List<Card> cards = await _context.Cards.AsSplitQuery()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link).AsNoTracking().ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }

    public async Task<IEnumerable<GetCardsDto>?> FindCardCategory(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return Enumerable.Empty<GetCardsDto>();
        List<Card> cards = await _context.Cards.AsNoTracking()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Where(c => c.CardCategories != null && c.CardCategories.Any(cc =>
                cc.Category!.Name!.ToLower().Contains(category.ToLower())))
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link)
            .ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }

    public async Task<IEnumerable<GetCardsDto>?> FindCardLink(string link)
    {
        if (string.IsNullOrWhiteSpace(link))
            return Enumerable.Empty<GetCardsDto>();
        List<Card> cards = await _context.Cards.AsNoTracking()
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link)
            .Where(c => c.CardLinks != null && c.CardLinks.Any(cc => 
                cc.Link!.Name!.ToLower().Contains(link.ToLower())))
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .ToListAsync();
        return cards.Select(Card.ToGetCardsDto);
    }

    public async Task<IEnumerable<GetCardsDto>?> FindCardTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Enumerable.Empty<GetCardsDto>();
        List<Card> cards = await _context.Cards.AsSplitQuery()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link).AsNoTracking().ToListAsync();
        List<Card> filteredCards = cards.Where(card => card.Title != null && card.Title.ToLower().StartsWith(title)).ToList();
        return filteredCards.Select(Card.ToGetCardsDto);
    }

    public async Task<IEnumerable<GetCardsDto>?> FindCardHpG(int hp)
    {
        List<Card> cards = await _context.Cards.AsSplitQuery()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link).AsNoTracking().ToListAsync();
        List<Card> filteredCards = cards.Where(card => card.Hp >= hp).ToList();
        return filteredCards.Select(Card.ToGetCardsDto);
    }
    
    public async Task<IEnumerable<GetCardsDto>?> FindCardHpL(int hp)
    {
        List<Card> cards = await _context.Cards.AsSplitQuery()
            .Include(c => c.CardCategories)!
            .ThenInclude(cc => cc.Category)
            .Include(c => c.CardLinks)!
            .ThenInclude(cl => cl.Link).AsNoTracking().ToListAsync();
        List<Card> filteredCards = cards.Where(card => card.Hp <= hp).ToList();
        return filteredCards.Select(Card.ToGetCardsDto);
    }
}