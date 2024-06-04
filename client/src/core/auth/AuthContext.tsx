import React from 'react';
import { IUseAuth } from './auth.model';

export const AuthContext = React.createContext<IUseAuth | null>(null);
