import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import 'react-tooltip/dist/react-tooltip.css';

import InitOrbitRMS from './App';

import './css/common.css';
import './css/font.css';
import './css/rootColors.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InitOrbitRMS />
  </StrictMode>
);
