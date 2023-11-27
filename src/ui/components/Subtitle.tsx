import React from 'react';
import { Typography } from '@mui/material';

interface Props {
  label: string;
}

function Subtitle({ label }: Props) {
  return (
    <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
      {label}
    </Typography>
  );
}

export default Subtitle;
