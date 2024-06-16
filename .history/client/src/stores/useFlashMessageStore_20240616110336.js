import { ref } from 'vue';

const flashMessage = ref('');
const flashMessageActive = ref(false);

function setFlashMessage(message) {
    flashMessage.value = message;
    flashMessageActive.value = true;

    // Désactiver le message et effacer le texte après 3 secondes
    setTimeout(() => {
        flashMessage.value = ''; // Ajoutez cette ligne pour effacer également le texte du message
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
