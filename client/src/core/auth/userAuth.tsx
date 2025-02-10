import { useContext } from 'react';
import { IUseAuth } from './auth.model';
import { AuthContext } from './AuthProvider';

export const useAuth = (): IUseAuth | null => {
  return useContext(AuthContext);
};
