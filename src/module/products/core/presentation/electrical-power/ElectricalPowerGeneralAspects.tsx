import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { selectCurrentProduct } from '../../domain/product.selector';
import { inUsePowerConsumptionUpdated } from '../../domain/product.slice';
import NumberField from '../../../../../ui/components/NumberField';
import { selectConfiguration } from '../../domain/configuration.selector';
import { DefaultPowerSourceId } from '../../domain/entity/PowerSource';
import Subtitle from '../../../../../ui/components/Subtitle';

function ElectricalPowerGeneralAspects() {
  const product = useSelector(selectCurrentProduct);
  const configuration = useSelector(selectConfiguration);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      product.inUsePowerConsumption.powerSource === DefaultPowerSourceId &&
      configuration.items.powerSources[0]
    ) {
      dispatch(
        inUsePowerConsumptionUpdated({
          lifetime: product.inUsePowerConsumption.lifetime,
          powerSource: configuration.items.powerSources[0].id,
        })
      );
    }
  }, [configuration.items.powerSources, dispatch, product]);

  return (
    <div>
      <Subtitle label="General aspects" />
      <div className="w-fit">
        <NumberField
          id="lifetime"
          fieldValue={product.inUsePowerConsumption.lifetime}
          label="In-use lifetime (in hours)"
          classes="w-18xl"
          onChange={(value: number) => {
            dispatch(
              inUsePowerConsumptionUpdated({
                lifetime: value,
                powerSource: product.inUsePowerConsumption.powerSource,
              })
            );
          }}
          caption="Default total is 20 years, i.e. 175200h"
        />
      </div>
      <div className="mt-6">
        <FormControl>
          {/* //TODO: Change color */}
          <FormLabel className="text-bluegrey-500">
            Please define the electrical power source
          </FormLabel>
          <RadioGroup
            className="mt-2 w-fit"
            name="powerSource"
            value={product.inUsePowerConsumption.powerSource}
            onChange={(event) => {
              dispatch(
                inUsePowerConsumptionUpdated({
                  lifetime: product.inUsePowerConsumption.lifetime,
                  powerSource: event.target.value,
                })
              );
            }}
          >
            {configuration.items.powerSources.map((powerSource) => (
              <>
                <FormControlLabel
                  value={powerSource.id}
                  key={powerSource.id}
                  control={<Radio />}
                  label={powerSource.name}
                />
                <div>
                  <Typography variant="caption" className="text-bluegrey-500">
                    {powerSource.description}
                  </Typography>
                </div>
              </>
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}

export default ElectricalPowerGeneralAspects;
