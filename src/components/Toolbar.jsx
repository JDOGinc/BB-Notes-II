import React from 'react';
import { BLOCK_TYPES } from '../constants/BlockTypes';
import '../styles/Toolbar.css';
import { useEffect, useState, useRef } from 'react';

const Toolbar = ({ editorState, onToggleInline, onToggleBlock }) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const containerRef = useRef(null);

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

 useEffect(() => {
  const handleMessage = (event) => {
    let data;

    try {
      data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch (e) {
      return e;
    }

    const { type, keyboardHeight } = data;

    if (type === 'keyboardShown') {
      console.log('Keyboard shown with height:', keyboardHeight);
      setToolbarHeight(keyboardHeight);
    } else if (type === 'keyboardHidden') {
      console.log('Keyboard hidden');
      setToolbarHeight(0);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);

  const handleInlineClick = (e, style) => {
    e.preventDefault();
    onToggleInline(style); // Toggle the style
  };

  const handleBlockClick = (e, type) => {
    e.preventDefault();
    onToggleBlock(type === blockType ? 'unstyled' : type); // Toggle the block type
  };

  return (
    <div id='mainToolbar' className={toolbarHeight === 0 ? 'toolbar-hidden': 'toolbar'} style={{ bottom: toolbarHeight }}>
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
