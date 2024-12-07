import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Avatar, Divider, Paper, Container, Dialog, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getFacultyData, updateFacultyData, editCourse } from '../services/faculty-service';
import { getWeatherData } from '../services/weather-service';
import { User } from '../models/UserModel';
import { CourseOffer } from '../models/CourseModel';
import { WeatherForecast } from '../models/WeatherModel';
import WeatherCard from '../components/common/WeatherCard';
import UpdateProfileForm from '../components/faculty/UpdateProfileForm';
import EditCourseForm from '../components/faculty/EditCourseForm';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';

// styling the components
const ProfileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
}));

const CourseCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// the main page functionality that will display the faculty profile page
const FacultyProfilePage: React.FC = () => {
  const [faculty, setFaculty] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetching and setting user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [facultyData, weatherData] = await Promise.all([
          getFacultyData(),
          getWeatherData()
        ]);
        setFaculty(facultyData);
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // function to handle profile data update
  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    try {
      await updateFacultyData(updatedData);
      const updatedFaculty = await getFacultyData();
      setFaculty(updatedFaculty);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating faculty profile:', error);
    }
  };

  // fucntion to handle editing of course state
  const handleEditCourse = (course: CourseOffer) => {
    setEditingCourse(course);
  };

  // functionality for updating course details
  const handleCourseUpdate = async (updatedCourse: CourseOffer) => {
    try {
      await editCourse(updatedCourse.courseOfferId, updatedCourse);
      const updatedFaculty = await getFacultyData();
      setFaculty(updatedFaculty);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!faculty || !weather) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">No data available</Typography>
      </Box>
    );
  }

  // the tsx return component
  return (
    <Container maxWidth="lg">
      <Box py={10}>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-16px' }}>
          <div style={{ flex: '1 1 300px', padding: '16px', minWidth: '300px' }}>
            <ProfileCard>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      border: '4px solid white',
                      boxShadow: 2
                    }}  
                    src={faculty.profileImage || '/default-profile.jpg'}
                    alt="Profile Picture"
                  />
                  <Typography variant="h5" gutterBottom>
                    {faculty.firstName} {faculty.lastName}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                {isEditing ? (
                  <UpdateProfileForm
                    faculty={faculty}
                    onSubmit={handleUpdateProfile}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </ProfileCard>
            <WeatherCard weather={weather} />
          </div>
          
          <div style={{ flex: '2 1 600px', padding: '16px', minWidth: '300px' }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} /> Courses Taught
              </Typography>
              {faculty.coursesTaught.map((course: CourseOffer) => (
                <CourseCard key={course.courseOfferId}>
                  <CardContent>
                    <Typography variant="h6">{course.course.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Course Code: {course.course.courseCode}
                    </Typography>
                    <Typography variant="body2">
                      Term: {course.term.semester} {course.term.year}
                    </Typography>
                    {course.course.prerequisites.length > 0 && (
                      <Typography variant="body2">
                        Prerequisites: {course.course.prerequisites.join(', ')}
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditCourse(course)}
                      sx={{ mt: 1 }}
                    >
                      Edit Course
                    </Button>
                  </CardContent>
                </CourseCard>
              ))}
            </Paper>
          </div>
        </div>
      </Box>

      <Dialog open={!!editingCourse} onClose={() => setEditingCourse(null)}>
        {editingCourse && (
          <EditCourseForm
            course={editingCourse}
            onSubmit={handleCourseUpdate}
            onCancel={() => setEditingCourse(null)}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default FacultyProfilePage;