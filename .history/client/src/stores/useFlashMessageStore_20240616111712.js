import { ref } from 'vue';

const flashMessage = ref('');
const flashMessageType = ref(''); // Ajout du type de message ('success' ou 'error')
const flashMessageActive = ref(false);

function setFlashMessage(message, type = 'success') {
    flashMessage.value = message;
    flashMessageType.value = type; // Stocker le type de message
    flashMessageActive.value = true;

    setTimeout(() => {
        flashMessage.value = '';
        flashMessageType.value = ''; // Effacer également le type du message
        flashMessageActive.value = false;
    }, 3000);
}

function clearFlashMessage() {
    flashMessage.value = '';
    flashMessageType.value = ''; // S'assurer de nettoyer le type aussi
    flashMessageActive.value = false;
}

export default function useFlashMessageStore() {
    return {
        flashMessage,
        flashMessageType,
        flashMessageActive,
        setFlashMessage,
        clearFlashMessage
    }
}
