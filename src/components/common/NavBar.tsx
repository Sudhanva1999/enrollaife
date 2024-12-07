import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from './../../services/user-service';
import { useTranslation } from 'react-i18next';
import { User } from './../../models/UserModel';
import { getUserById } from './../../services/admin-service';


interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  { label: 'Home', path: '/user/profile' },
  { label: 'Courses Registration', path: '/courses' },
  { label: 'Chatbot', path: '/chat' }
];

export default function NavBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);


// get user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById();
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      }
    };
    fetchUser();
  }, []);

  // displaying navbar contents based on user logged in
  const navItems = [
    { label: t('navbar.home'), path: '/user/profile' },
    {
      label: user?.role === 'Admin' || user?.role === 'Faculty' ? 'Course Catalog' : t('navbar.coursesRegistration'),
      path: '/courses'
    },
    ...(user?.role !== 'Admin' && user?.role !== 'Faculty' ? [{ label: t('navbar.chatbot'), path: '/chat' }] : [])
  ];
  
// handling navigation
  const handleNavigation = async (path: string) => {
    if(path == '/logout'){
      const res = await logout();
      if(res){
        navigate('/login');
      }
    }else{
      navigate(path);
    }    
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'white' }}>
        {t('navbar.title')}
      </Typography>
      <Divider sx={{ bgcolor: 'white' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavigation(item.path)}>
              <ListItemText primary={item.label} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Settings Icon in Drawer for Mobile */}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavigation('/logout')}>
            <ListItemText primary="Logout" sx={{ color: 'white' }} />
            <IconButton color="inherit">
              <Logout sx={{ color: 'white' }} />
            </IconButton>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', position: 'sticky', zIndex: 3 }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: 'linear-gradient(135deg, #FF4081, #9C27B0)', borderRadius: '0 0 20px 20px', boxShadow: 4 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: 1,
            }}
          >
            {t('navbar.title')}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#D500F9',
                  },
                  margin: '0 10px',
                }}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Settings Icon in NavBar for Desktop */}
          <IconButton
            color="inherit"
            aria-label="logout"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
            onClick={() => handleNavigation('/logout')}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, #FF4081, #9C27B0)',
              borderRadius: '20px',
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 0, pt: { xs: 7, sm: 0 } }}>
        <Toolbar />
      </Box>
    </Box>
  );
};