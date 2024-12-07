import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  Paper,
  styled,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { CourseOffer } from '../models/CourseModel';
import { NextUIProvider } from '@nextui-org/react';
import { getAvailableCourses } from '../services/course-service';
import CourseCard from '../components/courseRegistration/CourseCard';
import { getUserById } from '../services/admin-service';
import { User } from '../models/UserModel';
import { addNewCourse } from '../services/course-service';
import { SelectChangeEvent } from '@mui/material';



const StyledContainer = styled(Container)({
  background: 'linear-gradient(135deg, #fff6f8 0%, #f8f0ff 100%)',
  minHeight: '100vh',
  paddingTop: '2rem',
  paddingBottom: '2rem'
});

const SearchContainer = styled(Paper)({
  backgroundColor: 'white',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(255, 105, 180, 0.1)',
  padding: '2rem',
  marginBottom: '2rem'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '&:hover fieldset': {
      borderColor: '#ff69b4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9370db',
    }
  }
});

// Wrapper for the title and button
const TitleContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // Aligns title to the left and button to the right
  marginBottom: '1rem',
});

const PageTitle = styled(Typography)({
  background: 'linear-gradient(45deg, #FF69B4, #9370DB)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  fontSize: '2.5rem'
});

const AddCourseButton = styled(Button)({
  background: 'linear-gradient(45deg, #FF69B4, #9370DB)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold', // Ensure consistent font weight
  transition: 'all 0.3s ease', // Smooth hover transition
  '&:hover': {
    WebkitTextFillColor: '#FF69B4', // Ensure hover text color works
    background: 'rgba(255, 105, 180, 0.1)', // Set hover background
    borderRadius: '5px', // Optional for better hover aesthetics
  },
});

const CourseRegistrationPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseOffer[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null); // Error for dialog form
  const [submissionError, setSubmissionError] = useState<string | null>(null); // Error for dialog form submission

  // State for dialog form
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    courseOfferId: '',
    course: {
      name: '',
      courseCode: '',
      prerequisites: [] as string[],
      courseDescription: '',
    },
    term: {
      year: 2024,
      semester: 'SPRING' as 'SPRING' | 'SUMMER' | 'FALL',
    },
    faculty: '',
    maxSeats: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedUser = await getUserById();
        const availableCourses = await getAvailableCourses();
        setUser(fetchedUser);
        setCourses(availableCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change for the course form
  const handleCourseInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
  ) => {
    const { name, value } = event.target;

    if (name.includes('course.')) {
      const courseField = name.split('.')[1]; // Get the nested field name like "name" or "courseCode"
      setNewCourseData((prevData) => ({
        ...prevData,
        course: { ...prevData.course, [courseField]: value },
      }));
    } else if (name === 'semester') {
      setNewCourseData((prevData) => ({
        ...prevData,
        term: { ...prevData.term, semester: value as 'SPRING' | 'SUMMER' | 'FALL' }, // Type assertion for semester
      }));
    } else if (name === 'year') {
      const year = Number(value);
      setNewCourseData((prevData) => ({
        ...prevData,
        term: { ...prevData.term, year },
      }));
    } else if (name === 'faculty' || name === 'maxSeats') {
      setNewCourseData((prevData) => ({
        ...prevData,
        [name]: name === 'maxSeats' ? Number(value) : value, // Ensure maxSeats is a number
      }));
    } else {
      setNewCourseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle prerequisites input
  const handlePrerequisitesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCourseData((prevData) => ({
      ...prevData,
      course: { ...prevData.course, prerequisites: event.target.value.split(',') },
    }));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = Number(event.target.value); // Convert to number
    setNewCourseData((prevData) => ({
      ...prevData,
      term: { ...prevData.term, year }, // update 'year' as a number
    }));
  };

  // Open the dialog form
  const handleAddCourse = () => {
    setDialogOpen(true);
  };

  // Close the dialog form
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setValidationError(null); // Reset validation error when closing dialog
    setSubmissionError(null); // Reset submission error when closing dialog
  };

  // Submit the new course data
  const handleSubmitCourse = async () => {
    const { maxSeats, faculty, courseOfferId, course, term } = newCourseData;
    if (!maxSeats || !faculty || !courseOfferId || !course || !term) {
      setValidationError('All required fields.');
      return;
    }

    // Clear any previous validation error
    setValidationError(null);

    try {
      await addNewCourse(newCourseData); // Call the API
      setDialogOpen(false); // Close the dialog on success
      setNewCourseData({
        courseOfferId: '',
        course: {
          name: '',
          courseCode: '',
          prerequisites: [] as string[],
          courseDescription: '',
        },
        term: {
          year: 2024,
          semester: 'SPRING',
        },
        faculty: '',
        maxSeats: 0,
      }); // Reset form
    } catch (error) {
      console.error('Error adding new course:', error);
      setError('Failed to add new course. Please try again.');
    }
  };




  return (
    <NextUIProvider>
      <StyledContainer maxWidth="xl">
        <SearchContainer elevation={0}>
          <TitleContainer>
            {user?.role === 'Admin' ? (
              <PageTitle variant="h4">
                Course Catalog
              </PageTitle>
            ) : user?.role === 'Student' && (
              <PageTitle variant="h4">
                Course Registration
              </PageTitle>
            )}
            {user?.role === 'Admin' && (
              <AddCourseButton
                onClick={handleAddCourse} // Trigger the dialog
              >
                Add Course
              </AddCourseButton>
            )}
          </TitleContainer>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <StyledTextField
            fullWidth
            placeholder="Search courses"
            variant="outlined"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item key={course.courseOfferId} xs={12} sm={6} md={4}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </StyledContainer>
      {/* Dialog to add new course */}
      <Dialog maxWidth="sm"  // Change this to sm, md, lg based on your preference
        fullWidth={false} // Optionally set this to true if you want the dialog to use all available width
        open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent
          sx={{
            // Maximum height of the dialog content
            overflowY: 'auto',  // Enable vertical scrolling
            // Custom scrollbar styles
            '&::-webkit-scrollbar': {
              width: '8px', // Width of the scrollbar
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1', // Background of the scrollbar track
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888', // Color of the scrollbar thumb
              borderRadius: '10px', // Optional: rounded thumb
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555', // Color when hovering over the thumb
            },
          }}
        >
          {/* Displaying validation error message inside the dialog */}
          {validationError && (
            <Typography color="error" sx={{ marginBottom: '1rem' }}>
              {validationError}
            </Typography>
          )}
          {submissionError && (
            <Typography color="error" sx={{ marginBottom: '1rem' }}>
              {submissionError}
            </Typography>
          )}
          {/* Form Fields */}
          <TextField
            label="Course Offer ID"
            variant="outlined"
            fullWidth
            name="courseOfferId"
            value={newCourseData.courseOfferId}
            onChange={handleCourseInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            name="course.name"
            value={newCourseData.course.name}
            onChange={handleCourseInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Course Code"
            variant="outlined"
            fullWidth
            name="course.courseCode"
            value={newCourseData.course.courseCode}
            onChange={handleCourseInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Prerequisites (comma separated)"
            variant="outlined"
            fullWidth
            name="prerequisites"
            value={newCourseData.course.prerequisites.join(',')}
            onChange={handlePrerequisitesChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Course Description"
            variant="outlined"
            fullWidth
            name="course.courseDescription"
            value={newCourseData.course.courseDescription}
            onChange={handleCourseInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Term Year"
            variant="outlined"
            fullWidth
            name="year"
            value={newCourseData.term.year}
            onChange={handleYearChange} // Update the event handler to use handleYearChange
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Semester</InputLabel>
            <Select
              label="Semester"
              name="semester"
              value={newCourseData.term.semester}
              onChange={handleCourseInputChange}
            >
              <MenuItem value="FALL">FALL</MenuItem>
              <MenuItem value="SPRING">SPRING</MenuItem>
              <MenuItem value="SUMMER">SUMMER</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Faculty"
            variant="outlined"
            fullWidth
            name="faculty"
            value={newCourseData.faculty}
            onChange={handleCourseInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Max Seats"
            variant="outlined"
            fullWidth
            name="maxSeats"
            type="number"
            value={newCourseData.maxSeats}
            onChange={handleCourseInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitCourse} color="primary">
            Add Course
          </Button>
        </DialogActions>
      </Dialog>
    </NextUIProvider>
  );
  // return (
  //   <NextUIProvider>
  //     <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pt: 6 }}>
  //       <Typography
  //         variant="h4"
  //         gutterBottom
  //         style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
  //       >
  //         <span>Course Registration</span>
  //         {user?.role === 'Admin' && (
  //           <Button
  //             size="small"
  //             variant="contained"
  //             color="primary"
  //             onClick={handleAddCourse} // Trigger the dialog
  //           >
  //             Add Course
  //           </Button>
  //         )}
  //       </Typography>

  //       {error && (
  //         <Typography color="error" sx={{ mb: 2 }}>
  //           {error}
  //         </Typography>
  //       )}

  //       <TextField
  //         fullWidth
  //         label="Search courses"
  //         variant="outlined"
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //         sx={{ mb: 4 }}
  //       />

  //       <Grid container spacing={4}>
  //         {filteredCourses.map((course) => (
  //           <Grid item key={course.courseOfferId} xs={12} sm={6} md={4}>
  //             <CourseCard course={course} />
  //           </Grid>
  //         ))}
  //       </Grid>

  //       {filteredCourses.length === 0 && (
  //         <Box mt={4}>
  //           <Typography variant="h6" align="center">
  //             No courses found matching your search.
  //           </Typography>
  //         </Box>
  //       )}
  //     </Container>

  //     {/* Dialog to add new course */}
  //     <Dialog open={dialogOpen} onClose={handleCloseDialog}>
  //       <DialogTitle>Add New Course</DialogTitle>
  //       <DialogContent>
  //         <TextField
  //           label="Course Offer ID"
  //           variant="outlined"
  //           fullWidth
  //           name="courseOfferId"
  //           value={newCourseData.courseOfferId}
  //           onChange={handleCourseInputChange}
  //           sx={{ mb: 2 }}
  //         />

  //         <TextField
  //           label="Course Name"
  //           variant="outlined"
  //           fullWidth
  //           name="course.name"
  //           value={newCourseData.course.name}
  //           onChange={handleCourseInputChange}
  //           sx={{ mb: 2 }}
  //         />
  //         <TextField
  //           label="Course Code"
  //           variant="outlined"
  //           fullWidth
  //           name="course.courseCode"
  //           value={newCourseData.course.courseCode}
  //           onChange={handleCourseInputChange}
  //           sx={{ mb: 2 }}
  //         />
  //         <TextField
  //           label="Prerequisites (comma separated)"
  //           variant="outlined"
  //           fullWidth
  //           name="prerequisites"
  //           value={newCourseData.course.prerequisites.join(',')}
  //           onChange={handlePrerequisitesChange}
  //           sx={{ mb: 2 }}
  //         />
  //         <TextField
  //           label="Course Description"
  //           variant="outlined"
  //           fullWidth
  //           name="course.courseDescription"
  //           value={newCourseData.course.courseDescription}
  //           onChange={handleCourseInputChange}
  //           sx={{ mb: 2 }}
  //         />
  //         <TextField
  //           label="Term Year"
  //           variant="outlined"
  //           fullWidth
  //           name="year"
  //           value={newCourseData.term.year}
  //           onChange={handleYearChange} // Update the event handler to use handleYearChange
  //           sx={{ mb: 2 }}
  //         />

  //         <FormControl fullWidth sx={{ mb: 2 }}>
  //           <InputLabel>Semester</InputLabel>
  //           <Select
  //             label="Semester"
  //             name="semester"
  //             value={newCourseData.term.semester}
  //             onChange={handleCourseInputChange}
  //           >
  //             <MenuItem value="FALL">FALL</MenuItem>
  //             <MenuItem value="SPRING">SPRING</MenuItem>
  //             <MenuItem value="SUMMER">SUMMER</MenuItem>
  //           </Select>
  //         </FormControl>
  //         <TextField
  //           label="Faculty"
  //           variant="outlined"
  //           fullWidth
  //           name="faculty"
  //           value={newCourseData.faculty}
  //           onChange={handleCourseInputChange}
  //           sx={{ mb: 2 }}
  //         />
  //         <TextField
  //           label="Max Seats"
  //           variant="outlined"
  //           fullWidth
  //           name="maxSeats"
  //           type="number"
  //           value={newCourseData.maxSeats}
  //           onChange={handleCourseInputChange}
  //           sx={{ mb: 2 }}
  //         />
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleCloseDialog} color="secondary">
  //           Cancel
  //         </Button>
  //         <Button onClick={handleSubmitCourse} color="primary">
  //           Add Course
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   </NextUIProvider>
  // );
};

export default CourseRegistrationPage;
