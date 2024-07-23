<template>
    <form @submit.prevent="handleSubmitForm">
      <input v-model="formData.name" @input="toUpperCase('name')" placeholder="Name" />
      <span>{{ errors.name }}</span>
      
      <input v-model="formData.email" placeholder="Email" />
      <span>{{ errors.email }}</span>
      
      <button type="submit" :disabled="isSubmitting">Submit</button>
      
      <div v-if="httpError">{{ httpError }}</div>
    </form>
  </template>
  
  <script setup>
  import { z } from 'zod';
  import { useForm } from '../composables/useForm.js';
  
  const initialData = {
    name: '',
    email: '',
  };
  
  const schema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
  });
  
  const { formData, errors, isSubmitting, httpError, trimData, toUpperCase, handleSubmit } = useForm(initialData, schema);
  
  const handleSubmitForm = async () => {
    trimData();
    await handleSubmit(async (data) => {
      
    });
  };
  </script>
  