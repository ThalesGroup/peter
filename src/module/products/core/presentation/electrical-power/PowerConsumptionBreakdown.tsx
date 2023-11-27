import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { selectCurrentProduct } from '../../domain/product.selector';
import {
  powerLevelAdded,
  powerLevelRemoved,
  powerLevelUpdated,
} from '../../domain/product.slice';
import AddFormItemButton from '../../../../../ui/components/AddFormItemButton';
import NumberField from '../../../../../ui/components/NumberField';
import DeleteIconButton from '../../../../../ui/components/DeleteIconButton';
import Subtitle from '../../../../../ui/components/Subtitle';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function PowerConsumptionBreakdown() {
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch<AppDispatchWithDI>();

  const canDeletePowerLevelShare = () => {
    return (
      product.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels
        .length > 1
    );
  };

  return (
    <div className="mt-6">
      <Subtitle label="Power consumption breakdown overtime" />
      <div>
        {product.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.map(
          (powerLevel) => (
            <div key={powerLevel.id} className="mt-2 flex items-end">
              <NumberField
                id="power"
                fieldValue={powerLevel.power}
                label="Power (W)"
                classes="w-18xl"
                onChange={(value: number) => {
                  dispatch(
                    powerLevelUpdated({
                      id: powerLevel.id,
                      power: value,
                      share: powerLevel.share,
                    })
                  );
                }}
              />
              <NumberField
                id="share"
                classes="ml-2 w-18xl"
                fieldValue={powerLevel.share}
                label="Share (%)"
                onChange={(value: number) => {
                  dispatch(
                    powerLevelUpdated({
                      id: powerLevel.id,
                      power: powerLevel.power,
                      share: value,
                    })
                  );
                }}
              />
              {canDeletePowerLevelShare() && (
                <DeleteIconButton
                  onClick={() => {
                    dispatch(powerLevelRemoved(powerLevel.id));
                  }}
                />
              )}
            </div>
          )
        )}
        <div className="flex w-1/2 justify-between mt-2">
          <AddFormItemButton
            label="Power level"
            onClick={() => {
              dispatch(powerLevelAdded());
            }}
          />
          <div className="flex">
            <Typography variant="body2">
              Total share:{' '}
              {
                product.inUsePowerConsumption.powerConsumptionBreakdown
                  .shareTotal
              }
              {' - '}
              Mean power:{' '}
              {
                product.inUsePowerConsumption.powerConsumptionBreakdown
                  .meanPower
              }
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PowerConsumptionBreakdown;
