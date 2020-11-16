import React from 'react';
import './styles.css';

export default ({ message = 'loading...', color = 'black', height = 120, width = 120 }) => {
  return (
     <div>
       <div className="anti-clock-loader" style={{borderTop: `9px solid ${color}`, height: height, width: width}}></div>
       <h3 className="anti-clock-message">{message}</h3>
     </div>
  );
};