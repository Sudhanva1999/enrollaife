import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { User } from '../../models/UserModel';
import CaptureProfilePage from './CaptureProfilePage'; // Capture Profile Picture Component
import { uploadProfileImage } from '../../services/student-service'; // Assuming this handles the image upload

// interface for update profile props
interface UpdateProfileFormProps {
  faculty: User;
  onSubmit: (updatedData: Partial<User>) => void;
  onCancel: () => void;
}

// the form the update profile data
const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ faculty, onSubmit, onCancel }) => {
  const [firstName, setFirstName] = useState(faculty.firstName);
  const [lastName, setLastName] = useState(faculty.lastName);
  const [profileImage, setProfileImage] = useState<string | undefined>(faculty.profileImage);

  const handleCaptureImage = (image: string) => {
    setProfileImage(image);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profileImage) {
      const file = await fetch(profileImage)
        .then(res => res.blob())
        .then(blob => new File([blob], 'profile_picture.png', { type: 'image/png' }));

      await uploadProfileImage(file);
    }

    onSubmit({ firstName, lastName, profileImage });
  };

  // the tsx return component
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        margin="normal"
      />

      <Box mt={2}>
        <Typography variant="h6">Profile Picture</Typography>
        <CaptureProfilePage onCaptureImage={handleCaptureImage} />
      </Box>

      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
          Save
        </Button>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default UpdateProfileForm;