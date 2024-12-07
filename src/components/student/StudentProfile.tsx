/**
 * ProfileDetails Component
 *
 * This component displays a student's profile details, including their profile picture,
 * name, email, department, and an option to upload a new profile picture or edit the profile.
 * Material-UI components are used for styling and layout.
 */

import React, { useState } from 'react';
import { 
  Avatar, 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  IconButton,
  Badge
} from '@mui/material';
import { PhotoCamera, Edit } from '@mui/icons-material';
import { User} from '../../models/UserModel';
import { useTranslation } from 'react-i18next';

interface ProfileDetailsProps {
  student: User;
  onUploadPicture: (file: File) => void;
  onEdit: () => void;
}

/**
 * ProfileDetails Functional Component
 *
 * @param {ProfileDetailsProps} props - Contains the student's data and actions.
 * @returns {JSX.Element} Rendered component for displaying and managing profile details.
 */

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ student, onUploadPicture, onEdit }) => {
  const { t } = useTranslation('common');
  const [isUploading, setIsUploading] = useState(false);

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setIsUploading(true);
      try {
        await onUploadPicture(file);
      } catch (error) {
        console.error('Error uploading picture:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                component="label"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                size="small"
                disabled={isUploading}
              >
                <PhotoCamera fontSize="small" />
                <input type="file" hidden accept="image/*" onChange={handlePictureUpload} />
              </IconButton>
            }
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: '4px solid white',
                boxShadow: 2
              }}
              src={student.profileImage || '/default-profile.jpg'}
              alt="Profile Picture"
            />
          </Badge>
          <Typography variant="h5" fontWeight="600" mt={2}>{student.firstName+" "+student.lastName}</Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>{student.email}</Typography>
          <Button 
            variant="outlined" 
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{ 
              mt: 1,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {t('student.editProfile')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;