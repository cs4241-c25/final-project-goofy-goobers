import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './GooberApp';
import { BrowserRouter } from 'react-router-dom';
import { APIClient } from './APIClient';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

window.api = new APIClient();

declare global {
  let api: APIClient;
  interface Window {
    api: APIClient;
  }
}
