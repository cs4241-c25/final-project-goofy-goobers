import React, { FC, useEffect, useState } from 'react';
import { UserContext } from './services/providers';
import { User } from '../shared/models/User';
import { Container, Spinner } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './containers/LoginPage';
import { NotFound } from './containers/NotFound';
import { HomePage } from './containers/HomePage';
import { PathPage } from './containers/PathPage';
import { CreatePage } from './containers/CreatePage';

export const App: FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .poll()
      .then((currUser) => {
        setUser(currUser);
      })
      .catch(() => {
        /* do nothing, the user is not logged in */
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Container>
        {!loading && (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/view-path/:pathId" element={<PathPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route index element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
        {loading && <Spinner />}
      </Container>
    </UserContext.Provider>
  );
};
