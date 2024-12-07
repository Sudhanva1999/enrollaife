import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

export const Loader = () => {
    const [dotCount, setDotCount] = useState(1);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
      }, 500); // Change the dot count every 500ms
  
      return () => clearInterval(interval); // Clear interval on unmount
    }, []);
  
    const dots = '.'.repeat(dotCount); // Generate the dots based on state
  
    return (
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Box
          p={2}
          borderRadius="8px"
          bgcolor="background.paper"
          color="text.primary"
          maxWidth="80%"
          boxShadow={1}
          position="relative"
        >
          <Typography variant="body1" fontWeight="bold">
            {dots}
          </Typography>
        </Box>
      </Box>
    );
  };