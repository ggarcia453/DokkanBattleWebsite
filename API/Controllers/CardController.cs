using Microsoft.AspNetCore.Mvc;
namespace DokkanAPI.Controllers;

[Route("api/[controller]")]
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

    [HttpGet("{id}")] // Add this attribute
    public async Task<IActionResult> Get(int id)
    {
        var card = await _cardService.FindCard(id);
        return Ok(card);
    }
}