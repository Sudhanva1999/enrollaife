import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ProfileDetails from '../components/student/StudentProfile';
import UpdateProfileForm from '../components/student/UpdateProfileForm';
import EnrolledCourses from '../components/student/EnrolledCourses';
import CompletedCourses from '../components/student/CompletedCourses';
import WeatherCard from '../components/common/WeatherCard';
import { getStudentData, uploadProfileImage } from '../services/student-service';
import { updateStudentData } from '../services/student-service';
import { getWeatherData } from '../services/weather-service';
import { User } from '../models/UserModel';
import { WeatherForecast } from '../models/WeatherModel';

/**
 * Main Student Profile Page
 *
 * @returns {JSX.Element} The rendered Student Profile Page
 */

const StudentProfilePage: React.FC = () => {
  const [student, setStudent] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Fetch student data and weather data when the component mounts or when studentId changes.
   */

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        
          const data = await getStudentData();
          setStudent(data);
        
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    const fetchWeatherData = async () => {
      try {
        const weatherData = await getWeatherData();
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchStudentData();
    fetchWeatherData();
  }, []);

  /**
   * Handle profile updates when the user submits the update form.
   *
   * @param {Partial<Student>} updatedData - Updated profile data
   */

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    try {
        await updateStudentData(updatedData);
        const updatedStudent = await getStudentData();
        setStudent(updatedStudent);
        setIsEditing(false);
    } catch (error) {
      console.error('Error updating student profile:', error);
    }
  };

  /**
   * Handle profile picture upload.
   *
   * @param {File} file - The uploaded picture file
   */
  
  const handleUploadPicture = async (file: File) => {
    try {
      await uploadProfileImage(file);
      const updatedStudent = await getStudentData();
      setStudent(updatedStudent);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  if (!student || !weather) {
    return <Typography>Loading...</Typography>;
  }

  // Filter courses based on enrollment status
  const completedCourses = student.enrolledCourses.filter(
    (course) => course.enrollmentStatus === 'Completed'
  );
  const enrolledCoursess = student.enrolledCourses.filter(
    (course) => course.enrollmentStatus !== 'Completed'
  );

  return (
    <Box p={4} py={10} bgcolor="#f0f4f8" minHeight="100vh">
      <Grid container spacing={4}>
        {/* Left Side: Profile Details and Weather */}
        <Grid item xs={12} md={4}>
          {isEditing ? (
            <UpdateProfileForm
              student={student}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : ( 
            <ProfileDetails
              student={student}
              onUploadPicture={handleUploadPicture}
              onEdit={() => setIsEditing(true)}
            />
           )}
          <Box mt={2}>
            <WeatherCard weather={weather} />
          </Box>
        </Grid>
        
        {/* Right Side: Enrolled Courses and Completed Courses */}
        <Grid item xs={12} md={8}>
          <EnrolledCourses courses={enrolledCoursess} />
          {completedCourses.length > 0 && (
            <Box mt={4}>
              <CompletedCourses courses={completedCourses} />
            </Box> 
           )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProfilePage;
