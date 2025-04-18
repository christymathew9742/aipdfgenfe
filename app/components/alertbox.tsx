// AlertDialog.tsx
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Typography } from '@mui/material';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onClose, onAgree }) => {
  const handleAgree = () => {
    onAgree();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: '500px',
          p: 3, 
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center" spacing={1}>
          <ErrorOutlineIcon color="error" />
          <Typography variant="h6" component="span">
            Upload New PDF?
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px',color:'black' }}>
          This will end your current chat session. Are you sure you want to upload a new PDF?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ borderRadius: '4px',padding:'10px', }}>
          Cancel
        </Button>
        <Button
          onClick={handleAgree}
          sx={{
            borderRadius: '4px',
            backgroundColor: '#9333ea',
            color: 'white',
            padding:'10px',
            '&:hover': {
              backgroundColor: '#6a1b9a',
            },
          }}
        >
          Upload New PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
