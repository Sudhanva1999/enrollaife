import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Button,
  Dialog, 
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import UserCard from '../components/admin/UsersCard';
import WeatherCard from '../components/common/WeatherCard';
import { getUserById, getAllUsers, updateUserProfile, deleteUserById } from '../services/admin-service';
import { getWeatherData } from '../services/weather-service';
import { User } from '../models/UserModel';
import { WeatherForecast } from '../models/WeatherModel';


const AdminProfilePage: React.FC = () => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'admin'>('students');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAdmin, setUpdatedAdmin] = useState<Partial<User>>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch admin details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const fetchedAdmin = await getUserById(); // Uses JWT cookie to identify the user
        setAdmin(fetchedAdmin);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdmin();
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        const filtered = fetchedUsers.filter((user) => user._id !== admin?._id); // Exclude logged-in admin
        setUsers(filtered);
        setFilteredUsers(filtered.filter((user) => user.role === 'Student'));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [admin]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = await getWeatherData();
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  // Handle tab changes
  const handleTabChange = (_: React.SyntheticEvent, newValue: 'students' | 'faculty' | 'admin') => {
    setActiveTab(newValue);
  };

  // Filter users based on active tab
  useEffect(() => {
    const filterByRole = () => {
      const filtered = users.filter((user) => {
        if (activeTab === 'students') return user.role === 'Student';
        if (activeTab === 'faculty') return user.role === 'Faculty';
        if (activeTab === 'admin') return user.role === 'Admin';
        return false;
      });
      setFilteredUsers(filtered);
    };

    filterByRole();
  }, [activeTab, users]);

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdatedAdmin(admin || {}); // Populate fields with current admin data
  };

  // Handle input change
  const handleInputChange = (field: keyof User, value: string) => {
    setUpdatedAdmin((prev) => ({ ...prev, [field]: value }));
  };

  // Handle update submit
  const handleUpdateSubmit = async () => {
    try {
      // Ensure required fields are set
      if (!updatedAdmin._id || !updatedAdmin.firstName || !updatedAdmin.lastName || !updatedAdmin.email) {
        throw new Error('All fields are required to update the profile.');
      }

      // Perform the update
      await updateUserProfile(updatedAdmin as User);

      // Fetch updated admin profile immediately
      const refreshedAdmin = await getUserById();
      setAdmin(refreshedAdmin); // Update local admin state
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating admin profile:', error);
    }
  };

  // Open the delete dialog
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  // Close the delete dialog
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  // Confirm the deletion
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserById(userToDelete._id);
        // Remove deleted user from the list
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  // Handle delete user
  // const handleDeleteUser = async (userId: string) => {
  //   try {
  //     await deleteUserById(userId); // Call the service to delete user
  //     const updatedUsers = users.filter((user) => user._id !== userId); // Remove deleted user from local state
  //     setUsers(updatedUsers);
  //     setFilteredUsers(updatedUsers.filter((user) => user.role === activeTab)); // Update filtered users
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };
  return (
    <Box p={4} py={13} bgcolor="#f0f4f8" minHeight="100vh">
      <Grid container spacing={4}>
        {/* Left Side: Admin Profile and Weather */}
        <Grid item xs={12} md={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {admin && (
                <Box
                  mb={6}
                  bgcolor="#fff"
                  p={3}
                  borderRadius={2}
                  boxShadow={1}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                >
                  <Typography variant="h5" color="primary">
                    Admin Profile
                  </Typography>
                  {isEditing ? (
                    <>
                      <TextField
                        label="First Name"
                        value={updatedAdmin.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Last Name"
                        value={updatedAdmin.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Email"
                        value={updatedAdmin.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={handleUpdateSubmit}>
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleEditToggle}
                          style={{ marginLeft: '10px' }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" color="textSecondary" mt={2}>
                        {admin.firstName} {admin.lastName}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" mt={1}>
                        {admin.email}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" mt={1}>
                        {admin.role}
                      </Typography>
                      <Button variant="contained" color="primary" onClick={handleEditToggle}>
                        Edit Profile
                      </Button>
                    </>
                  )}
                </Box>
              )}
              {weather && (
                <Box mt={2}>
                  <WeatherCard weather={weather} />
                </Box>
              )}
            </>
          )}
        </Grid>

        {/* Right Side: Users and Tabs */}
        <Grid item xs={12} md={8}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Students" value="students" />
            <Tab label="Faculty" value="faculty" />
            <Tab label="Admin" value="admin" />
          </Tabs>
          <Grid container spacing={4} mt={2}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user._id}>
                  <UserCard user={user} onDeleteClick={() => handleDeleteClick(user)} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="textSecondary" mt={4}>
                No users found for this role.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the user "{userToDelete?.firstName} {userToDelete?.lastName}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProfilePage;
