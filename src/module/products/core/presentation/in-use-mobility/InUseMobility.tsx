import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { InUseMobilityType } from '../../domain/entity/InUseMobilityType';
import {
  selectCurrentProduct,
  selectInUseMobilityType,
} from '../../domain/product.selector';
import EmbeddedEquipmentMobility from './EmbeddedEquipmentMobility';
import {
  inUseMobilityToggled,
  inUseMobilityTypeUpdated,
  loadMobilityEquipmentConfiguration,
} from '../../domain/product.slice';
import TransportedEquipmentMobility from './TransportedEquipmentMobility';
import Section from '../../../../../ui/components/Section';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

export interface RadioButtonEntry {
  value: string;
  label: string;
}

const mobilityTypes: RadioButtonEntry[] = [
  {
    value: InUseMobilityType.EMBEDDED,
    label: 'Platform-embedded movement',
  },
  {
    value: InUseMobilityType.TRANSPORTED,
    label: 'Platform-onboarded transportation',
  },
];

function InUseMobility() {
  const selectedMobilityType = useSelector(selectInUseMobilityType);
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch<AppDispatchWithDI>();

  useEffect(() => {
    dispatch(loadMobilityEquipmentConfiguration());
  }, [dispatch]);

  const displaySectionContent = (mobilityType: InUseMobilityType) => {
    switch (mobilityType) {
      case InUseMobilityType.NONE:
        break;
      case InUseMobilityType.EMBEDDED:
        return (
          <div className="mt-6">
            <EmbeddedEquipmentMobility />
          </div>
        );
      case InUseMobilityType.TRANSPORTED:
        return (
          <div className="mt-6">
            <TransportedEquipmentMobility />
          </div>
        );
      default:
        break;
    }
    return <> </>;
  };

  return (
    <Section
      title="In-use mobility"
      canBeDisabled
      enabled={product.inUseMobility.enabled}
      onToggle={() => {
        dispatch(inUseMobilityToggled());
      }}
    >
      <FormControl>
        <FormLabel>Please define the mobility type of your product</FormLabel>
        <RadioGroup
          className="mt-2 w-fit"
          name="mobilityType"
          defaultValue={InUseMobilityType.NONE}
          value={selectedMobilityType}
          onChange={(event) => {
            dispatch(
              inUseMobilityTypeUpdated(
                InUseMobilityType[event.target.value as InUseMobilityType]
              )
            );
          }}
        >
          <div className="flex">
            {mobilityTypes.map((type, index) => (
              <FormControlLabel
                value={type.value}
                key={type.value}
                control={<Radio />}
                className={index > 0 ? 'ml-s' : ''}
                label={type.label}
              />
            ))}
          </div>
        </RadioGroup>
      </FormControl>

      {displaySectionContent(selectedMobilityType)}
    </Section>
  );
}

export default InUseMobility;
