import { LoginFormType } from "./form.schema";
import { clickLogin } from "./action";

export default function useLoginFormSection() {
  const onSubmit = async (
    data: LoginFormType,
    setError: (field: keyof LoginFormType, error: { type: string; message: string }) => void
  ) => {
    const result = await clickLogin(data);

    if (result?.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof LoginFormType, {
            type: "manual",
            message: errors[0],
          });
        }
      });
    }
  };

  return { onSubmit };
}
