import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import type { User } from "../types/user";
import useAxios from "../hooks/useAxios";
import PageLoader from "../components/PageLoader";

interface AppContextType {
  desktop: boolean;
  user: User | null;
  setUserData: (u: User | null) => void;
  authToken: string | null;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const axios = useAxios();
  const theme = useTheme();
  const authToken = localStorage.getItem("authToken") ?? "";
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const setUserData = (u: User | null) => setUser(u);

  useEffect(() => {
    const fetchUserAsync = async () => {
      try {
        const response = await axios.get(`/agent/auth`);
        const { data } = response.data;

        setUser(data);
      } catch (e) {
        // to do
      } finally {
        setLoading(false);
      }
    };

    fetchUserAsync();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(true);
    }
  }, [user]);

  if (loading && !user) {
    return <PageLoader />;
  }

  return (
    <AppContext.Provider
      value={{ desktop, user, authToken, loading, setUserData }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppProvider must be used within a AppProvider");
  }
  return context;
};

export { AppProvider, useAppProvider };
