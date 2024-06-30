<script setup>
import { ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import useFlashMessageStore from '@stores/useFlashMessageStore';

const { flashMessage, flashMessageType, setFlashMessage } = useFlashMessageStore();
const userLoggedIn = ref(false);
const loginClicked = ref(false);
const passwordResetRequested = ref(false);
const userEmail = ref('');
const userPassword = ref('');
const errorMessage = ref('');
const router = useRouter();

watch(flashMessage, (newVal, oldVal) => {
  console.log("Flash message updated:", newVal);
});

const loginHandler = async () => {
  loginClicked.value = true;  
  if (!userEmail.value || !userPassword.value) {
    setFlashMessage('Veuillez entrer une adresse e-mail et un mot de passe.', 'error');
    return;
  }
  console.log('Tentative de connexion avec:', userEmail.value, userPassword.value);

  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail.value, password: userPassword.value })
    });

    console.log('Réponse de l\'API:', response);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (data.mustChangePassword) {
        localStorage.setItem('jwt', data.token); // Stockez le token pour l'accès
        router.push({ name: 'ChangePassword', params: { userId: data.userId, token: data.token } });
      } else {
        localStorage.setItem('jwt', data.token);
        userLoggedIn.value = true;
        setFlashMessage('Connexion réussie ! Bienvenue.');
      }
    } else {
      const errorData = await response.json();
      setFlashMessage(errorData.message || 'Erreur de connexion');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    setFlashMessage('Erreur lors de la connexion', 'error');
  }
};

const logoutHandler = () => {
  localStorage.removeItem('jwt');
  userLoggedIn.value = false;
  setFlashMessage('Déconnexion réussie.');
  setTimeout(() => flashMessage.value = '', 3000); // Cache le message après 3 secondes
};

const forgotPassword = () => {
  passwordResetRequested.value = true;
};

const sendResetEmail = async () => {
  if (!userEmail.value) {
    setFlashMessage('Veuillez entrer votre email.');
    return;
  }

  const response = await fetch('http://localhost:8000/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail.value })
  });

  if (response.ok) {
    setFlashMessage('Un email de réinitialisation a été envoyé si votre email est enregistré.');
    passwordResetRequested.value = false;
    setTimeout(() => flashMessage.value = '', 3000); // Cache le message après 3 secondes
  } else {
    const errorData = await response.json();
    setFlashMessage(errorData.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.');
    setTimeout(() => flashMessage.value = '', 3000); // Cache le message après 3 secondes
  }
};

const returnToLogin = () => {
  loginClicked.value = false;
  passwordResetRequested.value = false;
};

const returnToInitial = () => {
  loginClicked.value = false;
  passwordResetRequested.value = false;
};

const checkLoginStatus = () => {
  userLoggedIn.value = !!localStorage.getItem('jwt');
};

checkLoginStatus();
</script>
