import { ref } from 'vue';

const flashMessage = ref('');
const flashMessageType = ref('info'); // Types: 'success', 'error', 'warning', 'info'
const flashMessageActive = ref(false);

function setFlashMessage(message, type = 'info') {
    flashMessage.value = message;
    flashMessageType.value = type;
    flashMessageActive.value = true;

    setTimeout(() => {
        flashMessage.value = '';
        flashMessageType.value = 'info'; // Reset to default type
        flashMessageActive.value = false;
    }, 3000);
}

function clearFlashMessage() {
    flashMessage.value = '';
    flashMessageType.value = 'info'; // Reset to default type
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
