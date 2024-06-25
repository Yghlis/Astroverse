import { reactive, ref } from 'vue';
import { z } from 'zod';



export function useForm(initialData, schema) {
  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);

  function trimData() {
    for (const key in formData) {
      if (typeof formData[key] === 'string') {
        formData[key] = formData[key].trim();
      }
    }
  }

  function toUpperCase(key) {
    if (formData[key] && typeof formData[key] === 'string') {
      formData[key] = formData[key].toUpperCase();
    }
  }

  function validate() {
    try {
      schema.parse(formData);
      errors.value = {};
    } catch (e) {
      errors.value = e.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
    }
  }

  async function handleSubmit(submitFunction) {
    validate();
    if (Object.keys(errors.value).length > 0) {
      return;
    }
    isSubmitting.value = true;
    try {
      await submitFunction(formData);
    } catch (error) {
      httpError.value = error.message;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    httpError,
    trimData,
    toUpperCase,
    validate,
    handleSubmit,
  };
}
