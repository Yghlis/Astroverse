import fetch from 'node-fetch';
import { strict as assert } from 'assert';
import FormData from 'form-data';

const serverUrl = 'http://localhost:8000'; // Remplacez par l'URL de votre serveur

const getAuthToken = async () => {
  try {
    console.log('Sending request to:', `${serverUrl}/auth/login`);
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

const createUniverse = async (authToken) => {
  try {
    const response = await fetch(`${serverUrl}/universes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Test Universe' }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 201);
    console.log('Universe created:', data);
    return data.id;
  } catch (error) {
    console.error('Error creating universe:', error);
  }
};

const createCharacter = async (authToken, universeId) => {
  try {
    const response = await fetch(`${serverUrl}/characters`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Character',
        universe: universeId,
      }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 201);
    console.log('Character created:', data);
    return data.id;
  } catch (error) {
    console.error('Error creating character:', error);
  }
};

const runTests = async () => {
  const authToken = await getAuthToken();
  if (!authToken) {
    console.error('Failed to get auth token');
    return;
  }

  // Basic functionality test
  try {
    assert.strictEqual(true, true);
    console.log('Test "Jest is working" passed');
  } catch (error) {
    console.error('Test "Jest is working" failed:', error);
  }

  // GET /products test
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

  // Create Universe and Character for Product creation
  const universeId = await createUniverse(authToken);
  if (!universeId) {
    console.error('Failed to create universe');
    return;
  }

  const characterId = await createCharacter(authToken, universeId);
  if (!characterId) {
    console.error('Failed to create character');
    return;
  }

  // POST /products test
  try {
    const formData = new FormData();
    formData.append('title', 'Test Product');
    formData.append('brand', 'Test Brand');
    formData.append('price', '100');
    formData.append('discounted_price', '80');
    formData.append('is_promotion', 'false');
    formData.append('description', 'Test description');
    formData.append('stock', '10');
    formData.append('character', characterId);
    formData.append('universe', universeId);
    formData.append('availability_status', 'available');
    formData.append('views_count', '0');
    formData.append('image_preview', ''); // Champ image_preview vide
    formData.append('image_gallery', ''); // Champ image_gallery vide

    const response = await fetch(`${serverUrl}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    assert.strictEqual(response.status, 201);
    console.log('Response data:', data);
    console.log('Test "POST /products" passed');
  } catch (error) {
    console.error('Test "POST /products" failed:', error);
  }
};

runTests();
