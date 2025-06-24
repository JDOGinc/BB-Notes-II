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

  const getBibleDecorator = (editorRef) => new CompositeDecorator([
    {
      strategy: findBibleVerses,
      component: (props) => <BibleVerse {...props} editorRef={editorRef} />, // 👈 aquí pasas editorRef
    },
  ]);


  const onChange = useCallback((newEditorState) => {
    if (!currentDoc) return;
    setCurrentDoc(newEditorState);
  }, [currentDoc]);

  const openDoc = useCallback((doc) => {
    const decorator = getBibleDecorator(editorRef);
    
    if (doc && doc !== '') {
      setTimeout(() => {}, 500);
      const raw = JSON.parse(doc);
      const contentState = convertFromRaw(raw);
      const newState = EditorState.createWithContent(contentState, decorator);
      setCurrentDoc(newState);
    } else {
      const initialEditorState = EditorState.createEmpty(decorator);
      setCurrentDoc(initialEditorState);
    }
  }, []);


const saveDoc = useCallback(() => {
    if (!currentDoc) return;
    const rawContent = convertToRaw(currentDoc.getCurrentContent());
    const json = JSON.stringify(rawContent);
    console.log('Saving document:', json);
    return json;
}, [currentDoc]);

  useEffect(() => {
  if (!currentDoc) {
    const decorator = getBibleDecorator(editorRef);
    const initialEditorState = EditorState.createEmpty(decorator);
    setCurrentDoc(initialEditorState);
  }
}, [currentDoc]);


  const value = useMemo(() => ({
    currentDoc,
    setCurrentDoc,
    onChange,
    editorRef,
    openDoc,
    saveDoc,
  }), [currentDoc, onChange, editorRef, openDoc, saveDoc]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
