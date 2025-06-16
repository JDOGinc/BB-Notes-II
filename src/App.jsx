import MainEditor from "./components/MainEditor/MainEditor";
import { EditorProvider } from "./contexts/EditorContext";

function App() {
  
  return (
    <EditorProvider>
      <MainEditor />
    </EditorProvider>
    
  );
}

export default App;
