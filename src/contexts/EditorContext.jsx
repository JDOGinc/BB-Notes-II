import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { EditorState, CompositeDecorator } from 'draft-js';
import { Document } from '../models/Document';
import { v4 as uuidv4 } from 'uuid';
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

  const getFirstBlockText = useCallback((editorState) => {
    if (!editorState) return null;
    const text = editorState.getCurrentContent().getFirstBlock().getText().trim();
    return text || 'Nueva nota';
  }, []);

  const getSecondBlockText = useCallback((editorState) => {
    if (!editorState) return null;
    const contentState = editorState.getCurrentContent();
    const firstBlock = contentState.getFirstBlock();
    const afterBlock = contentState.getBlockAfter(firstBlock.getKey());
    return afterBlock ? afterBlock.getText().trim().slice(0, 40) : 'Ningún texto adicional';
  }, []);

  const onChange = useCallback((newEditorState) => {
    if (!currentDoc) return;

    const oldContent = currentDoc.editorState.getCurrentContent().getPlainText();
    const newContent = newEditorState.getCurrentContent().getPlainText();
    const haveChanges = oldContent !== newContent;

    const selectionState = newEditorState.getSelection();
    const inlineStyles = newEditorState.getCurrentInlineStyle();

    let editorStateToReturn = EditorState.forceSelection(newEditorState, selectionState);
    editorStateToReturn = EditorState.setInlineStyleOverride(editorStateToReturn, inlineStyles);

    const newDoc = {
      ...currentDoc,
      title: getFirstBlockText(newEditorState) || 'Nueva nota',
      content: getSecondBlockText(newEditorState) || 'Ningún texto adicional',
      modificationDate: haveChanges ? Date.now() : currentDoc.modificationDate,
      editorState: editorStateToReturn,
      isSaved: haveChanges ? false : currentDoc.isSaved,
    };

    setCurrentDoc(newDoc);
  }, [currentDoc, getFirstBlockText, getSecondBlockText]);

  const createDoc = useCallback(() => {
    const newDoc = new Document(
      uuidv4(),
      'Nueva nota',
      'Ningún texto adicional',
      Date.now(),
      Date.now(),
      EditorState.createEmpty(bibleDecorator),
      true,
      false
    );
    setCurrentDoc(newDoc);
  }, [bibleDecorator]);

  useEffect(() => {
    if (!currentDoc) {
      createDoc();
    }
  }, [createDoc, currentDoc]);

  const value = useMemo(() => ({
    currentDoc,
    setCurrentDoc,
    createDoc,
    onChange,
    editorRef,
  }), [currentDoc, createDoc, onChange, editorRef]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
