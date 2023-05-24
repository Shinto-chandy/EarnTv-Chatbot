import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('chatbotConversation') chatbotConversationRef!: ElementRef;

  isOpen: boolean = false;
  inputMessage: string = '';
  messages: { text: string; isBot: boolean }[] = [];
  isLogoClicked: boolean = false;

  constructor(private location: Location) {}

  ngOnInit() {
    this.messages.push({ text: 'Hi User, Welcome to EarnTV Chatbot', isBot: true });
  }

  toggleChatbot(): void {
    if (this.isOpen) {
      this.clearChatbotConversation();
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.focusInput();
        this.scrollChatToBottom();
      }, 0);
    }
    const url = this.isOpen ? '/chat' : '/';
    this.location.go(url);
  }  

  refreshChatbot(): void {
    this.clearChatbotConversation();
    this.inputMessage = '';
    this.focusInput();
  }

  clearChatbotConversation(): void {
    this.messages = [this.messages[0]];
  }

  sendMessage(): void {
    const message = this.inputMessage.trim();
    if (message === '') return;

    this.messages.push({ text: message, isBot: false });
    this.inputMessage = '';

    // Send the message to the backend API and get the response
    // Replace <YOUR_API_ENDPOINT> with your actual API endpoint
    // and handle the response accordingly
    fetch('<YOUR_API_ENDPOINT>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
      .then(response => response.json())
      .then(response => {
        this.messages.push({ text: response, isBot: true });

        // Scroll to the latest message and its response
        setTimeout(() => {
          this.scrollChatToBottom();
        }, 0);
      })
      .catch(error => {
        console.error(error);
        this.messages.push({
          text: "An error occurred. Server is not responding. Please try again later.",
          isBot: true
        });
      });
  }

  scrollChatToBottom(): void {
    const chatbotConversation = this.chatbotConversationRef.nativeElement;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
  }

  focusInput(): void {
    const chatbotInput = document.getElementById('chatbot-input');
    if (chatbotInput) {
      chatbotInput.focus();
    }
  }
}
