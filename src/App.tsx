import { BrowserRouter, Route, Routes } from "react-router-dom";
import ActivitiesMap from "./pages/ActivitiesMap";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<ActivitiesMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
