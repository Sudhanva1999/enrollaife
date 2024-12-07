/**
 * CompletedCourses Component
 *
 * This component is responsible for displaying a list of completed courses.
 * Each course is presented with details such as the course name, instructor,
 * and the term in which it was completed. The component uses Material-UI for styling.
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
  Divider,
  Chip
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { User } from '../../models/UserModel';
import { useTranslation } from 'react-i18next';

interface CompletedCoursesProps {
  courses: User["enrolledCourses"];
}

/**
 * CompletedCourses Functional Component
 *
 * @param {CompletedCoursesProps} props - Contains the list of completed courses.
 * @returns {JSX.Element} Rendered component displaying completed courses.
 */

const CompletedCourses: React.FC<CompletedCoursesProps> = ({ courses }: CompletedCoursesProps): JSX.Element => {
  const { t } = useTranslation('common');

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="600" mb={3}>
          {t('student.completedCourses')}
        </Typography>
        <List>
          {courses.map((course, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="500">
                      {course.courseOffer.course.name}
                    </Typography>
                  }
                  secondary={
                    <Box mt={1} display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Faculty: {course.courseOffer.faculty}
                      </Typography>
                      <Chip 
                        label={`${course.courseOffer.term.semester} ${course.courseOffer.term.year}`}
                        size="small"
                        variant="outlined"
                        color="success"
                      />
                    </Box>
                  }
                />
              </ListItem>
              {index < courses.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CompletedCourses;