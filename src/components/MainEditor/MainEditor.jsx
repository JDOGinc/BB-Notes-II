import { useEffect, useCallback } from 'react';
import { Editor } from 'draft-js';
import '@draft-js-plugins/mention/lib/plugin.css';
import './MainEditor.css';
import Toolbar from '../Toolbar/Toolbar';
import { useBridge } from '../../hooks/useBridge';
import { useEditor } from '../../contexts/EditorContext';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

function MainEditor() {
  const {currentDoc, onChange, editorRef, openDoc, saveDoc} = useEditor();

  const { onMessage, sendMessage } = useBridge();

  // Escuchar mensajes entrantes
  useEffect(() => {
     const unsubscribe = onMessage('SET_THEME', (payload) => {
      console.log('Tema recibido:', payload);
      document.body.setAttribute('data-theme', payload);
    });
    return unsubscribe;
  }, [onMessage]);

  // Abrir documento cuando se recibe un mensaje
  useEffect(() => {
    const unsubscribe = onMessage('SET_DOCUMENT', (payload) => {
      console.log('Documento recibido:', payload);
        openDoc(payload);
    });
    return unsubscribe;
  }, [onMessage, openDoc]);
      

  useEffect(() => {
  const unsubscribe = onMessage('SAVE_DOCUMENT', () => {
    const doc = saveDoc();
    console.log("Guardado:", doc);
    if (doc) {
      sendMessage({ type: 'DOCUMENT_SAVED', payload: doc });
    } else {
      console.warn('No hay documento para guardar');
    }
  });

  return unsubscribe;
}, [onMessage, saveDoc]);


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
        (currentDoc) && (
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
                editorState={currentDoc}
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
