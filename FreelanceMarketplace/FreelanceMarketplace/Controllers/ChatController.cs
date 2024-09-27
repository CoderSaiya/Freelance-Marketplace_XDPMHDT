using FreelanceMarketplace.Hubs;
using FreelanceMarketplace.Models.DTOs.Res;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IHubContext<ChatHub> _chatHub;

    public ChatController(IHubContext<ChatHub> chatHub)
    {
        _chatHub = chatHub;
    }

    [HttpPost("send")]
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
}