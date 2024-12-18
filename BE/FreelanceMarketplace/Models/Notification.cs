﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FreelanceMarketplace.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public bool? IsRead { get; set; } = false;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        [Required]
        public int SenderId { get; set; }

        [ForeignKey("SenderId")]
        public Users? Sender { get; set; }

        [Required]
        public int ReceiverId { get; set; }

        [ForeignKey("ReceiverId")]
        public Users? Receiver { get; set; }
    }
}
