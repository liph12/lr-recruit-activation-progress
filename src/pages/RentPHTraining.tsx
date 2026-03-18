import useExternalAxios from "../hooks/useExternalAxios";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";

interface Question {
  id: number;
  question: string;
  choices: string[];
}

interface Answer {
  id: number;
  question: string;
  choice: string;
}

interface Result {
  id: number;
  question: string;
  choice: string;
  correct: boolean;
}

const TRAINING_VIDEOS = [
  {
    title: "CREATING RENTAL OPPORTUNITIES AMIDST COVID19",
    video: "https://www.youtube.com/embed/FPTwL4WOQ-o?si=CVgl4ycqD3vtl9TL",
  },
  {
    title: "PROPERTY RENTAL MANAGEMENT",
    video: "https://realestatetraining.ph/video/eduardoManahan.mp4",
  },
  {
    title: "RENT MANAGER OPPORTUNITY",
    video: "https://realestatetraining.ph/video/eduardoManahan.mp4",
  },
];

export default function RentPHTraining() {
  const { user } = useAppProvider();
  const axios = useExternalAxios();
  const [exam, setExam] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitAsync = async () => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        "/integration/agent/submit-rent-exam",
        { answers },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setResults(data);
      setSubmitted(true);

      const t = setTimeout(() => {
        setSubmitted(false);
        clearTimeout(t);
      }, 500);
    } catch (e) {
      // to do
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const getExamAsync = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/integration/agent/rent-exam");
        const data = response.data;

        console.log(data);
      } catch (e) {
        // to do
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getExamAsync();
    }
  }, []);

  return <Box>Test</Box>;
}
