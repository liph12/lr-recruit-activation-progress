import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Welcome from "./pages/Welcome";
import GetStarted from "./pages/GetStarted";
import Training from "./pages/Training";
import TrainingCourses from "./pages/TrainingCourses";
import TrainingNavbarLayout from "./components/layouts/TrainingNavbarLayout";
import RentPHTraining from "./pages/RentPHTraining";

function App() {
  return (
    <Routes>
      <Route path="welcome" element={<MainLayout />}>
        <Route index element={<Welcome />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="fire" element={<TrainingNavbarLayout />}>
          <Route index element={<TrainingCourses />} />
          <Route path="training/:course_id" element={<Training />} />
          <Route path="training/rent" element={<RentPHTraining />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
