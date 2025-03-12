import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/apiAuth.js";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (userData) => {
      queryClient.setQueryData(["user"], userData.user);
      navigate("/dashboard", { replace: true });
      console.log(userData);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return { login, isLoading };
}
