// src/utils/auth.js
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import router from "../router";
import { useSidebarStore } from "../stores/sidebarStore";
import useFlashMessageStore from "../composables/useFlashMessageStore";



// Fonction pour vérifier si le token est expiré
export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // En secondes
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // Si le token est invalide, considérer comme expiré
  }
}

// Décoder le JWT et stocker le rôle dès que l'app est chargée
export function decodeAndStoreRole() {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decoded = jwtDecode(token);
    localStorage.setItem("role", decoded.role);
  }
}

// Vérification et stockage du sessionId
export function checkAndStoreSessionId() {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    const newSessionId = uuidv4();
    localStorage.setItem("sessionId", newSessionId);
    console.log("Generated new session ID:", newSessionId);
  } else {
    console.log("Session ID already exists:", sessionId);
  }
}

// Planifier la déconnexion
export function scheduleLogout(expirationTime) {
  const currentTime = Date.now() / 1000; // En secondes
  const timeout = (expirationTime - currentTime) * 1000; // Convertir en millisecondes
  console.log("Token will expire in", timeout, "milliseconds");
  const sidebarStore = useSidebarStore();
  setTimeout(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    sidebarStore.toggleUserSidebar();
    router.push("/"); // Rediriger vers la page d'accueil ou de connexion
    useFlashMessageStore().setFlashMessage("Votre session a expiré.", "error");
  }, timeout);
}

// Initialisation
export function initializeAuth() {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decoded = jwtDecode(token);
    decodeAndStoreRole();
    checkAndStoreSessionId();
    scheduleLogout(decoded.exp);
  }
}
