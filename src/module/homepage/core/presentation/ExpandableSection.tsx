import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface Props {
  title: string;
  children: React.ReactNode;
}

export function ExpandableSection({ title, children }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div key={`refresh-key-${expanded}`}>
      <List sx={{ width: '100%' }}>
        <ListItemButton
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <ListItemText
            primary={
              <Typography variant="subtitle1" fontWeight="bolder">
                {title}
              </Typography>
            }
          />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </List>
      <div className={expanded ? '' : 'hidden'}>{children}</div>
    </div>
  );
}
