// src/stores/useFlashMessageStore.js
import { ref } from 'vue';

const flashMessage = ref('');
const flashMessageActive = ref(false);

function setFlashMessage(message) {
    flashMessage.value = message;
    flashMessageActive.value = true;

    // Désactiver le message après 3 secondes
    setTimeout(() => {
        flashMessageActive.value = false;
    }, 3000);
}

function clearFlashMessage() {
    flashMessage.value = '';
    flashMessageActive.value = false;
}

export default function useFlashMessageStore() {
    return {
        flashMessage,
        flashMessageActive,
        setFlashMessage,
        clearFlashMessage
    }
}
