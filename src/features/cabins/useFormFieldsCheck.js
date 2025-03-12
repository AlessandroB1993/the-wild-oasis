import { useEffect, useRef, useState } from "react";

export function useFormFieldsCheck(formFields) {
  const [formState, setFormState] = useState(formFields);
  const prevFormFields = useRef(formFields);

  useEffect(() => {
    if (JSON.stringify(prevFormFields.current) !== JSON.stringify(formFields)) {
      prevFormFields.current = formFields;
      setFormState(formFields);
    }
  }, [formFields]);

  return formState;
}
