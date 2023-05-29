import { Component, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ChatService } from '../../services.service';
import { MatDialog } from '@angular/material/dialog';
import { MoviedialogComponent } from '../moviedialog/moviedialog.component';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('chatbotConversation') chatbotConversationRef!: ElementRef;

  isOpen: boolean = false;
  inputMessage: string = '';
  messages: { text: string; isBot: boolean; isLoading?: boolean }[] = [];
  isLogoClicked: boolean = false;

  constructor(private location: Location, private chatService: ChatService, private dialog: MatDialog) { }

  showQuickReplies = true; // Flag to control the visibility of quick reply buttons
  quickReplies: string[] = ['About ChatBot', 'EarnTV ?', 'Contact Us']; // Quick reply options

  ngOnInit() {
    this.messages.push({ text: 'Hi User, Welcome to EarnTV Chatbot', isBot: true });
    this.messages.push({ text: "I'm Mr. EarnTVChatbot 😎 Nice to meet you! 👋", isBot: true });
  }

  toggleChatbot(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.focusInput();
        this.scrollChatToBottom();
      }, 0);
      this.showQuickReplies = true; // Show quick reply buttons when chatbot is opened
    } else {
      this.clearChatbotConversation(); // Clear chat history when closing
      this.showQuickReplies = false; // Hide quick reply buttons when chatbot is closed
    }
    const url = this.isOpen ? '/chat' : '/';
    this.location.go(url);
  }

  refreshChatbot(): void {
    this.clearChatbotConversation();
    this.inputMessage = '';
    this.focusInput();
    this.showQuickReplies = true; // Show quick reply buttons when chatbot is refreshed
  }

  clearChatbotConversation(): void {
    this.messages = [
      this.messages[0],
      { text: "I'm Mr. EarnTVChatbot 😎 Nice to meet you! 👋", isBot: true }
    ];
    this.showQuickReplies = true; // Show quick reply buttons when chatbot conversation is cleared
  }

  sendMessage(): void {
    const message = this.inputMessage.trim();
    if (message === '') return;

    // Clear the input message
    this.inputMessage = '';
  
    // Disable input and send button during loading
    const inputElement = document.getElementById('chatbot-input') as HTMLInputElement;
    const sendButton = document.getElementById('send-button') as HTMLButtonElement;
    if (inputElement && sendButton) {
      inputElement.disabled = true;
      sendButton.disabled = true;
    }
  
    // Add user message to the chat
    this.messages.push({ text: message, isBot: false });
  
    // Add loading animation message
    this.messages.push({ text: '...', isBot: true, isLoading: true });
  
    // Hide quick reply buttons when user sends a message
    this.showQuickReplies = false;
  
    setTimeout(() => {
      this.chatService.askQuestion(message).subscribe(
        (response: any) => {
          if (response.answer) {
            const answer = response.answer;
  
            // Replace the loading animation message with the response
            const loadingMessageIndex = this.messages.findIndex(msg => msg.isLoading);
            if (loadingMessageIndex !== -1) {
              this.messages.splice(loadingMessageIndex, 1, { text: answer, isBot: true });
            }
  
            // Enable input and send button after loading
            if (inputElement && sendButton) {
              inputElement.disabled = false;
              sendButton.disabled = false;
            }
  
            // Clear the input message
            this.inputMessage = '';
  
            // Scroll to the bottom of the chat
            this.scrollChatToBottom();
          } else {
            const errorMessage = 'Sorry, I did not understand your question.';
  
            // Replace the loading animation message with the error message
            const loadingMessageIndex = this.messages.findIndex(msg => msg.isLoading);
            if (loadingMessageIndex !== -1) {
              this.messages.splice(loadingMessageIndex, 1, { text: errorMessage, isBot: true });
            }
  
            // Enable input and send button after loading
            if (inputElement && sendButton) {
              inputElement.disabled = false;
              sendButton.disabled = false;
            }
  
            // Clear the input message
            this.inputMessage = '';
  
            // Scroll to the bottom of the chat
            this.scrollChatToBottom();
          }
  
          if (this.inputMessage.trim().length > 0) {
            this.showQuickReplies = false; // Hide quick reply buttons when user provides input
          }
        },
        (error: any) => {
          console.error(error);
          const errorMessage = 'An error occurred. Please try again later.';
  
          // Replace the loading animation message with the error message
          const loadingMessageIndex = this.messages.findIndex(msg => msg.isLoading);
          if (loadingMessageIndex !== -1) {
            this.messages.splice(loadingMessageIndex, 1, { text: errorMessage, isBot: true });
          }
  
          // Enable input and send button after loading
          if (inputElement && sendButton) {
            inputElement.disabled = false;
            sendButton.disabled = false;
          }
  
          // Scroll to the bottom of the chat
          this.scrollChatToBottom();
        }
      );
    }, 2000); // Delay of 2 seconds (2000 milliseconds)
  }

  sendQuickReply(reply: string): void {
    this.messages.push({ text: reply, isBot: false });

    // Determine the corresponding answer based on the selected quick reply
    let answer = '';
    if (reply === 'About ChatBot') {
      answer = 'Hi! I\'m EarnTV chatbot, created to resolve your questions about movies and its related contents available on our platform. I can help you find movies by genre, direct link to movies ..etc. Just ask me a question related to movies and all';
    } else if (reply === 'EarnTV ?') {
      answer = 'Earn TV is a PVOD (Premium Video on Demand) platform where users get to watch world-class premium content and be rewarded with Earn TV coins.';
    } else if (reply === 'Contact Us') {
      answer = 'You can contact us at <a href="https://earntv.io/contact/" target="_blank">https://earntv.io/contact/</a>';
    }

    this.messages.push({ text: answer, isBot: true });
    this.showQuickReplies = true; // Show quick reply buttons after displaying the answer

    setTimeout(() => {
      this.scrollChatToBottom();
    }, 0);
  }

  isLink(text: string): boolean {
    return text.includes('<a href');
  }

  scrollChatToBottom(): void {
    const chatbotConversation = this.chatbotConversationRef.nativeElement;
    if (chatbotConversation) {
      chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }
  }

  focusInput(): void {
    const chatbotInput = document.getElementById('chatbot-input');
    if (chatbotInput) {
      chatbotInput.focus();
    }
  }
  openMovieDialog(): void {
    const dialogRef = this.dialog.open(MoviedialogComponent, {
      width: '300px',
      // Add any additional configuration options for the dialog
    });

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe((result) => {
      // Handle the dialog close event if needed
    });
  }
}
