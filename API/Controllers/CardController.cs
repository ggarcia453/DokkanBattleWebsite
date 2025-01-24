using DokkanAPI.Services;
using Microsoft.AspNetCore.Mvc;
namespace DokkanAPI.Controllers;

[Route("[controller]")]
[ApiController]
public class CardController : ControllerBase
{
    private readonly ILogger<CardController> _logger;
    private readonly ICardService _cardService;

    public CardController(ILogger<CardController> logger, ICardService cardService)
    {
        _logger = logger;
        _cardService = cardService;
    }
    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var cards = await _cardService.GetCards();
            return Ok(cards);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            return StatusCode(500);
        }
    }

    [HttpGet("id={id}")]
    public async Task<IActionResult> Get(int id)
    {
        var card = await _cardService.FindCardId(id);
        return Ok(card);
    }

    [HttpGet("name={name}")]
    public async Task<IActionResult> Get(string name)
    {
        var cards = await _cardService.FindCardName(name);
        return Ok(cards);
    }

    [HttpGet("category={category}")]
    public async Task<IActionResult> FindCardCategory(string category)
    {
        var cards = await _cardService.FindCardCategory(category);
        return Ok(cards);
    }

    [HttpGet("link={link}")]
    public async Task<IActionResult> FindCardLink(string link)
    {
        var cards = await _cardService.FindCardLink(link);
        return Ok(cards);
    }

    [HttpGet("title={title}")]
    public async Task<IActionResult> FindCardTitle(string title)
    {
        var cards = await _cardService.FindCardTitle(title);
        return Ok(cards);
    }
}