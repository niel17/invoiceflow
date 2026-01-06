import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40,
  fullScreen = true 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : '400px'}
      gap={2}
      role="status"
      aria-label="Loading"
    >
      <CircularProgress 
        size={size} 
        thickness={4}
        sx={{
          color: '#000000',
        }}
        aria-hidden="false" 
      />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: '0.875rem' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;

