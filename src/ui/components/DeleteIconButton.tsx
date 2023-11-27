import React from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  onClick: () => void;
  classes?: string;
} & typeof defaultProps;

const defaultProps = {
  classes: '',
};

function DeleteIconButton({ onClick, classes }: Props) {
  return (
    <Button
      variant="outlined"
      color="error"
      className={`ml-2 ${classes}`}
      onClick={() => {
        onClick();
      }}
    >
      <DeleteIcon className="text-dark-red-600" />
    </Button>
  );
}
DeleteIconButton.defaultProps = defaultProps;

export default DeleteIconButton;
