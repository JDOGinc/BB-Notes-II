import { RichUtils } from 'draft-js';
import { useEditor } from '../contexts/EditorContext';

const useStyling = () => {
  const { currentDoc, onChange } = useEditor();

  // Función para alternar estilos en línea (negrita, cursiva, etc.)
  const toggleInlineStyle = (style) => {
    if (!currentDoc || !currentDoc.editorState) return;
    console.log('toggleInlineStyle', style);
    const newEditorState = RichUtils.toggleInlineStyle(currentDoc.editorState, style);
    onChange(newEditorState);
  };

  // Función para alternar estilos de lista
  const toggleBlockType = (blockType) => {
    if (!currentDoc || !currentDoc.editorState) return;
    console.log('toggleBlockType', blockType);
    const newEditorState = RichUtils.toggleBlockType(currentDoc.editorState, blockType);
    onChange(newEditorState);  
  };

  const getCurrentStyle = () =>{
    return currentDoc.editorState.getCurrentInlineStyle();
  };

  const getCurrentBlockType = () =>{

    const selection = currentDoc.editorState.getSelection();
    const blockType = currentDoc.editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return blockType;
  }


  return {
    toggleInlineStyle,
    toggleBlockType,
    getCurrentStyle,
    getCurrentBlockType
  };
};

export default useStyling;
