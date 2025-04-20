import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
import axios from 'axios';

const RespComp = ({ steps, triggerNextStep })=> {
    const [response, setResponse] = useState("Thinking...");
    const [conversationId, setConversationId] = useState(Date.now().toString());
    
    // Initialize with a welcome message
    useEffect(() => {
        const handleUserMessage = async (userInput) => {
            try {
            // Call your Flask API
            const resp = await axios.post('http://localhost:5000/chat', {
                "user_id": conversationId,
                "message": userInput
            });
            
            setResponse(resp.data.message);
            console.log(resp.data)
            } catch (error) {
            setResponse('Sorry, I encountered an error. Please try again.');
            console.error('API Error:', error);
            }
        };
        const userMsg = steps['user-input']?.value || '';
        handleUserMessage(userMsg)
        setTimeout(() => {
            triggerNextStep();
          }, 10);
    }, []);
    return (
        <div>{response}</div>
    );
}
const CustomChatComponent = () => {
    const [message, setMessage] = useState("");


  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ChatBot
        steps={[
          {
            id: '1',
            message: 'Hello! I can help analyze your patient\'s digital behavior report. What would you like to know?',
            trigger: 'user-input'
          },
          {
            id: 'user-input',
            user: true,
            trigger: 'bot-response',
          },
          {
            id: 'bot-response',
            component: <RespComp />,
            waitAction: true,
            trigger: 'user-input',
            asMessage: true
          }
        ]}
        headerTitle="Behavior Report Assistant"
        floating={true}
      />
      {/* <ChatBot
          floating ={true}
          steps={[
            {
              id: 'howCanI',
              message: 'How can I help you?',
              trigger: 'question'
            },
            {
              id: 'question',
              user: true,
              trigger: 'answer'
            },
            {
              id: 'answer',
              message: 'rr',
              trigger: 'question'
            },
          ]}
        /> */}
    </div>
  );
};

export default CustomChatComponent;