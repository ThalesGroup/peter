import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { selectCurrentProduct } from '../../domain/product.selector';
import {
  recyclingToggled,
  recyclingTypeUpdated,
} from '../../domain/product.slice';
import { RecyclingType } from '../../domain/entity/RecyclingType';
import Section from '../../../../../ui/components/Section';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

interface RecyclingRadioButtonEntry {
  value: string;
  label: string;
  description: string;
}

const recyclingTypes: RecyclingRadioButtonEntry[] = [
  {
    value: RecyclingType.TYPE_1,
    label: 'Average electronic equipment',
    description: 'Recycling treatment type 1',
  },
  {
    value: RecyclingType.TYPE_2,
    label: 'Average electronic equipment containing a cooling system',
    description: 'Recycling treatment type 2',
  },
];

function Recycling() {
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch<AppDispatchWithDI>();

  return (
    <Section
      title="Recycling"
      canBeDisabled
      onToggle={() => dispatch(recyclingToggled())}
      enabled={product.recycling.enabled}
    >
      <FormControl>
        <FormLabel>Please define the recycling type of your product</FormLabel>
        <RadioGroup
          className="mt-2 w-fit"
          value={product.recycling.type}
          name="recyclingType"
          onChange={(event) => {
            dispatch(
              recyclingTypeUpdated(
                RecyclingType[event.target.value as RecyclingType]
              )
            );
          }}
        >
          <div className="flex">
            {recyclingTypes.map((recyclingType, index) => (
              <FormControlLabel
                value={recyclingType.value}
                key={recyclingType.value}
                control={<Radio />}
                label={recyclingType.label}
                className={index > 0 ? 'ml-s' : ''}
              />
            ))}
          </div>
        </RadioGroup>
        <Box>
          {recyclingTypes.map((recyclingType) => (
            <Typography
              mr="10rem"
              ml="4rem"
              variant="caption"
              className="text-bluegrey-500"
            >
              {recyclingType.description}
            </Typography>
          ))}
        </Box>
      </FormControl>
    </Section>
  );
}

export default Recycling;
