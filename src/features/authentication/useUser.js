import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth.js";

export function useUser() {
  const {
    isLoading,
    data: user,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    isLoading,
    user,
    isAuthenticated: user?.role === "authenticated",
    isFetching,
  };
}
