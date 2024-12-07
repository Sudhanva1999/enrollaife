import { useState, useRef, useEffect } from 'react';
import { Send as SendIcon } from '@mui/icons-material';
import { CssBaseline,TextField, Button, Box, Typography, Dialog, DialogContent, DialogTitle, Fade } from '@mui/material';
import ReactMarkdown from 'react-markdown'; 
import { sendMessageToChatbot } from '../../services/user-service';
import { Loader } from './loader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {RootState}  from './../../redux-store/store';

// Defining types for the messages
type Message = {
  id: number;
  type: 'user' | 'bot';
  content: string;
  options: null | string[];
};

// Main component
const ChatInterface = () => {
  //Getting user profile data from the redux store
  const userProfile = useSelector((state: RootState) => state.user.userProfile);
  const courses = useSelector((state: RootState) => state.courses.courses);

  //Storing intro message from
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your Course Advisor. I'll help you choose courses.",
      options: null
    }
  ]);

  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [openSessionExpiredModal, setOpenSessionExpiredModal] = useState<boolean>(false);

  const navigate = useNavigate();  

  // Function to scroll to the bottom of the message container
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };  

  // Scrolling to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
    //Logic to retain redux state on page refresh
    if(userProfile === null) {
      navigate('/user/profile');
    }
  }, [messages, currentResponse]);

  // Function to handle user input
  const handleSend = async (): Promise<void> => {
    if (!userInput.trim()) return;

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      {
        id: messages.length + 1,
        type: 'user',
        content: userInput,
        options: null
      }
    ];

    // Update state
    setMessages(newMessages);
    setIsLoading(true);
    setCurrentResponse('');

    // Making API call to backend chatbot endpoint
    try {

      const response = await sendMessageToChatbot(userInput, JSON.stringify(userProfile), JSON.stringify(courses));

      // Text decoder to handle streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let fullResponse = '';

      while (true) {
        if (!reader) break;
        const { done, value } = await reader.read();
        if (done) break;
      
        const decodedChunk = decoder.decode(value);
        const events = decodedChunk.split('\n\n');
      
        events.forEach(event => {
          if (event.startsWith('data: ')) {
            const rawData = event.replace('data: ', '').trim();
      
            // Checking if the event is '[DONE]'
            if (rawData === '[DONE]') {
              // End of stream, finalizing the message
              setMessages(prevMessages => [
                ...prevMessages,
                {
                  id: prevMessages.length + 1,
                  type: 'bot',
                  content: fullResponse,
                  options: null
                }
              ]);
              setCurrentResponse(''); // Resetting current response
              setIsLoading(false); 
              return; 
            }
      
            // Try to parse the event as JSON
            try {
              const parsedEvent = JSON.parse(rawData);
      
              // Accumulate content from the stream without updating during the process
              if (parsedEvent.content) {
                fullResponse += parsedEvent.content;
              }
            } catch (parseError) {
              console.error('Error parsing event:', parseError);
            }
          }
        });
      }
      setCurrentResponse(fullResponse); 
      
    } catch (error) {
      console.error('Error during API call:', error);
      setIsLoading(false);      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          type: 'bot',
          content: "Sorry, there was an error processing your request.",
          options: null
        }
      ]);
      setOpenSessionExpiredModal(true);
    }

    // Clear user input
    setUserInput('');
  };

  // Function to close the success modal and navigate to login page
  const handleCloseSuccessModal = () => {
    setOpenSessionExpiredModal(false);
    navigate('/login'); // Redirect to login after closing modal
  };

  // Chatbot UI
  return (    
  <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ background: '#ffffff'}}>  
  <CssBaseline />
  <Box 
    bgcolor="#1976d2" 
    color="white" 
    p={2} 
    boxShadow={3}
    sx={{
      display: 'flex',
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderRadius: '0 0 20px 20px',
      boxShadow: 4,
      position: 'fixed',
      width: '100%',
      background: 'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)', 
      '@media (max-width: 600px)': { p: 1 }, 
    }}
  >
    
    <Button
      onClick={() => window.location.href = '/user/profile'} 
      variant="contained"
      color="secondary" 
      sx={{
        textTransform: 'none',
        fontWeight: 'bold',
        borderRadius: '20px',
        '&:hover': {
          backgroundColor: '#1565c0', 
        },
        '@media (max-width: 600px)': {
          fontSize: '0.875rem', 
        },
      }}
    >
      EnrollAI
    </Button>
   
    <Typography 
      variant="h5" 
      component="h1" 
      gutterBottom 
      sx={{
        fontWeight: 'bold', 
        textAlign: 'center', 
        flexGrow: 1, 
        '@media (max-width: 600px)': { fontSize: '1.25rem' }, 
      }}
    >
      Course Advisor
    </Typography>
  </Box>

  
  <Box 
    flexGrow={1} 
    overflow="auto" 
    p={2} 
    bgcolor="#f3f4f6" 
    sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: '95px' , paddingBottom: '75px'}}
  >
    <Box display="flex" flexDirection="column">
      {messages.map((message) => (
        <Box
          key={message.id}
          display="flex"
          justifyContent={message.type === 'user' ? 'flex-end' : 'flex-start'}
          mb={2}
        >
          <Box
            p={2}
            pt={0}
            pb={0}
            borderRadius="12px"
            bgcolor={message.type === 'user' ? '#1976d2' : '#ffffff'} 
            color={message.type === 'user' ? 'white' : 'text.primary'}
            maxWidth="80%"
            maxHeight={'auto'}
            boxShadow={message.type === 'bot' ? 2 : 0}
            sx={{
              '@media (max-width: 600px)': {
                maxWidth: '95%' 
              }
            }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Box>
        </Box>
      ))}

      {isLoading && currentResponse && (
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Box
            p={2}
            borderRadius="12px"
            bgcolor="background.default"
            color="text.primary"
            maxWidth="80%"
            boxShadow={2}
            position="relative"
            sx={{
              '@media (max-width: 600px)': {
                maxWidth: '95%' 
              }
            }}
          >
            {currentResponse}
          </Box>
        </Box>
      )}

      {isLoading && !currentResponse && <Loader />}

      
      <div ref={messagesEndRef} />
    </Box>
  </Box>

  
  <Box p={2} bgcolor="#ffffff" borderTop={1} sx={{ borderColor: 'divider' , position: 'fixed', bottom: 0 , width: '100%'}}>
    <Box display="flex" sx={{ flexDirection: 'column', '@media (min-width: 600px)': { flexDirection: 'row' } }}>
      
      <TextField
        fullWidth
        variant="outlined"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        disabled={isLoading}
        sx={{
          borderRadius: '12px',
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#e3f2fd', 
            '& fieldset': {
              borderColor: '#1976d2', 
            },
            '&:hover fieldset': {
              borderColor: '#1565c0', 
            },
          },
          '& .MuiInputBase-input': {
            color: '#0d47a1', 
          },
          '@media (min-width: 600px)': {
            marginBottom: 0, 
            marginRight: 2,
          },
        }}
      />
      
      
      <Button
        onClick={handleSend}
        variant="contained"
        color="primary"
        disabled={!userInput.trim() || isLoading}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          boxShadow: 3,
          backgroundColor: '#1976d2', 
          '&:hover': {
            backgroundColor: '#1565c0', 
            boxShadow: 4,
          },
          '@media (max-width: 600px)': {
            width: '100%' 
          },
        }}
      >
        <SendIcon sx={{ fontSize: 20 }} />
      </Button>
    </Box>
  </Box>

  
  <Dialog
    open={openSessionExpiredModal}
    onClose={handleCloseSuccessModal}
    TransitionComponent={Fade}
    sx={{
      '& .MuiDialog-paper': {
        backgroundColor: '#e3f2fd', 
        borderRadius: '12px',
        padding: '20px',
        boxShadow: 3,
        '@media (max-width: 600px)': {
          padding: '15px', 
        }
      },
    }}
  >
    <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>Session Timeout</DialogTitle>
    <DialogContent>
      <Typography variant="body1" sx={{ color: 'text.secondary', marginBottom: 2 }}>
        Session Expired! Please log in again to continue using the service.
      </Typography>
      <Box display="flex" justifyContent="center" sx={{ width: '100%', marginTop: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleCloseSuccessModal}
          sx={{
            width: '200px',
            padding: '12px',
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
            '@media (max-width: 600px)': {
              width: '100%' 
            },
          }}
        >
          Go to Login
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
</Box>

  );
};

export default ChatInterface;
