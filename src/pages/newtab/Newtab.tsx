// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
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

// function App() {
//   return (
//     <MemoedComponent className="App">
//       <ChildComponent />
//     </MemoedComponent>
//   );
// }

// // ✅ Good
// const config = {} // your config

// function App() {
//   // ❌ Bad
//   const config = {} 

//   return (
//     <Theme config={config}>
//       {/* ... children */}
//     </Theme>
//   );
//   }

// function App() {
//   const handleClick = useCallback(() => {
//     // handle click
//   }, [])

//   const sortedData = useMemo(() => {
//     // sort large set of data
//   }, [data])

//   return (
//     <Component onClick={handleClick} data={sortedData}>
//       {/* ... children */}
//     </Component>
//   );
// }

