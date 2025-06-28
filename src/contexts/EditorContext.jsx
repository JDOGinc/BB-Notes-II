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

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [currentDoc, setCurrentDoc] = useState(null);
  const editorRef = useRef(null);

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

const saveDoc = useCallback(() => {
    if (!currentDoc) return;
    const rawContent = convertToRaw(currentDoc.getCurrentContent());
    const json = JSON.stringify(rawContent);
    console.log('Saving document:', json);
    return json;
}, [currentDoc]);

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
