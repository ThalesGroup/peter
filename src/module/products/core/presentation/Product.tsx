import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { selectConfiguration } from '../domain/configuration.selector';
import { loadConfiguration } from '../domain/configuration.slice';
import InUseMobility from './in-use-mobility/InUseMobility';
import Recycling from './recycling/Recycling';
import ElectricalPower from './electrical-power/ElectricalPower';
import Evaluation from '../../../evaluations/core/presentation/Evaluation';
import Separator from '../../../shared/core/presentation/Separator';
import TestAndQualification from './test-and-qualification/TestAndQualification';
import Manufacturing from './manufacturing/Manufacturing';
import { AppDispatchWithDI } from '../../../shared/core/domain/store';

function Product() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const configuration = useSelector(selectConfiguration);

  useEffect(() => {
    dispatch(loadConfiguration());
  }, [dispatch]);

  return (
    <>
      {configuration.loading === 'pending' && <div>Loading</div>}
      {configuration.loading === 'idle' && (
        <>
          <Manufacturing />
          <Separator />
          <TestAndQualification />
          <Separator />
          <InUseMobility />
          <Separator />
          <ElectricalPower />
          <Separator />
          <Recycling />
          <Separator />
          <Evaluation />
        </>
      )}
    </>
  );
}

export default Product;
