import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Project Management App</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;