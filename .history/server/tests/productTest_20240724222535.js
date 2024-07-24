import fetch from 'node-fetch';
import { strict as assert } from 'assert';

const serverUrl = 'http://localhost:8000'; // Remplacez par l'URL de votre serveur

const getAuthToken = async () => {
  try {
    const res = await fetch(`${serverUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'Ghlisyouri@gmail.com', // Remplacez par votre email
        password: 'Retter1998!!', // Remplacez par votre mot de passe
      }),
    });

    const data = await res.json();
    console.log('Auth Token:', data.token); // Vérifiez que le token est correct
    return data.token; // Ajustez selon la structure de votre réponse
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
};

const runTests = async () => {
  const authToken = await getAuthToken();
  if (!authToken) {
    console.error('Failed to get auth token');
    return;
  }

  // Test de fonctionnement de base
  try {
    assert.strictEqual(true, true);
    console.log('Test "Jest is working" passed');
  } catch (error) {
    console.error('Test "Jest is working" failed:', error);
  }

  // Test GET /products
  try {
    const response = await fetch(`${serverUrl}/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Response data:', data);
    console.log('Test "GET /products" passed');
  } catch (error) {
    console.error('Test "GET /products" failed:', error);
  }
};

runTests();
