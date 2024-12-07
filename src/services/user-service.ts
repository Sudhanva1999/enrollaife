import { SERVER_URL} from "./config";

interface LoginCredentials {
  email: string;
  password: string;
}

// Function to handle login
export const login = async (logincredentials: LoginCredentials) => {
  try {
    const response = await fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(logincredentials)
    });    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Login failed')
  }
}; 

// Function to handle logout
export const logout = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };  

  interface SignupCredentials {
    email: string;
    firstName:string;
    lastName: string;
    password: string;
    role: string;
  }
  
  // Function to handle signup
  export const signup = async (credentials: SignupCredentials): Promise<void> => {
    const response = await fetch(`${SERVER_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }
  };  

// Function to send message to chatbot
export const sendMessageToChatbot = async (userInput: string, userProfile: string, courses: string): Promise<Response> => {  
      const response = await fetch(`${SERVER_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({userInput, userProfile, courses}),
    });    
    return response;  
};

interface ResetCredentials {
  email: string;
  password: string;
}

// Function to reset password
export const resetPwd = async (resetcredentials: ResetCredentials) => { 
  const response = await fetch(`${SERVER_URL}/resetpassword`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(resetcredentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Reset failed');
  }
};
