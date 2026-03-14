import { useMemo } from "react";
import Axios from "axios";

const REMOTE_URL = "https://realestatetraining.ph/api/";

export const useExternalAxios = () => {
  const axiosInstance = useMemo(() => {
    return Axios.create({
      baseURL: REMOTE_URL,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "x-api-key": "fhph_live_api_2026_6e6a4b74f4e54f8a9fa8c1a741f95d32",
      },
    });
  }, []);

  return axiosInstance;
};

export default useExternalAxios;
