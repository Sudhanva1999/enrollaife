import React, { useState, FormEvent } from 'react';
import { 
  Avatar, 
  Button, 
  TextField, 
  Paper, 
  Box, 
  Stack, 
  Container, 
  Typography, 
  Alert,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import {login} from './../../services/user-service';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AccountCircle } from '@mui/icons-material';

interface LoginResponse {
  role: 'Student' | 'Faculty' | 'Admin';
  userId: string
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Make login request
    try {
      if(email===''){throw new Error('Email is required')}
      if(password===''){throw new Error('Password is required')}
      const response = await login({email, password});

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.message === 'INVALID_CREDENTIALS') {
          throw new Error('Invalid email or password');
        }
        
        throw new Error(errorData.message || 'Login failed');
      }

      // Parse successful response
      const data = await response.json() as LoginResponse;      

       // Navigation based on role
      switch(data.role) {
        case 'Student':
        case 'Faculty':
        case 'Admin':        
          navigate(`/user/profile`);
          break;
        default:
          navigate('/');
      }
    } catch (err: unknown) {
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // Prevent mouse down event from submitting the form
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container
    component="main"
    maxWidth="xl"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'relative',
      overflowY: 'auto',
    }}
  >
    
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #ff7b7b, #6c5ce7)', 
        filter: 'blur(8px)', 
        zIndex: -1, 
      }}
    />

    <Box sx={{
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },  
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
    }}>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          padding: '20px',
          color: 'white',
          textAlign: 'center',
          order: { xs: 1, md: 2 }, 
        }}
      >       

        <Stack spacing={2} alignItems="center">
        <Stack direction ="row" spacing={0} alignItems="center">
        <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color="#ff006e" />
            <stop offset="100%" stop-color="#800060" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="48"
          fontFamily="Arial, sans-serif"
          fill="url(#gradient)"
          fontWeight={'bold'}
        >
          ENROLL-AI
        </text>
      </svg>
      <img
        src="/assets/logo-svg.svg"  
        style={{ width: '100px', height: '100px', marginLeft: '10px' }}  
      />
      </Stack>
      <Typography variant="h4" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
        Please sign in to continue using the application.
      </Typography>
    </Stack>
      </Box>

      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          padding: '20px',
          marginLeft: { xs: '0', md: '10%' },  
          width: '100%',
          order: { xs: 2, md: 1 },  
        }}
      >
        <Paper
          elevation={12}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '400px', 
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Sign In
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleLogin}
            sx={{ mt: 1, width: '100%' }}
          >
            <Stack spacing={2}>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
              <TextField
                required
                fullWidth
                id="input-with-icon-textfield"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                error={!!error}
                variant="outlined"
                sx={{ borderRadius: 2 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle fontSize="inherit" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                variant="outlined"
                sx={{ borderRadius: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%',
                }}
              >
                <Link
                  href="/resetpassword"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/resetpassword');
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  borderRadius: 2,
                  padding: '12px',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Link
                  href="/signup"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/signup');
                  }}
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  New user? Sign Up
                </Link>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  </Container>
  );
};

export default LoginPage;