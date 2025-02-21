import { createContext, useContext } from 'react';
import { User } from '../../shared/models/User';

interface UserContextProps {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextProps>({} as never);

export function useUser(): User | undefined {
  const { user } = useContext(UserContext);
  return user;
}
