import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/newtab/Newtab.css';
import { useTasks } from '@src/hooks/api/useTasks';

export default function Newtab(): JSX.Element {
  const {  } = useTasks();
  return (
    <div className="App">
      
    </div>
  );
}
