import React, { useState } from 'react';
import { TextField, Button, Stack, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { CourseOffer } from '../../models/CourseModel';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// the props of course details which will be updated
interface EditCourseFormProps {
  course: CourseOffer;
  onSubmit: (updatedCourse: CourseOffer) => void;
  onCancel: () => void;
}

// the form for updating the course details
const EditCourseForm: React.FC<EditCourseFormProps> = ({ course, onSubmit, onCancel }) => {
  const [editedCourse, setEditedCourse] = useState<CourseOffer>({ ...course });

//   the function to handle the data update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({
      ...prev,
      [name]: name === 'maxSeats' || name === 'currentSeats' ? parseInt(value, 10) : value,
    }));
  };

// similarly handling the term updation
  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({
      ...prev,
      term: {
        ...prev.term,
        [name]: name === 'year' ? parseInt(value, 10) : value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedCourse);
  };

//   the jsx component for the form related
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Edit Course: {course.course.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Faculty"
            name="faculty"
            value={editedCourse.faculty}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Maximum Seats"
            name="maxSeats"
            type="number"
            value={editedCourse.maxSeats}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Course Name"
            name="name"
            value={editedCourse.course.name}
            disabled
            onChange={(e) => setEditedCourse(prev => ({ ...prev, course: { ...prev.course, name: e.target.value } }))}
          />
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={editedCourse.term.year}
            onChange={handleTermChange}
          />
          <TextField
            fullWidth
            select
            label="Semester"
            name="semester"
            value={editedCourse.term.semester}
            onChange={handleTermChange}
          >
            {['SPRING', 'SUMMER', 'FALL'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
          Save Changes
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditCourseForm;