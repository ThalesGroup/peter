import { Typography } from '@mui/material';
import React from 'react';

interface Props {
  label: string;
}

function SectionTitle({ label }: Props) {
  return (
    <Typography variant="h4" fontWeight="bold" className="text-primary-500">
      {label}
    </Typography>
  );
}

export default SectionTitle;
