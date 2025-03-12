import Input from "../../ui/Input.jsx";
import Form from "../../ui/Form.jsx";
import Button from "../../ui/Button.jsx";
import Textarea from "../../ui/Textarea.jsx";
import FormRow from "../../ui/FormRow.jsx";

import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin.js";
import { useEditCabin } from "./useEditCabin.js";
import { useEffect } from "react";
import { useCabinContext } from "../../ui/AppLayout.jsx";
import DragAndDrop from "../../ui/DragAndDrop.jsx";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditingSession = Boolean(editId);
  const { setIsDirty } = useCabinContext();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    watch,
    setValue,
  } = useForm({
    defaultValues: isEditingSession ? editValues : {},
  });
  const { errors } = formState;

  const formFields = watch(); // updates value in real time
  const onlyStringValues = Object.values(formFields)
    .slice(0, -1)
    .filter((value) => value !== "0");

  const isDirty = onlyStringValues.some((value) => value !== "");

  useEffect(() => {
    if (isDirty === true) setIsDirty(true);
    if (isDirty === false) setIsDirty(false);
  }, [isDirty, setIsDirty]);

  const { isCreating, createCabinApi } = useCreateCabin();
  const { isEditing, editCabinApi } = useEditCabin();
  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    console.log(data.image[0]);
    const image =
      typeof data.image === "object" && data.image.length > 0
        ? data.image[0]
        : cabinToEdit.image;

    if (isEditingSession)
      editCabinApi(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => {
            console.log(data);
            reset(getValues());
            onCloseModal?.();
          },
        }
      );
    else
      createCabinApi(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError() {
    // console.log(errors);
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? "modal" : "regular"}
      >
        <FormRow label="Cabin name" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            disabled={isWorking}
            {...register("name", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
          <Input
            type="number"
            id="maxCapacity"
            disabled={isWorking}
            {...register("maxCapacity", {
              required: "This field is required",
              min: {
                value: 1,
                message: "Capacity should be at least 1",
              },
            })}
          />
        </FormRow>

        <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
          <Input
            type="number"
            id="regularPrice"
            disabled={isWorking}
            {...register("regularPrice", {
              required: "This field is required",
              min: {
                value: 1,
                message: "Capacity should be at least 1",
              },
            })}
          />
        </FormRow>

        <FormRow label="Discount" error={errors?.discount?.message}>
          <Input
            type="number"
            id="discount"
            disabled={isWorking}
            defaultValue={0}
            {...register("discount", {
              required: "This field is required",
              validate: (value) =>
                +value <= +getValues().regularPrice ||
                "Discount should be less than regular price",
            })}
          />
        </FormRow>

        <FormRow
          label="Description for website"
          error={errors?.description?.message}
        >
          <Textarea
            type="number"
            id="description"
            disabled={isWorking}
            defaultValue=""
            {...register("description", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow label="Cabin photo">
          {/* <FileInput
            id="image"
            accept="image/*"
            {...register("image", {
              required: isEditingSession ? false : "This field is required",
            })}
          /> */}

          <DragAndDrop
            name="image"
            setValue={setValue}
            register={register}
            isEditingSession={isEditingSession}
            errors={errors}
          />
        </FormRow>

        <FormRow>
          {/* type is an HTML attribute! */}
          <Button
            variation="secondary"
            type="reset"
            onClick={(e) => onCloseModal?.(e)}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isEditingSession ? "Edit cabin" : "Create cabin"}
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateCabinForm;
