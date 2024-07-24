import fetch from 'node-fetch';
import { strict as assert } from 'assert';

const serverUrl = 'http://localhost:8000';
const sessionId = 'test-session-id';
const productId = '6aa4ec6f-b9b7-4b11-a9ea-df3bb867e712'; 

const getAuthToken = async () => {
  try {
    console.log('Envoi de la requête à:', `${serverUrl}/auth/login`);
    const res = await fetch(`${serverUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'Ghlisyouri@gmail.com', 
        password: 'Retter1998!!', 
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
  const totalTests = 6; // Nombre total de tests

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

  // Test POST /basket (ajouter deux fois)
  try {
    // Premier ajout
    let response = await fetch(`${serverUrl}/basket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session-id': sessionId,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    let data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Premier ajout au panier:', data);

    // Deuxième ajout
    response = await fetch(`${serverUrl}/basket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session-id': sessionId,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Deuxième ajout au panier:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "POST /basket" échoué - PAS BON:', error);
  }

  // Test GET /basket
  try {
    const response = await fetch(`${serverUrl}/basket`, {
      method: 'GET',
      headers: {
        'session-id': sessionId,
      },
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Données du panier:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "GET /basket" échoué - PAS BON:', error);
  }

  // Test GET /basket/check-items
  try {
    const response = await fetch(`${serverUrl}/basket/check-items`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'session-id': sessionId,
      },
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Vérification des articles du panier:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "GET /basket/check-items" échoué - PAS BON:', error);
  }

  // Test POST /basket/decrement
  try {
    const response = await fetch(`${serverUrl}/basket/decrement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session-id': sessionId,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Produit décrémenté du panier:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "POST /basket/decrement" échoué - PAS BON:', error);
  }

  // Test DELETE /basket
  try {
    const response = await fetch(`${serverUrl}/basket`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'session-id': sessionId,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 200);
    console.log('Produit supprimé du panier:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "DELETE /basket" échoué - PAS BON:', error);
  }

  // Récapitulatif des tests
  console.log(`\n${successfulTests} tests réussis sur ${totalTests} :`);
  console.log(`1. Test "Jest is working" - ${successfulTests >= 1 ? 'BON' : 'PAS BON'}`);
  console.log(`2. Test "POST /basket" - ${successfulTests >= 2 ? 'BON' : 'PAS BON'}`);
  console.log(`3. Test "GET /basket" - ${successfulTests >= 3 ? 'BON' : 'PAS BON'}`);
  console.log(`4. Test "GET /basket/check-items" - ${successfulTests >= 4 ? 'BON' : 'PAS BON'}`);
  console.log(`5. Test "POST /basket/decrement" - ${successfulTests >= 5 ? 'BON' : 'PAS BON'}`);
  console.log(`6. Test "DELETE /basket" - ${successfulTests >= 6 ? 'BON' : 'PAS BON'}`);
};

runTests();
