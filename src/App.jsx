import { useState, useEffect } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './styles/App.css';
import Toolbar from './components/Toolbar'

function App() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [theme] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  // Cambia el atributo data-theme en el body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const handleInline = style => setEditorState(RichUtils.toggleInlineStyle(editorState, style))
  const handleBlock = type => setEditorState(RichUtils.toggleBlockType(editorState, type))

  return (
    <div className="editor-container">
      <Toolbar
        editorState={editorState}
        onToggleInline={handleInline}
        onToggleBlock={handleBlock}
      />
      <div className="editor-area" onClick={() => document.querySelector('.DraftEditor-root').focus()}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Escribe aquí..."
          spellCheck={true}
        />
      </div>
    </div>
  )
}

export default App
