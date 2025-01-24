import { LoginFormType } from "./form.schema";
import { useForm } from "react-hook-form";
import { login } from "./action";

export default function useLoginFormSection() {
  const { setError } = useForm();

  const onSubmit = async (data: LoginFormType) => {
    await login(data);
  };
  return { onSubmit };
}
