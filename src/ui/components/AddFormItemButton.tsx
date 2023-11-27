import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
}

function AddFormItemButton({ label, onClick }: Props) {
  return (
    <div className="mt-2 w-fit">
      <Button
        startIcon={<AddCircleOutlineIcon />}
        variant="outlined"
        className="z-0"
        color="primary"
        onClick={() => {
          onClick();
        }}
      >
        <span>Add {label}</span>
      </Button>
    </div>
  );
}

export default AddFormItemButton;
