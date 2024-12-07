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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  InputAdornment,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { signup } from './../../services/user-service';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [firstName, setfirstName] = useState<string>('');
  const [lastName, setlastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to handle signup
  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {    
    event.preventDefault();
    setError(null);    

    if (!email || !password || !confirmPassword || !firstName || !lastName || !role) {
        setError('All fields are required.');
        return;
      }

    if(!(email==='')) { if(!emailRegex.test(email)) { setError("Email is invalid"); return; } }
    if(!emailRegex.test(email)) { setError("Email is invalid"); return; }
    if(firstName==='') { setError("First Name is required") ; return;}
    if(lastName==='') { setError("Last Name is required"); return;}
    if(password==='') { setError("Password is required") ; return;}
    if(confirmPassword==='') { setError("Confirm Password is required"); return; }
    if(role==='') {setError("Role is required"); return; }

    setIsLoading(true);
    // Basic validation for password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
        // Call the signup service
        await signup({ email, firstName,lastName, password, role });
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

    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleMouseUpConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    // Function to close the success modal and navigate to login page
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
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 1, width: '100%' }}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                required
                fullWidth
                id="email"
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
              />
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                type="name"
                error={!!error}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                type="name"
                error={!!error}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
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
                          aria-label={showPassword ? 'hide the password' : 'display the password'}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!error}
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
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
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                  error={!!error}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Faculty">Faculty</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
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
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Link
                  href="/login"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  Already have an account? Sign In
                </Link>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>

      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          padding: { xs: '20px', md: '40px' },
          color: 'white',
          textAlign: 'center',
          order: { xs: 1, md: 2 }, 
        }}
      >
        <Stack spacing={2} alignItems="center">
        <img
        src="/assets/logo-svg.svg"  
        style={{ width: '450px', height: '450px', marginLeft: '10px' }}  
      />
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'white' }}>
          Welcome to Our Application! <br />
          Please sign up to get started.
        </Typography>
          </Stack>
        
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
      <DialogTitle sx={{ fontWeight: 'bold', color: '#4caf50' }}>Signup Successful</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: '#555', marginBottom: 2 }}>
          Your account has been successfully created! You can now log in.
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

export default SignupPage;
