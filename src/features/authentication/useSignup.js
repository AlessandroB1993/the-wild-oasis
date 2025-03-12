import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate();
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Account successfully created. Please verify the new account from the user's email address"
      );
      navigate("/users/success");
    },
    onError: (err) =>
      toast.error(err.message || "An error occurred during signup"),
  });

  return { isLoading, signup };
}
