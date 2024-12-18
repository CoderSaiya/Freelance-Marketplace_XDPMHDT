using Microsoft.AspNetCore.SignalR;

namespace FreelanceMarketplace.Hubs
{
    public class VideoCallHub : Hub
    {
        public async Task SendOffer(string receiverConnectionId, string offer)
        {
            await Clients.Client(receiverConnectionId).SendAsync("ReceiveOffer", offer);
        }

        public async Task SendAnswer(string callerConnectionId, string answer)
        {
            await Clients.Client(callerConnectionId).SendAsync("ReceiveAnswer", answer);
        }

        public async Task SendIceCandidate(string targetConnectionId, string candidate)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveIceCandidate", candidate);
        }
    }
}
