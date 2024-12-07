import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Box, Stack, Paper, Avatar, Link, Alert, InputAdornment, IconButton, Dialog, DialogContent, DialogTitle, Fade } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { resetPwd } from '../../services/user-service';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

  const navigate = useNavigate();

  //Reset password form submission
  const handleSubmit = async ( event:FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);  ;

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);  

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }    
      
    
    try {
        // Call the reset password service
        await resetPwd({ email, password});
        setOpenSuccessModal(true);        
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }

    };  

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleMouseUpConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    navigate('/login'); // Redirect to login after closing modal
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
    padding: 0,
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

  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }, 
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
      padding: { xs: '20px', md: '0' },
    }}
  >
    
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: { xs: '20px', md: '40px' },
        maxWidth: '100%',
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
          Reset Password
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            
            
            <TextField
              required
              fullWidth
              id="email"
              label="Registered Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              type="email"
              error={!!error}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />

            
            <TextField
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              sx={{ borderRadius: 2 }}
            />

            
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              error={!!error}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        onMouseUp={handleMouseUpConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ borderRadius: 2 }}
            />

            
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
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Link
                href="/login"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Back to Login
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  </Box>

  
  <Dialog
    open={openSuccessModal}
    onClose={handleCloseSuccessModal}
    TransitionComponent={Fade}
    sx={{
      '& .MuiDialog-paper': {
        backgroundColor: '#f0f4f8',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      },
    }}
  >
    <DialogTitle sx={{ fontWeight: 'bold', color: '#4caf50' }}>Password Reset Successful</DialogTitle>
    <DialogContent>
      <Typography variant="body1" sx={{ color: '#555', marginBottom: 2 }}>
        Your password has been reset successfully! You can now log in.
      </Typography>
      <Box display="flex" justifyContent="center" sx={{ width: '100%', marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCloseSuccessModal}
          sx={{
            width: '200px',
            padding: '10px',
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#45a049',
            },
          }}
        >
          Go to Login
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
</Container>


  );
};

export default ResetPassword;
