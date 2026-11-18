import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import './index.css';
import Standalone from './pages/Standalone';

const page = document.getElementById('root').dataset.page;
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Standalone page={page} />
  </StrictMode>,
);
