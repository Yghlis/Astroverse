
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import router from "../router";
import { useSidebarStore } from "../stores/sidebarStore";
import useFlashMessageStore from "../composables/useFlashMessageStore";




export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime;
  } catch (error) {
    return true; 
  }
}


export function decodeAndStoreRole() {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decoded = jwtDecode(token);
    localStorage.setItem("role", decoded.role);
  }
}


export function checkAndStoreSessionId() {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    const newSessionId = uuidv4();
    localStorage.setItem("sessionId", newSessionId);

  } else {
   
  }
}


export function scheduleLogout(expirationTime) {
  const currentTime = Date.now() / 1000; 
  const timeout = (expirationTime - currentTime) * 1000; 
  const sidebarStore = useSidebarStore();
  setTimeout(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    sidebarStore.toggleUserSidebar();
    router.push("/"); 
    useFlashMessageStore().setFlashMessage("Votre session a expiré.", "error");
  }, timeout);
}


export function initializeAuth() {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decoded = jwtDecode(token);
    decodeAndStoreRole();
    checkAndStoreSessionId();
    scheduleLogout(decoded.exp);
  }
}
