// src/components/PersonalDetailsForm.js
import React from 'react';
import { useForm } from 'react-hook-form';

const PersonalDetailsForm = ({ formData }) => {
  const { register, setValue, handleSubmit } = useForm();

  React.useEffect(() => {
    if (formData) {
      setValue('firstName', formData.firstName);
      setValue('lastName', formData.lastName);
      setValue('summary', formData.summary);
      setValue('phone', formData.phone);
      setValue('email', formData.email);
      setValue('address', formData.address);
    }
  }, [formData, setValue]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Personal Details</h2>
      <input {...register('firstName')} placeholder="First Name" />
      <input {...register('lastName')} placeholder="Last Name" />
      <input {...register('summary')} placeholder="Summary" />
      <input {...register('phone')} placeholder="Phone no." />
      <input {...register('email')} placeholder="Email Address" />
      <input {...register('address')} placeholder="Address" />
      <button type="submit">Next</button>
    </form>
  );
};

export default PersonalDetailsForm;
