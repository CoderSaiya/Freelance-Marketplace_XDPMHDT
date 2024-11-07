using FreelanceMarketplace.Data;
using FreelanceMarketplace.Hubs;
using FreelanceMarketplace.Models;
using FreelanceMarketplace.Models.DTOs.Res;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using FreelanceMarketplace.Models.DTOs.Req;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IHubContext<ChatHub> _chatHub;
    private readonly IUserService _userService;
    private readonly AppDbContext _context;

    public ChatController(IHubContext<ChatHub> chatHub, IUserService userService, AppDbContext dbContext)
    {
        _chatHub = chatHub;
        _userService = userService;
        _context = dbContext;
    }

    [HttpPost("sendAll")]
    public async Task<IActionResult> SendMessage(string user, string message)
    {
        await _chatHub.Clients.All.SendAsync("ReceiveMessage", user, message);
        return Ok(new Response<string>
        {
            Success = true,
            Message = "Message sent",
            Data = null
        });
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ChatMessageDto chatMessage)
    {
        if (chatMessage == null) return BadRequest("Message cannot be null");

        var senderId = _userService.GetUserByUsername(chatMessage.Sender)?.Id;
        var recipientId = _userService.GetUserByUsername(chatMessage.Recipient)?.Id;
        if (senderId == null || recipientId == null) return BadRequest("Invalid sender or recipient");

        var chatMsg = new ChatMessage
        {
            SenderId = senderId,
            RecipientId = recipientId,
            Message = chatMessage.Message,
            Timestamp = DateTime.UtcNow
        };

        _context.ChatMessages.Add(chatMsg);
        await _context.SaveChangesAsync();

        await _chatHub.Clients.User(senderId.ToString()).SendAsync("ReceiveMessage", chatMessage.Sender, chatMessage.Message);
        await _chatHub.Clients.User(recipientId.ToString()).SendAsync("ReceiveMessage", chatMessage.Sender, chatMessage.Message);

        return Ok();
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetChatHistory(string user1, string user2)
    {
        var user1Id = _userService.GetUserByUsername(user1)?.Id;
        var user2Id = _userService.GetUserByUsername(user2)?.Id;
        if (user1Id == null || user2Id == null) return BadRequest("Invalid users");

        // Fetch messages where either user is sender and the other is recipient
        var messages = await _context.ChatMessages
            .Where(m => (m.SenderId == user1Id && m.RecipientId == user2Id) ||
                        (m.SenderId == user2Id && m.RecipientId == user1Id))
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

        return Ok(messages);
    }
}