// /**
//  * UpdateProfileForm Component
//  *
//  * This component provides a form interface for editing and updating a student's profile.
//  * It allows the user to modify their name and email, and submit the changes.
//  * Material-UI components are used for styling and form handling.
//  */

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { User } from '../../models/UserModel';

interface UpdateProfileFormProps {
  student: User;
  onSubmit: (updatedData: Partial<User>) => void;
  onCancel: () => void;
}

// /**
//  * UpdateProfileForm Functional Component
//  *
//  * @param {UpdateProfileFormProps} props - Contains the student's data and actions.
//  * @returns {JSX.Element} Rendered form component for updating profile details.
//  */

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ student, onSubmit, onCancel }) => {
  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [email, setEmail] = useState(student.email);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ firstName, lastName, email });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      p={3}
      borderRadius={2}
      bgcolor="#f9f9f9"
      boxShadow={3}
      maxWidth="400px"
      mx="auto"
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Update Profile
      </Typography>
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
        type="email"
      />
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProfileForm;
