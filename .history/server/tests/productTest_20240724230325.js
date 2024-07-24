import fetch from 'node-fetch';
import { strict as assert } from 'assert';
import FormData from 'form-data';

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

const createUniverse = async (authToken, uniqueSuffix) => {
  try {
    const response = await fetch(`${serverUrl}/universes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `Test Universe ${uniqueSuffix}` }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 201);
    console.log('Universe créé:', data);
    return data.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'univers:', error);
  }
};

const createCharacter = async (authToken, universeId, uniqueSuffix) => {
  try {
    const response = await fetch(`${serverUrl}/characters`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Test Character ${uniqueSuffix}`,
        universe: universeId,
      }),
    });

    const data = await response.json();
    assert.strictEqual(response.status, 201);
    console.log('Personnage créé:', data);
    return data.id;
  } catch (error) {
    console.error('Erreur lors de la création du personnage:', error);
  }
};

const runTests = async () => {
  let successfulTests = 0;
  const totalTests = 3; // Nombre total de tests

  const authToken = await getAuthToken();
  if (!authToken) {
    console.error('Échec de la récupération du token d\'authentification');
    return;
  }

  // Test de fonctionnement de base
  try {
    assert.strictEqual(true, true);
    console.log('Test "Jest is working" réussi');
    successfulTests++;
  } catch (error) {
    console.error('Test "Jest is working" échoué:', error);
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
    console.log('Données de réponse:', data);
    console.log('Test "GET /products" réussi');
    successfulTests++;
  } catch (error) {
    console.error('Test "GET /products" échoué:', error);
  }

  // Créer Universe et Character pour la création de produit
  const uniqueSuffix = Date.now();
  const universeId = await createUniverse(authToken, uniqueSuffix);
  if (!universeId) {
    console.error('Échec de la création de l\'univers');
    return;
  } else {
    successfulTests++;
  }

  const characterId = await createCharacter(authToken, universeId, uniqueSuffix);
  if (!characterId) {
    console.error('Échec de la création du personnage');
    return;
  } else {
    successfulTests++;
  }

  // Récapitulatif des tests
  console.log(`\n${successfulTests} tests réussis sur ${totalTests} :`);
  console.log('1. Test "Jest is working"');
  console.log('2. Test "GET /products"');
  console.log('3. Test création d\'universe');
};

runTests();
