<template>
    <div class="newsletter-management">
      <h2>Gestion des Newsletters</h2>
      <input type="file" @change="handleFileChange" />
      <button @click="uploadNewsletter">Valider et lancer l'upload</button>
      <button @click="downloadCurrentNewsletter">Télécharger la newsletter actuelle</button>
      
      <!-- Tableau des utilisateurs abonnés à la newsletter -->
      <div class="tab-container">
        <h1>Utilisateurs Abonnés à la Newsletter</h1>
        <table>
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in subscribedUsers" :key="user.email">
              <td>{{ user.first_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const selectedFile = ref(null);
  const subscribedUsers = ref([]);
  
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
    try {
      const response = await fetch(`${apiUrl}/newsletter`, {
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
      const response = await fetch(`${apiUrl}/newsletter/current`, {
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
  
  const fetchSubscribedUsers = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  
    try {
      const response = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
  
      const users = await response.json();
      subscribedUsers.value = users.filter(user => user.isSubscribedToNewsletter);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs abonnés:', error);
      alert("Erreur lors de la récupération des utilisateurs abonnés.");
    }
  };
  
  onMounted(() => {
    fetchSubscribedUsers();
  });
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
  
  .tab-container {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    text-align: left;
  }
  
  thead {
    background-color: #f9fafc;
  }
  
  th, td {
    padding: 12px;
    border: 1px solid #e5e8ed;
  }
  
  th {
    cursor: pointer;
  }
  
  tbody tr:hover {
    background-color: #f1f3f5;
  }
  </style>
  