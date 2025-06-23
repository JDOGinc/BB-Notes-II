import { RichUtils } from 'draft-js';
import { useEditor } from '../contexts/EditorContext';

const useStyling = () => {
  const { currentDoc, onChange } = useEditor();

  // Función para alternar estilos en línea (negrita, cursiva, etc.)
  const toggleInlineStyle = (style) => {
    if (!currentDoc) return;
    console.log('toggleInlineStyle', style);
    const newEditorState = RichUtils.toggleInlineStyle(currentDoc, style);
    onChange(newEditorState);
  };

  // Función para alternar estilos de lista
  const toggleBlockType = (blockType) => {
    if (!currentDoc) return;
    console.log('toggleBlockType', blockType);
    const newEditorState = RichUtils.toggleBlockType(currentDoc, blockType);
    onChange(newEditorState);  
  };

  const getCurrentStyle = () =>{
    return currentDoc.getCurrentInlineStyle();
  };

  const getCurrentBlockType = () =>{

    const selection = currentDoc.getSelection();
    const blockType = currentDoc
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
