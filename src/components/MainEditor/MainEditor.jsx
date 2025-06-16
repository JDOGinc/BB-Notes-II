import { useEffect, useCallback } from 'react';
import { Editor } from 'draft-js';
import '@draft-js-plugins/mention/lib/plugin.css';
import './MainEditor.css';
import Toolbar from '../Toolbar/Toolbar';
import { useBridge } from '../../hooks/useBridge';
import { useEditor } from '../../contexts/EditorContext';
import 'draft-js/dist/Draft.css';

function MainEditor() {
  const {currentDoc, onChange, editorRef} = useEditor();

  const { onMessage } = useBridge();

  // Escuchar mensajes entrantes
  useEffect(() => {
    onMessage('SET_THEME', (payload) => {
      console.log('Tema recibido:', payload);
      document.body.setAttribute('data-theme', payload);
    });
  }, [onMessage]);

  const handleEditorChange = useCallback((newEditorState) => {
    onChange(newEditorState);
  }, [onChange]);

   const handleBeforeInput = (input, editorState) => {
    // Si detecta dos espacios seguidos, evita la entrada de otro espacio
    if (input === ' ' && editorState.getCurrentContent().getLastCharacter() === ' ') {
      return 'handled';
    }
    return 'not-handled';
  };
  

  return (
    <div className="editor-container"
      onClick={() => {
        editorRef.current.focus();
      }}
    >
      {
        (currentDoc && currentDoc.editorState) && (
          <>
            <Toolbar />
            <div
              className="editor-area"
              onClick={() => {
                editorRef.current.focus();
            }}
            >
              <Editor
                editorKey={'editor'}
                editorState={currentDoc.editorState}
                onChange={handleEditorChange}
                placeholder="Escribe aquí..."
                spellCheck={true}
                ref={editorRef}
                handleBeforeInput={handleBeforeInput}
                
              />
            </div>
          </>
        )
      }
    </div>
  );
}

export default MainEditor;
