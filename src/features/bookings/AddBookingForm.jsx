import { useState } from "react";
import { useCabins } from "../cabins/useCabins.js";
import { useGuests } from "./useGuests.js";
import { useSettings } from "../settings/useSettings.js";
import { useCreateBooking } from "./useCreateBooking.js";
import { useForm } from "react-hook-form";
import Spinner from "../../ui/Spinner.jsx";
import { differenceInDays, isBefore, isDate, startOfToday } from "date-fns";
import FormRow from "../../ui/FormRow.jsx";
import Input from "../../ui/Input.jsx";
import Checkbox from "../../ui/Checkbox.jsx";
import Button from "../../ui/Button.jsx";
import toast from "react-hot-toast";
import styled from "styled-components";
import Form from "../../ui/Form.jsx";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

function AddBookingForm() {
  const [withBreakfast, setWithBreakfast] = useState();
  const [isPaid, setIsPaid] = useState(false);
  const { cabins, isLoading } = useCabins();
  const { guests, isLoadingGuests } = useGuests();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { createBooking, isCreating } = useCreateBooking();

  const { register, handleSubmit, formState, getValues } = useForm();

  const { errors } = formState;

  if (isLoading || isLoadingSettings || isLoadingGuests) return <Spinner />;

  function onSubmit(data) {
    const numNights = differenceInDays(
      new Date(data.endDate),
      new Date(data.startDate)
    );
    const today = startOfToday();

    // Filtering dates
    if (numNights < 1) {
      toast.error("Start date must be before end date");
      return;
    }

    if (numNights < settings.minBookingLength) {
      toast.error(
        `Minimum nights per booking are ${settings.minBookingLength}`
      );
      return;
    }

    if (numNights > settings.minBookingLength) {
      toast.error(
        `Maximum nights per booking are ${settings.maxBookingLength}`
      );
      return;
    }

    if (isBefore(new Date(data.startDate), today)) {
      toast.error("You can't start a booking before today");
      return;
    }

    // Cabin price
    const reservedCabin = cabins
      .filter((cabin) => cabin.id === Number(data.cabinId))
      .at(0);
    const cabinPrice =
      (reservedCabin.regularPrice - reservedCabin.discount) * numNights;

    // Extras price
    const extrasPrice = withBreakfast
      ? settings.breakfastPrice * numNights * data.numGuests
      : 0;

    // Total Price
    const totalPrice = cabinPrice + extrasPrice;

    const finalData = {
      ...data,
      cabinPrice,
      extrasPrice,
      totalPrice,
      isPaid,
      numNights,
      cabinId: Number(data.cabinId),
      numGuests: Number(data.numGuests),
      guestId: Number(data.guestId),
      hasBreakfast: withBreakfast,
      status: "unconfirmed",
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    console.log(finalData);

    createBooking(finalData);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          disabled={isCreating}
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
            validate:
              isDate(getValues().startDate) || "You must choose a valid date",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isCreating}
          {...register("endDate", {
            required: "This field is required",
            validate:
              isDate(getValues().endDate) || "You must choose a valid date",
          })}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          min={1}
          disabled={isCreating}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Minimum number of guests must be 1",
            },
            max: {
              value: settings.maxGuestsPerBooking,
              message: `Max number of guests must be ${settings.maxGuestsPerBooking}`,
            },
          })}
        />
      </FormRow>

      <FormRow label="Select cabin">
        <StyledSelect
          disabled={isCreating}
          id="cabinId"
          {...register("cabinId")}
        >
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label="Select guest">
        <StyledSelect
          disabled={isCreating}
          id="guestId"
          {...register("guestId")}
        >
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label="Further observations">
        <Input
          disabled={isCreating}
          type="text"
          id="observations"
          {...register("observations")}
        />
      </FormRow>

      <FormRow>
        <Checkbox
          disabled={isCreating}
          id="breakfast"
          onChange={() => setWithBreakfast((breakfast) => !breakfast)}
        >
          Add breakfast
        </Checkbox>
      </FormRow>

      <FormRow>
        <Checkbox
          disabled={isCreating}
          id="paid"
          onChange={() => setIsPaid((paid) => !paid)}
        >
          This booking is paid
        </Checkbox>
      </FormRow>

      <FormRow>
        <Button type="submit" variation="primary" disabled={isCreating}>
          Submit
        </Button>
        <Button type="cancel" variation="secondary" disabled={isCreating}>
          Cancel
        </Button>
      </FormRow>
    </Form>
  );
}

export default AddBookingForm;
