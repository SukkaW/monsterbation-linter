import { createRoot } from 'react-dom/client';

import './style.css';

import { App } from './app';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
