import { useState, useEffect } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './App.css'

const BLOCK_TYPES = [
  { label: 'Título', style: 'header-one' },
  { label: 'Subtítulo', style: 'header-two' },
  { label: 'Párrafo', style: 'unstyled' },
]

function Toolbar({ editorState, onToggleInline, onToggleBlock }) {
  const currentStyle = editorState.getCurrentInlineStyle()
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          className={currentStyle.has('BOLD') ? 'active' : ''}
          onMouseDown={e => { e.preventDefault(); onToggleInline('BOLD') }}
        >B</button>
        <button
          className={currentStyle.has('ITALIC') ? 'active' : ''}
          onMouseDown={e => { e.preventDefault(); onToggleInline('ITALIC') }}
        >I</button>
        <button
          className={currentStyle.has('UNDERLINE') ? 'active' : ''}
          onMouseDown={e => { e.preventDefault(); onToggleInline('UNDERLINE') }}
        >U</button>
        {BLOCK_TYPES.map(type => (
          <button
            key={type.style}
            className={blockType === type.style ? 'active' : ''}
            onMouseDown={e => { e.preventDefault(); onToggleBlock(type.style) }}
          >{type.label}</button>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [theme, setTheme] = useState('light')

  // Cambia el atributo data-theme en el body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const checkTheme = () => {
      if (typeof window.isDarkMode !== 'undefined') {
        setTheme(window.isDarkMode ? 'dark' : 'light')
      }
    }
    const interval = setInterval(checkTheme, 500)
    return () => clearInterval(interval)
  }, [])

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
