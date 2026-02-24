
using Drips.Messaging.Domain.Enums;

namespace Drips.Messaging.Api.Controllers
{
    public class CreateMessageRequest
    {
        public string Content { get; set; }
        public MessageDirection Direction { get; set; }
   
    }

}
