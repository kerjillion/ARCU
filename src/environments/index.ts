import { environment as devEnvironment } from './environment';
import { environment as prodEnvironment } from './environment.prod';

export const getEnvironment = () => {
  return (typeof ngDevMode !== 'undefined' && ngDevMode) ? devEnvironment : prodEnvironment;
};
