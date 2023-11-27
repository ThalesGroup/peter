import React from 'react';
import { FormControl, FormLabel, TextField, Typography } from '@mui/material';

type Props = {
  id: string;
  fieldValue: number;
  label: string;
  onChange: (newValue: number) => void;
  caption?: string;
  classes?: string;
} & typeof defaultProps;

const defaultProps = {
  classes: '',
  caption: '',
};

function NumberField({
  id,
  fieldValue,
  label,
  onChange,
  caption,
  classes,
}: Props) {
  const isNumber = (event: React.KeyboardEvent<HTMLDivElement>) => {
    return !/[0-9]/.test(event.key) && event.preventDefault();
  };

  const pasteOnlyNumbers = (value: string) => {
    return value.replace(/\D/g, '');
  };

  return (
    <FormControl>
      <FormLabel className={classes}>{label}</FormLabel>
      <TextField
        id={id}
        className={classes}
        inputProps={{ style: { textAlign: 'center' } }}
        defaultValue={fieldValue.toString()}
        // value={fieldValue.toString()}
        onClick={(event) => {
          if ((event.target as HTMLInputElement).value === '0') {
            // eslint-disable-next-line no-param-reassign
            (event.target as HTMLInputElement).value = '';
          }
        }}
        onPaste={(event) => {
          // eslint-disable-next-line no-param-reassign
          (event.target as HTMLInputElement).value = pasteOnlyNumbers(
            event.clipboardData.getData('text')
          );
          event.preventDefault();
        }}
        onBlur={(event) => {
          onChange(Number(event.target.value));
        }}
        onKeyPress={(event) => {
          if (isNumber(event)) {
            const { value } = event.target as HTMLInputElement;

            if (event.key === 'Enter') {
              onChange(Number(value));
            }
          }
        }}
      />
      {caption !== '' && (
        <Typography variant="caption" className={classes}>
          {caption}
        </Typography>
      )}
    </FormControl>
  );
}
NumberField.defaultProps = defaultProps;

export default NumberField;
