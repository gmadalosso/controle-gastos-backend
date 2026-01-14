import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Pessoas } from "./pages/Pessoas";
import { Categorias } from "./pages/Categorias";
import { Transacoes } from "./pages/Transacoes";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
