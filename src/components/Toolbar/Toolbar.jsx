import React from 'react';
import { BLOCK_TYPES } from '../../constants/BlockTypes';
import './Toolbar.css';
import { useEffect, useState, useRef } from 'react';
import { useBridge } from '../../hooks/useBridge';
import useStyling from '../../hooks/useStyling';

const Toolbar = () => {
  const { toggleInlineStyle, toggleBlockType, getCurrentStyle, getCurrentBlockType } = useStyling();

  const currentStyle = getCurrentStyle();
  const blockType = getCurrentBlockType();
    
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const containerRef = useRef(null);
  const { onMessage } = useBridge();

  // Mnejar el scroll del toolbar y ocultar el fade al final
  useEffect(() => {
    const container = containerRef.current;

    const checkScrollEnd = () => {
      if (!container) return;
      const isScrolledToEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
      container.classList.toggle('hide-fade', isScrolledToEnd);
    };

    container.addEventListener('scroll', checkScrollEnd);
    window.addEventListener('load', checkScrollEnd); // Por si el scroll ya está al final

    // Llamar al inicio
    checkScrollEnd();

    return () => {
      container.removeEventListener('scroll', checkScrollEnd);
      window.removeEventListener('load', checkScrollEnd);
    };
  }, []);

  // Escuchar mensajes de la app para ajustar la altura del toolbar sobre el teclado
  useEffect(() => {
    onMessage('KB_SHOWN', (payload) => {
      console.log('Keyboard shown with height:', payload);
      setToolbarHeight(payload);
    });
    onMessage('KB_HIDDEN', () => {
      console.log('Keyboard hidden');
      setToolbarHeight(0);
    });
  }, [onMessage]);

  const handleInlineClick = (e, style) => {
    e.preventDefault();
    toggleInlineStyle(style); // Toggle the style
  };

  const handleBlockClick = (e, type) => {
    e.preventDefault();
    toggleBlockType(type === blockType ? 'unstyled' : type); // Toggle the block type
  };

  return (
    <div className='toolbar' style={ toolbarHeight == 0 ? {opacity: 0, pointerEvents: 'none'} : { opacity: 1}}>
      <div className="toolbar-container" ref={containerRef}>
        <div className='button-group'>
            <button
                className={currentStyle.has('BOLD') ? 'active' : ''}
                onMouseDown={(e) => handleInlineClick(e, 'BOLD')}
            >
                <b>B</b>
            </button>
            <button
                className={currentStyle.has('ITALIC') ? 'active' : ''}
                onMouseDown={(e) => handleInlineClick(e, 'ITALIC')}
            >
                <i>I</i>
            </button>
            <button
                className={currentStyle.has('UNDERLINE') ? 'active' : ''}
                onMouseDown={(e) => handleInlineClick(e, 'UNDERLINE')}
            >
                <u>U</u>
            </button>
        </div>
        <div className='button-group'>
        {BLOCK_TYPES.map((type) => (
          <button
            key={type.style}
            className={blockType === type.style ? 'active' : ''}
            onMouseDown={(e) => handleBlockClick(e, type.style)}
          >
            {type.label}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
