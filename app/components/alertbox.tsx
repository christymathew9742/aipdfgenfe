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
import {constantsText} from '@/app/constant/constant';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const {
  BOT:{
    UPLOAD_HD,
    UPLOAD_MSG,
    BUTTON_TEXT,
    NEW_UPLOAD,
  },
} = constantsText;

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
            {UPLOAD_HD}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px',color:'black' }}>
          {UPLOAD_MSG}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ borderRadius: '4px',padding:'10px', }}>
          {BUTTON_TEXT}
        </Button>
        <Button
          onClick={handleAgree}
          sx={{
            borderRadius: '4px',
            backgroundColor: '#b400aa',
            color: 'white',
            padding:'10px',
            '&:hover': {
              backgroundColor: '#c960c4',
            },
          }}
        >
          {NEW_UPLOAD}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
