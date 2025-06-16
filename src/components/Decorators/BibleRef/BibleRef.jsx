import React, { useState } from 'react';
import './BibleRef.css';

const BibleVerse = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);

  // Simulación del versículo (puedes hacer un fetch real aquí)
  const verseText = '“Vosotros sois la luz del mundo…”';

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  return (
    <span className='bible-ref'
      onClick={togglePopup}
    >
      {children}
      {showPopup && (
        <div
          style={{
            position: 'absolute',
            top: '1.5em',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10,
            minWidth: '200px',
          }}
        >
          <strong>Versículo:</strong>
          <p style={{ margin: '6px 0' }}>{verseText}</p>
          <button onClick={() => setShowPopup(false)}>Cerrar</button>
        </div>
      )}
    </span>
  );
};

export default BibleVerse;
