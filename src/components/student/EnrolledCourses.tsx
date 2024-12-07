/**
 * EnrolledCourses Component
 *
 * This component displays a list of currently enrolled courses for a student.
 * Each course includes details such as course name, instructor, and enrollment status.
 * The design utilizes Material-UI components for styling and layout.
 */

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { School } from '@mui/icons-material';
import { User } from '../../models/UserModel';
import { useTranslation } from 'react-i18next';

interface EnrolledCoursesProps {
  courses: User["enrolledCourses"];
}

/**
 * EnrolledCourses Functional Component
 *
 * @param {EnrolledCoursesProps} props - Contains the list of enrolled courses.
 * @returns {JSX.Element} Rendered component for displaying enrolled courses.
 */

const EnrolledCourses: React.FC<EnrolledCoursesProps> = ({ courses }: EnrolledCoursesProps): JSX.Element => {
  const { t } = useTranslation('common');

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="600" mb={3}>
          {t('student.enrolledCourses')}
        </Typography>
        <List>
          {courses.map((course, index) => (
            <ListItem 
              key={index}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon>
                <School color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="500">
                    {course.courseOffer.course.name}
                  </Typography>
                }
                secondary={
                  <Box mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Faculty: {course.courseOffer.faculty}
                    </Typography>
                    <Chip 
                      label={course.enrollmentStatus}
                      size="small"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EnrolledCourses;