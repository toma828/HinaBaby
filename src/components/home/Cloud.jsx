import React from 'react';

const Cloud = ({ style, children }) => {
  return (
    <div 
      className="absolute bg-white bg-opacity-50 rounded-full filter blur-md shadow-lg z-0"
      style={{
        animation: `float-left-right ${60 + Math.random() * 30}s linear infinite`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Cloud;