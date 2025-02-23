import React, { FC, useState } from 'react';
import { UserContext } from './services/providers';
import { User } from '../shared/models/User';
import { Container } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './containers/LoginPage';
import { NotFound } from './containers/NotFound';
import { HomePage } from './containers/HomePage';
import { CreatePage} from "./containers/CreatePage";

export const App: FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Container>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </UserContext.Provider>
  );
};
