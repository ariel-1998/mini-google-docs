import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:id" Component={TextEditor} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
