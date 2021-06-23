import React from 'react';
import './styles.css';

const AntiClockLoader =  ({ message = 'loading...', color = 'black', height = 56, width = 56 }) => {
  return (
     <React.Fragment>
       <div className="anti-clock-loader" style={{borderTop: `4px solid ${color}`, height: height, width: width}}></div>
       <h3 className="anti-clock-message">{message}</h3>
     </React.Fragment>
  );
};

export default AntiClockLoader;