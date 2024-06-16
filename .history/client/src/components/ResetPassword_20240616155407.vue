
  
  <script setup>
  import { reactive, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const state = reactive({
    newPassword: '',
    confirmPassword: '',
    token: route.params.token,
    tokenValid: false,
    errorMessage: 'Le token est invalide ou a expiré.',
    passwordStrength: {
      message: '',
      color: ''
    }
  });
  
  const evaluatePassword = () => {
    const strength = getPasswordStrength(state.newPassword);
    if (strength < 4 || state.newPassword.length < 12) {
      state.passwordStrength.message = 'Faible';
      state.passwordStrength.color = 'red';
    } else if (strength === 4 || state.newPassword.length >= 12) {
      state.passwordStrength.message = 'Moyenne';
      state.passwordStrength.color = 'orange';
    } else if (strength > 4 && state.newPassword.length >= 16) {
      state.passwordStrength.message = 'Bonne';
      state.passwordStrength.color = 'green';
    }
  };
  
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[\W]/)) strength++;
    return strength;
  };
  
  watch(() => state.newPassword, evaluatePassword);
  
  onMounted(() => {
    verifyToken();
  });
  </script>
  