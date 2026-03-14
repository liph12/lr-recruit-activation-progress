import { useMemo } from "react";
import Axios from "axios";

const REMOTE_URL = "https://leuteriorealty.com/api";

const useAxios = () => {
  const authToken = localStorage.getItem("authToken") ?? "";

  const axiosInstance = useMemo(() => {
    return Axios.create({
      baseURL: REMOTE_URL,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${authToken}`,
      },
    });
  }, []);

  return axiosInstance;
};

export default useAxios;
