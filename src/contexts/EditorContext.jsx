import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { EditorState, CompositeDecorator, convertToRaw, convertFromRaw } from 'draft-js';
import BibleVerse from '../components/Decorators/BibleRef/BibleRef';
import { findBibleVerses } from '../utils/findBibleVerses';
import hash from 'object-hash';
import { useBridge } from '../hooks/useBridge';


const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [currentDoc, setCurrentDoc] = useState(null);
  const { sendMessage } = useBridge();
  const editorRef = useRef(null);
  const lastSavedHashRef = useRef(null);
  const bibleDecorator = useMemo(() => new CompositeDecorator([
    {
      strategy: findBibleVerses,
      component: BibleVerse,
    },
  ]), []);

  const onChange = useCallback((newEditorState) => {
    if (!currentDoc) return;
    setCurrentDoc(newEditorState);
  }, [currentDoc]);

  const openDoc = useCallback((doc) => {
  if (doc && doc !== '') {
    //hacemos un timeout para evitar problemas de sincronización
      setTimeout(() => {
      }, 500);
      const raw = JSON.parse(doc); // el JSON string recibido
      const contentState = convertFromRaw(raw);
      const newState = EditorState.createWithContent(contentState, bibleDecorator);
      setCurrentDoc(newState);
  }else{
      const initialEditorState = EditorState.createEmpty(bibleDecorator);
      setCurrentDoc(initialEditorState);
  }

}, [bibleDecorator]);

const saveDoc = useCallback((state) => {
    if (!state) return;
    const rawContent = convertToRaw(state.getCurrentContent());
    const json = JSON.stringify(rawContent);
    const currentHash = hash(rawContent);
    const lastHash = lastSavedHashRef.current;

    if (lastHash === currentHash) {
      console.log('Contenido sin cambios (hash igual), no se guarda');
      return null;
    }

    lastSavedHashRef.current = currentHash;
    sendMessage({ type: 'DOCUMENT_SAVED', payload: json });
    console.log('Documento guardado automáticamente:', json);

}, []);

  useEffect(() => {
    if (!currentDoc) {
      const initialEditorState = EditorState.createEmpty(bibleDecorator);
      setCurrentDoc(initialEditorState);
    }
  }, [currentDoc, bibleDecorator]);

  const value = useMemo(() => ({
    currentDoc,
    setCurrentDoc,
    onChange,
    editorRef,
    bibleDecorator,
    openDoc,
    saveDoc,
  }), [currentDoc, onChange, editorRef, bibleDecorator, openDoc, saveDoc]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
