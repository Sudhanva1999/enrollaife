import React, { useEffect, useState } from 'react';
import FacultyProfilePage from './FacultyProfilePage';
import StudentProfilePage from './StudentProfilePage';
import AdminProfilePage from './AdminProfilePage';
import { getStudentData } from '../services/student-service';
import { useNavigate } from 'react-router-dom';
import {Dialog, DialogContent, DialogTitle, Button, Fade, Container, Box, Typography} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUserProfile, setCourses } from '../redux-store/reducer'; // Import action to set user profile
import { User } from '../redux-store/types';
import { getAvailableCourses } from '../services/course-service';
import { CourseOffer } from '../models/CourseModel';
 
/**
 * Main User Profile Page
 *
 * @returns {JSX.Element} The rendered User Profile Page
 */
const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSessionExpiredModal, setOpenSessionExpiredModal] = useState<boolean>(false);
  const [userData, setData] = useState<User | null>(null);
  const [coursesData, setCoursesData] = useState<CourseOffer[] | null>(null);

  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await getStudentData();
        const userReduxData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          enrolledCourses: data.enrolledCourses,
          coursesTaught: data.coursesTaught
        } as User;
        setData(userReduxData);
        setUserRole(data.role);        
      } catch (error) {
        setOpenSessionExpiredModal(true);        
        console.error('Error fetching student data:', error);
        setError('Failed to fetch user data');
      }
    }; 
    
    const fetchAvailableCourses = async () => {
      try {
        const data = await getAvailableCourses();
        if(data!==null){
          setCoursesData(data); 
        }            
      } catch (error) {
        setOpenSessionExpiredModal(true);        
        console.error('Error fetching courses data', error);
        setError('Failed to fetch courses data');
      }
    };
    fetchStudentData();
    fetchAvailableCourses();
  }, []);

  // Only dispatch when userData is not null and hasn't been dispatched yet
  useEffect(() => {    
    if (userData !== null) {
      dispatch(setUserProfile(userData));      
    }
    if(coursesData!==null){
      dispatch(setCourses(coursesData));
    }
  }, [userData]); 

  
  const handleCloseSuccessModal = () => {
    setOpenSessionExpiredModal(false);
    navigate('/login'); // Redirect to login after closing modal
  };
 
  if (error || userRole === null) {
    return (
      <Container>
        <Dialog
        open={openSessionExpiredModal}
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
        <DialogTitle sx={{ fontWeight: 'bold', color: '#f44336' }}>Session Timeout</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'error.main', marginBottom: 2 }}>
            Session Expired! Please log in. ({error})
          </Typography>
          <Box 
            display="flex" 
            justifyContent="center" 
            sx={{ width: '100%', marginTop: 2 }}
          >
            <Button 
              variant="contained" 
              color="warning" 
              onClick={handleCloseSuccessModal} 
              sx={{
                width: '200px',
                padding: '10px',
                backgroundColor: '#f44336',
                '&:hover': {
                  backgroundColor: '#45a049'
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
  }

  
 
  switch (userRole) {
    case 'Faculty':
      return <FacultyProfilePage />;
    case 'Student':
      return <StudentProfilePage />;      
    case 'Admin':
      return <AdminProfilePage />;
    default:
      return <h1>Unknown User!</h1>;
  }
};
 
export default UserProfilePage;