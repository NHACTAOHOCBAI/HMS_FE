import { useMutation } from "@tanstack/react-query";
// import { authService } from "@/services/auth.service";
import { mockAuthService as authService } from "@/services/auth.mock.service";
import { LoginRequest, RegisterRequest } from "@/interfaces/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (credentials: RegisterRequest) =>
      authService.signup(credentials),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
};
