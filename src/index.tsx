import { createRoot } from 'react-dom/client';

import '@picocss/pico/css/pico.min.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import './style.css';

import { App } from './app';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
