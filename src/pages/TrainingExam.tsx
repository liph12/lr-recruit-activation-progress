import { Box, Typography, Divider } from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";
import useExternalAxios from "../hooks/useExternalAxios";
import { useEffect, useState } from "react";
import type { Course, Questionaire } from "../types/course";
import { useOutletContext } from "react-router-dom";

type OutletContextProps = {
  course_id: string;
};

export default function TrainingExam() {
  const { course_id } = useOutletContext<OutletContextProps>();
  const axios = useExternalAxios();
  const [exam, setExam] = useState<Questionaire[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const { desktop, user } = useAppProvider();

  useEffect(() => {
    const fetchExamAsync = async () => {
      try {
        const response = await axios.get(
          `/integration/agent/course-exam?id=${course_id}&email=${user?.email}`
        );
        const { exam, course } = response.data;

        setCourse(course);
        setExam(exam);
      } catch (e) {
        // to do
      } finally {
        // to do
      }
    };

    fetchExamAsync();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: desktop ? "50vh" : "100vh",
        alignItems: "center",
      }}
    ></Box>
  );
}
