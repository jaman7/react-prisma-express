import { useContext } from 'react';
import { IUseAuth } from '../../shared/model/auth';
import { AuthContext } from './AuthProvider';

export const useAuth = (): IUseAuth | null => {
  return useContext(AuthContext);
};
