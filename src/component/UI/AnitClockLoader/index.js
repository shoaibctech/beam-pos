import React from 'react';
import './styles.css';

export default ({ message = 'loading...', color = 'black', height = 50, width = 50 }) => {
  return (
     <div>
       <div className="anti-clock-loader" style={{borderTop: `4px solid ${color}`, height: height, width: width}}></div>
       <h3 className="anti-clock-message">{message}</h3>
     </div>
  );
};