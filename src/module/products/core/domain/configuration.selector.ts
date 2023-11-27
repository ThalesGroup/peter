import { RootStateWithDI } from '../../../shared/core/domain/store';

export const selectConfiguration = (state: RootStateWithDI) =>
  state.configuration;
