import React from 'react';

// src/TestComponent.tsx
export const Comp = () => {
  const [state, setState] = React.useState(0);
  React.useEffect(() => {
    setState(1);
  }, []);
  // console.log('here2');
  // console.log('here2');
  return <div>{state}</div>;
};
