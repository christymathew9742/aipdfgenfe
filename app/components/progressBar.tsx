import React from 'react';
import { Grid, CircularProgress, LinearProgress, Typography } from '@mui/material';

const ProgressComponent = (props:any) => {
  const { value } = props;
  return (
    <Grid container spacing={2} >
        <Grid size={10}>
            <CircularProgress 
                variant="determinate" 
                value={value} 
                size={20} 
                thickness={6} 
                sx={{ 
                    color:'rgb(147, 51, 234)',
                }} 
            />
        </Grid>
        <Grid size={2}>
            <Typography 
                variant="body2"
                sx={{ 
                    color:'rgb(147, 51, 234)',
                    fontWeight:'bold',  
                    paddingLeft:'14px',                             
                }}
            >
                {value}%
            </Typography>
        </Grid>
        <Grid size={12}>
            <LinearProgress
                variant="determinate"
                sx={{
                    height: 8,
                    marginTop: -1,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(147, 51, 234, 0.2)',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgb(147, 51, 234)',
                    },
                }}
                value={value}
            />
        </Grid>
    </Grid>
  );
};

export default ProgressComponent;
