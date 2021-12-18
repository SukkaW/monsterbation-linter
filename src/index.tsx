import { createRoot } from 'react-dom';

import './style.css';

import { App } from './Components/App';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
