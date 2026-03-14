import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Welcome from "./pages/Welcome";
import GetStarted from "./pages/GetStarted";
import Training from "./pages/Training";
import Exam from "./pages/Exam";

function App() {
  return (
    <Routes>
      <Route path="welcome" element={<MainLayout />}>
        <Route index element={<Welcome />} />
        <Route path="get-started" element={<GetStarted />}>
          <Route path="training/:course_id" element={<Training />} />
        </Route>
      </Route>
      <Route path="exam" element={<Exam />} />
    </Routes>
  );
}

export default App;
