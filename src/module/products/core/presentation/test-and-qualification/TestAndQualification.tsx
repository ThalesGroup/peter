import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  energyUsedAtTestLocationAdded,
  energyUsedAtTestLocationRemoved,
  energyUsedAtTestLocationUpdated,
  testsAndQualificationsToggled,
} from '../../domain/product.slice';
import NumberField from '../../../../../ui/components/NumberField';
import DeleteIconButton from '../../../../../ui/components/DeleteIconButton';
import AddFormItemButton from '../../../../../ui/components/AddFormItemButton';
import { selectCurrentProduct } from '../../domain/product.selector';
import { selectConfiguration } from '../../domain/configuration.selector';
import { DefaultLocationId } from '../../domain/entity/TestLocation';
import Section from '../../../../../ui/components/Section';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function TestAndQualification() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const product = useSelector(selectCurrentProduct);
  const configuration = useSelector(selectConfiguration);

  const canDeleteTestLocations = (): boolean => {
    return product.energyUsedAtTestLocations.testLocations.length > 1;
  };

  return (
    <Section
      title="Tests & qualification"
      canBeDisabled
      enabled={product.energyUsedAtTestLocations.enabled}
      onToggle={() => {
        dispatch(testsAndQualificationsToggled());
      }}
    >
      <Typography variant="body2">
        Energy consumed on site per product unit (e.g. satellite)
      </Typography>

      {product.energyUsedAtTestLocations.testLocations.map(
        (energyUsedAtTestLocation) => (
          <div
            className="mt-2 flex items-end"
            key={energyUsedAtTestLocation.id}
          >
            <FormControl>
              <FormLabel>Test location</FormLabel>
              <Select
                id="select_test_location"
                className="w-18xl"
                value={energyUsedAtTestLocation.testLocationId}
                onChange={(event) => {
                  dispatch(
                    energyUsedAtTestLocationUpdated({
                      id: energyUsedAtTestLocation.id,
                      testLocationId: event.target.value,
                      energy: energyUsedAtTestLocation.energy,
                    })
                  );
                }}
              >
                <MenuItem value={DefaultLocationId}>
                  No selected location
                </MenuItem>
                {configuration.items.testLocations.map((location) => (
                  <MenuItem value={location.id} key={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="ml-2">
              <NumberField
                id="energy"
                fieldValue={energyUsedAtTestLocation.energy}
                classes="w-18xl"
                label="Total energy at stake (kWh)"
                onChange={(value: number) => {
                  dispatch(
                    energyUsedAtTestLocationUpdated({
                      id: energyUsedAtTestLocation.id,
                      testLocationId: energyUsedAtTestLocation.testLocationId,
                      energy: value,
                    })
                  );
                }}
              />
            </div>
            {canDeleteTestLocations() && (
              <DeleteIconButton
                onClick={() => {
                  dispatch(
                    energyUsedAtTestLocationRemoved(energyUsedAtTestLocation.id)
                  );
                }}
              />
            )}
          </div>
        )
      )}

      <AddFormItemButton
        label="Test location"
        onClick={() => dispatch(energyUsedAtTestLocationAdded())}
      />
    </Section>
  );
}

export default TestAndQualification;
