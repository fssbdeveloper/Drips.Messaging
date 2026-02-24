using Drips.Messaging.Application.Services;
using Drips.Messaging.Domain.Enums;
using FluentAssertions;

namespace Drips.Messaging.Tests
{
    public class MessageClassifierTests
    {
        [Fact]
        public void Classifies_OptOut()
        {
            var classifier = new MessageClassifier();
            var result = classifier.Classify("STOP texting me");
            result.Should().Be(ConversationSignalType.OptOut);
        }

        [Theory]
        [InlineData("STOP")]
        [InlineData("stop")]
        [InlineData("  STOP  ")]
        //[InlineData("Yes")]
        //[InlineData("UNSUBSCRIBE")]
        public void Classifies_OptOut_Variants(string input)
        {
            // Arrange
            var classifier = new MessageClassifier();

            // Act
            var result = classifier.Classify(input);

            // Assert
            result.Should().Be(ConversationSignalType.OptOut);
        }

        [Fact]
        public void Classifies_General_Message_As_None()
        {
            var classifier = new MessageClassifier();
            var result = classifier.Classify("Hello, I have a question about my order.");
            result.Should().NotBe(ConversationSignalType.OptOut);
        }

        [Theory]
        [InlineData("STOP", ConversationSignalType.OptOut)]
        //[InlineData("please unsubscribe", ConversationSignalType.OptOut)]
        [InlineData("Hello there!", ConversationSignalType.Neutral)]
        [InlineData("", ConversationSignalType.Neutral)]
       // [InlineData(null, ConversationSignalType.Neutral)]
        public void Classify_ShouldReturnExpectedSignalType(string input, ConversationSignalType expected)
        {
            // Arrange
            var classifier = new MessageClassifier();

            // Act
            var result = classifier.Classify(input);

            // Assert
            result.Should().Be(expected);
        }

        
        [Theory]
        [InlineData("STOP")]
        [InlineData("UNSUBSCRIBE")]
        [InlineData("  CANCEL  ")]
        [InlineData("QUIT")]
         public void ClassifyMessage_OptOut_Variants(string message)
        {
            // Arrange
            var classifier = new MessageClassifier();

            // Act
            var result = classifier.ClassifyMessage(message);

            // Assert
            result.Should().Be(ConversationSignalType.OptOut);
        }



    }

}
 

