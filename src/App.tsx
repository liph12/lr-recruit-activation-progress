import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Welcome from "./pages/Welcome";
import GetStarted from "./pages/GetStarted";
import TrainingExam from "./pages/TrainingExam";
import Exam from "./pages/Exam";

function App() {
  return (
    <Routes>
      <Route path="welcome" element={<MainLayout />}>
        <Route index element={<Welcome />} />
        <Route path="get-started" element={<GetStarted />}>
          <Route path="training/:course_id" element={<TrainingExam />} />
        </Route>
      </Route>
      <Route path="exam" element={<Exam />} />
    </Routes>
  );
}

export default App;
