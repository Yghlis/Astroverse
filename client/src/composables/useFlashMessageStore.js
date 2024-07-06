import { ref } from 'vue';

const flashMessage = ref('');
const flashMessageType = ref('');
const flashMessageActive = ref(false);

function setFlashMessage(message, type = 'success') {
    flashMessage.value = message;
    flashMessageType.value = type;
    flashMessageActive.value = true;

    setTimeout(() => {
        flashMessage.value = '';
        flashMessageType.value = ''; 
        flashMessageActive.value = false;
    }, 3000);
}

function clearFlashMessage() {
    flashMessage.value = '';
    flashMessageType.value = ''; 
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
