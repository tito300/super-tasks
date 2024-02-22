import { createRoot } from 'react-dom/client';
import './style.css' 
import { Root } from './components/Root';
import { TaskListManager } from '@src/components/TaskListManager/TaskListManager';

if (document.location.host === "new-tab-page") {
  if (document.getElementById('mostVisited')) {
    hook()
  }
}

function hook() {
  const div = document.createElement('div');
  div.id = '__root';
  document.body.appendChild(div);
  
  const rootContainer = document.querySelector('#__root');
  if (!rootContainer) throw new Error("Can't find Options root element");
  const root = createRoot(rootContainer);
  root.render(
    <TaskListManager />
  );
  
  try {
    console.log('content script loaded');
  } catch (e) {
    console.error(e);
  }
}
