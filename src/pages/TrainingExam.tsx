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
          `/integration/agent/course-exam?id=${course_id}&email=${user?.email}`,
        );

        const { exam, course } = response.data;

        setCourse(course);
        setExam(exam);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    fetchExamAsync();
  }, [axios, course_id, user?.email]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: desktop ? "50vh" : "100vh",
        width: "100%",
        p: 3,
      }}
    >
      {/* Course Title */}
      <Typography variant="h5" fontWeight="bold">
        {course ? "Course Exam" : "Loading Exam..."}
      </Typography>

      <Divider sx={{ width: "100%", my: 2 }} />

      {/* Questions */}
      {exam.length === 0 ? (
        <Typography>No exam questions available.</Typography>
      ) : (
        exam.map((q, index) => (
          <Box key={index} sx={{ width: "100%", mb: 2 }}>
            <Typography variant="subtitle1">
              {index + 1}. {q.question}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
