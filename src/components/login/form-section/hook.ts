import { LoginFormType } from "./form.schema";
import { useForm } from "react-hook-form";
import { clickLogin } from "./action";

export default function useLoginFormSection() {
  const { setError } = useForm();

  const onSubmit = async (data: LoginFormType) => {
    await clickLogin(data);
  };
  return { onSubmit };
}
