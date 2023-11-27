import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import {
  platformModelForPayloadSelected,
  platformModelPayloadOverridden,
  platformModelPayloadRemoved,
  platformModelPayloadSectorSelected,
  transportedEquipmentPayloadAdded,
} from '../../domain/product.slice';
import {
  selectCurrentProduct,
  selectTransportedPlatformModelSectors,
} from '../../domain/product.selector';
import {
  DefaultSectorId,
  DefaultTransportedPlatformModelId,
} from '../../domain/entity/PlatformModel';
import DeleteIconButton from '../../../../../ui/components/DeleteIconButton';
import AddFormItemButton from '../../../../../ui/components/AddFormItemButton';
import NumberField from '../../../../../ui/components/NumberField';
import Subtitle from '../../../../../ui/components/Subtitle';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function TransportedEquipmentMobility() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const sectors = useSelector(selectTransportedPlatformModelSectors);
  const product = useSelector(selectCurrentProduct);

  const canDeletePlatformModel = () => {
    return product.inUseMobility.transported.payloads.length > 1;
  };

  return (
    <div>
      <Subtitle label="Platform-onboarded transportation" />
      <div className="flex flex-col">
        {product.inUseMobility.transported.payloads.map((payload) => (
          <div className="mt-2 flex items-start h-7xl" key={payload.id}>
            <FormControl>
              <FormLabel>Sector</FormLabel>
              <Select
                id="select_sector"
                className="w-18xl"
                value={payload.sectorId}
                onChange={(event) => {
                  dispatch(
                    platformModelPayloadSectorSelected({
                      platformModelPayloadId: payload.id,
                      sectorId: event.target.value,
                    })
                  );
                }}
              >
                <MenuItem value={DefaultSectorId}>No sector selected</MenuItem>
                {sectors.map((sector) => (
                  <MenuItem value={sector} key={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="ml-2">
              <FormLabel>Platform model</FormLabel>
              <Select
                id="select_platform_model"
                className="w-18xl"
                value={payload.platformModelId}
                onChange={(event) => {
                  dispatch(
                    platformModelForPayloadSelected({
                      platformModelPayloadId: payload.id,
                      platformModelId: event.target.value,
                    })
                  );
                }}
              >
                <MenuItem value={DefaultSectorId}>
                  No sector platform model
                </MenuItem>
                {payload.filteredPlatformModels.map((platform) => (
                  <MenuItem value={platform.id} key={platform.id}>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
              {payload.platformModelId !==
                DefaultTransportedPlatformModelId && (
                // Use key attribute to force component to redraw on change TODO: need to test
                <FormLabel key={payload.platformModelId}>
                  {`Type: ${
                    payload.filteredPlatformModels.filter(
                      ({ id }) => id === payload.platformModelId
                    )[0].description
                  }`}
                </FormLabel>
              )}
            </FormControl>
            {payload.platformModelId !== DefaultTransportedPlatformModelId && (
              <NumberField
                id="payload"
                classes="w-18xl ml-2"
                fieldValue={payload.payload}
                label="Quantity of transportation units"
                onChange={(value: number) => {
                  dispatch(
                    platformModelPayloadOverridden({
                      platformModelPayloadId: payload.id,
                      payload: value,
                    })
                  );
                }}
                key={payload.platformModelId}
                caption={`Unit: ${
                  payload.filteredPlatformModels.filter(
                    ({ id }) => id === payload.platformModelId
                  )[0].defaultValue.description
                }`}
              />
            )}
            {canDeletePlatformModel() && (
              <div className="h-full flex items-center">
                <DeleteIconButton
                  classes="mt-2"
                  onClick={() => {
                    dispatch(platformModelPayloadRemoved(payload.id));
                  }}
                />
              </div>
            )}
          </div>
        ))}

        <AddFormItemButton
          label="Platform"
          onClick={() => {
            dispatch(transportedEquipmentPayloadAdded());
          }}
        />
      </div>
    </div>
  );
}

export default TransportedEquipmentMobility;
