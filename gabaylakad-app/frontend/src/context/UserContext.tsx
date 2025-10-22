import React, { createContext, useContext } from 'react';
import { UserType } from '../pages/Profile';

export const UserContext = createContext<{
  user: UserType | null;
  setUser: (u: UserType | null) => void;
}>({ user: null, setUser: () => {} });

export const useUser = () => useContext(UserContext);
