<template>
    <div class="newsletter-management">
      <h2>Gestion des Newsletters</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>URL du PDF</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="newsletter in newsletters" :key="newsletter.id">
            <td>{{ newsletter.id }}</td>
            <td>{{ newsletter.pdfUrl }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const newsletters = ref([]);
  
  const fetchNewsletters = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/newsletters`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    if (response.ok) {
      newsletters.value = await response.json();
    } else {
      console.error('Erreur lors de la récupération des newsletters:', response.statusText);
    }
  };
  
  onMounted(fetchNewsletters);
  </script>
  
  <style scoped>
  .newsletter-management {
    padding: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }
  </style>
  