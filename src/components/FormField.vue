<template>
  <label class="form-field" :class="{ 'form-field--invalid': invalid }">
    <input 
      class="form-field__input" 
      type="text" 
      v-model="inputString"
    >
  </label>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  const props= defineProps<{
    modelValue?: string,
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'invalid'): void
    (e: 'input'): void
  }>();

  const invalid = ref<boolean>(false);
  const inputString = ref<string>('');

  inputString.value = props.modelValue || '';

  const isValid = (value:string):boolean => {
    return !!value.length && /^-{0,1}[0-9]{1,}[,.]{0,1}[0-9]{0,}$/.test(value.toString()) && !/^-{0,1}0{1}[0-9]{1,}$/.test(value.toString());
  };

  watch(inputString, () => {
    const isValidNow = isValid(String(inputString.value));
    inputString.value = inputString.value.replace(',', '.')
    if (isValidNow) {
      if (inputString.value[inputString.value.length - 1] != '.') {
        emit('update:modelValue', inputString.value);
      } else {
        emit('update:modelValue', inputString.value.replace('.', ''));
      }

      emit('input');
    } else {
      emit('invalid');
    }
    invalid.value = !isValidNow;
  });

  watch(() => props.modelValue, () => {
    inputString.value = props.modelValue || '';
  });
</script>

<style lang="scss" scoped>
  .form-field {
    display: block;

    &--invalid &__input {
      border-color: red;
      outline-color: red;
      color: red;
    }

    &__input {
      width: 100%;
      border-radius: 5px;
      padding: 5px 10px;
      font-family: Arial, Helvetica, sans-serif;
      border: 1px solid #000;

      &--textarea {
        resize: vertical;
        min-height: 50px;
        font-family: Arial, Helvetica, sans-serif;
      }
    }
  }
</style>