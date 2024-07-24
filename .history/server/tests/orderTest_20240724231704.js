import fetch from 'node-fetch';
import { strict as assert } from 'assert';

const serverUrl = 'http://localhost:8000'; // Remplacez par l'URL de votre serveur
const sessionId = 'test-session-id';
const productId = '3bf1ffab-fe4b-4e5b-8c67-5948a264c22a'; // ID du produit Ichigoat

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

  // Test POST /basket (ajouter un produit au panier)
  try {
    const response = await fetch(`${serverUrl}/basket`, {
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
    console.log('Produit ajouté au panier:', data);
    successfulTests++;
  } catch (error) {
    console.error('Test "POST /basket" échoué - PAS BON:', error);
  }

  // Test POST /orders (créer une commande à partir du panier)
  try {
    const orderResponse = await fetch(`${serverUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'session-id': sessionId,
      },
      body: JSON.stringify({
        shippingAddress: '123 Test St, Test City',
        billingAddress: '123 Test St, Test City',
        saveAddress: false,
      }),
    });

    const orderData = await orderResponse.json();
    assert.strictEqual(orderResponse.status, 201);
    console.log('Commande créée:', orderData);
    successfulTests++;
  } catch (error) {
    console.error('Test "POST /orders" échoué - PAS BON:', error);
  }

  // Test GET /orders/:orderId (récupérer une commande par ID)
  try {
    // Supposons que l'ID de la commande est retourné dans orderData.orderId
    const orderId = orderData.orderId;
    const getOrderResponse = await fetch(`${serverUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const getOrderData = await getOrderResponse.json();
    assert.strictEqual(getOrderResponse.status, 200);
    console.log('Détails de la commande:', getOrderData);
    successfulTests++;
  } catch (error) {
    console.error('Test "GET /orders/:orderId" échoué - PAS BON:', error);
  }

  // Récapitulatif des tests
  console.log(`\n${successfulTests} tests réussis sur ${totalTests} :`);
  console.log(`1. Test "Jest is working" - ${successfulTests >= 1 ? 'BON' : 'PAS BON'}`);
  console.log(`2. Test "POST /basket" - ${successfulTests >= 2 ? 'BON' : 'PAS BON'}`);
  console.log(`3. Test "POST /orders" - ${successfulTests >= 3 ? 'BON' : 'PAS BON'}`);
  console.log(`4. Test "GET /orders/:orderId" - ${successfulTests >= 4 ? 'BON' : 'PAS BON'}`);
};

runTests();
