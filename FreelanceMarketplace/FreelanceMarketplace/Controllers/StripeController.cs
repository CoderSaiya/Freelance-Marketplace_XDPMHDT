using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using System.Threading.Tasks;
using FreelanceMarketplace.Services;
using FreelanceMarketplace.Services.Interfaces;
using Microsoft.Extensions.Logging;
using FreelanceMarketplace.Models.DTOs.Req;

namespace FreelanceMarketplace.Controllers
{
    [ApiController]
    [Route("api/stripe")]
    public class StripeController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IWalletService _walletService;

        public StripeController(IConfiguration config, IWalletService walletService)
        {
            _config = config;
            _walletService = walletService;
        }

        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentReq request)
        {
            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(request.Amount * 100),
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" },
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return Ok(new { ClientSecret = paymentIntent.ClientSecret });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _config["Stripe:WebhookSecret"]);

            if (stripeEvent.Type == "payment_intent.succeeded")
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                var userId = int.Parse(paymentIntent.Metadata["UserId"]);
                var amount = paymentIntent.Amount / 100m;

                await _walletService.UpdateWalletBalanceAsync(userId, amount);
            }

            return Ok();
        }
    }
}
