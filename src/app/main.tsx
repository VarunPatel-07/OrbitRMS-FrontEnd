import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import 'react-tooltip/dist/react-tooltip.css';

import InitOrbitRMS from '@/app/App';

import '@/styles/common.css';
import '@/styles/fonts.css';
import '@/styles/index.css';
import '@/styles/colors.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InitOrbitRMS />
  </StrictMode>
);
