<template>
    <div class="newsletter-management">
      <h2>Gestion des Newsletters</h2>
      <input type="file" @change="handleFileChange" />
      <button @click="uploadNewsletter">Valider et lancer l'upload</button>
      <button @click="downloadCurrentNewsletter">Télécharger la newsletter actuelle</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const selectedFile = ref(null);
  
  const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  const uploadNewsletter = async () => {
    if (!selectedFile.value) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }
  
    const apiUrl = import.meta.env.VITE_API_URL;
    const formData = new FormData();
    formData.append('pdf', selectedFile.value);
    console.log
  
    try {
      const response = await fetch(`${apiUrl}/newsletters`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
  
      alert("Newsletter uploadée avec succès !");
    } catch (error) {
      console.error('Erreur lors de l\'upload de la newsletter:', error);
      alert("Erreur lors de l'upload de la newsletter.");
    }
  };
  
  const downloadCurrentNewsletter = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  
    try {
      const response = await fetch(`${apiUrl}/newsletters/current`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newsletter.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la newsletter actuelle:', error);
      alert("Erreur lors du téléchargement de la newsletter actuelle.");
    }
  };
  </script>
  
  <style scoped>
  .newsletter-management {
    padding: 20px;
  }
  
  button {
    margin: 10px 0;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  
  input[type="file"] {
    margin-bottom: 10px;
  }
  </style>
  