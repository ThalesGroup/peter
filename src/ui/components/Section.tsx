import React from 'react';
import { Switch } from '@mui/material';
import SectionTitle from './SectionTitle';

type SectionProps = {
  canBeDisabled: boolean;
  title: string;
  onToggle?: () => void;
  enabled: boolean;
  children: React.ReactNode;
} & typeof defaultProps;

const defaultProps = {
  onToggle: () => {
    // default behavior does nothing
  },
};

function Section({
  title,
  canBeDisabled,
  onToggle,
  enabled,
  children,
}: SectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <SectionTitle label={title} />
        {canBeDisabled && (
          <Switch
            id="EnableSection"
            checked={enabled}
            // displayIcon
            // iconoff="clear"
            // iconon="done"
            onChange={() => onToggle && onToggle()}
            // onValueChanged={() => onToggle && onToggle()}
          />
        )}
      </div>
      {enabled && <div className="p-6">{children}</div>}
    </div>
  );
}
Section.defaultProps = defaultProps;

export default Section;
