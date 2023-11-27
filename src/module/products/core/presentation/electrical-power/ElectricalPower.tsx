import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ElectricalPowerGeneralAspects from './ElectricalPowerGeneralAspects';
import PowerConsumptionBreakdown from './PowerConsumptionBreakdown';
import Section from '../../../../../ui/components/Section';
import { selectCurrentProduct } from '../../domain/product.selector';
import { inUsePowerConsumptionToggled } from '../../domain/product.slice';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function ElectricalPower() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const product = useSelector(selectCurrentProduct);
  return (
    <Section
      title="In-use power consumption"
      canBeDisabled
      enabled={product.inUsePowerConsumption.enabled}
      onToggle={() => {
        dispatch(inUsePowerConsumptionToggled());
      }}
    >
      <ElectricalPowerGeneralAspects />
      <PowerConsumptionBreakdown />
    </Section>
  );
}

export default ElectricalPower;
