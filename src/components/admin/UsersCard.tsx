import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography,
  Button
} from '@mui/material';
import { User } from '../../models/AdminModel'; // Import the User type

interface UserCardProps {
  user: User;
  onDeleteClick: () => void; // New prop for delete functionality
}

const UserCard: React.FC<UserCardProps> = ({ user, onDeleteClick }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {`${user.firstName} ${user.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role: {user.role}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 'auto', mt: 2 }}
          onClick={onDeleteClick} // Trigger delete when clicked
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
