import fetch from 'node-fetch';
import { strict as assert } from 'assert';

const serverUrl = 'http://localhost:8000'; // Remplacez par l'URL de votre serveur

const getAuthToken = async () => {
  try {
    console.log('Envoi de la requête à:', `${serverUrl}/auth/login`);
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
    console.error('Erreur lors de la récupération du token d\'authentification:', error);
  }
};

const runTests = async () => {
  let successfulTests = 0;
  const totalTests = 4; // Nombre total de tests

  const authToken = await getAuthToken();
  if (!authToken) {
    console.error('Échec de la récupération du token d\'authentification');
    return;
  }

  // Test de fonctionnement de base
  try {
    assert.strictEqual(true, true);
    console.log('Test "Jest is working" réussi - BON');
    successfulTests++;
  } catch (error) {
    console.error('Test "Jest is working" échoué - PAS BON:', error);
  }

  // Test POST /users
  let userId;
  try {
    const response = await fetch(`${serverUrl}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'Test',
        last_name: 'User',
        email: `test.user.${Date.now()}@example.com`,
        password_hash: 'TestPassword123!',
        phone_number: '1234567890',
        address: {
          street: '123 Test St',
          city: 'Testville',
          postal_code: '12345',
          country: 'Testland'
        }
      }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 201);
    console.log('Utilisateur créé:', data);
    userId = data.user_id;
    successfulTests++;
  } catch (error) {
    console.error('Test "POST /users" échoué - PAS BON:', error);
  }

  // Test GET /users/:id
  try {
    const response = await fetch(`${serverUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Données de l\'utilisateur:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "GET /users/:id" échoué - PAS BON:', error);
  }

  // Test PUT /users/:id
  try {
    const response = await fetch(`${serverUrl}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'Updated',
        last_name: 'User',
      }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Utilisateur mis à jour:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "PUT /users/:id" échoué - PAS BON:', error);
  }

  // Test DELETE /users/:id
  try {
    const response = await fetch(`${serverUrl}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    assert.strictEqual(response.status, 200);
    console.log('Utilisateur supprimé - BON');
    successfulTests++;
  } catch (error) {
    console.error('Test "DELETE /users/:id" échoué - PAS BON:', error);
  }

  // Récapitulatif des tests
  console.log(`\n${successfulTests} tests réussis sur ${totalTests} :`);
  console.log(`1. Test "Jest is working" - ${successfulTests >= 1 ? 'BON' : 'PAS BON'}`);
  console.log(`2. Test "POST /users" - ${successfulTests >= 2 ? 'BON' : 'PAS BON'}`);
  console.log(`3. Test "GET /users/:id" - ${successfulTests >= 3 ? 'BON' : 'PAS BON'}`);
  console.log(`4. Test "PUT /users/:id" - ${successfulTests >= 4 ? 'BON' : 'PAS BON'}`);
  console.log(`5. Test "DELETE /users/:id" - ${successfulTests >= 5 ? 'BON' : 'PAS BON'}`);
};

runTests();
