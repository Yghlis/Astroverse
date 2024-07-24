import fetch from 'node-fetch';
import { strict as assert } from 'assert';
import FormData from 'form-data';
import fs from 'fs';

const serverUrl = 'http://localhost:8000'; // Replace with your server URL

const getAuthToken = async () => {
  try {
    console.log('Sending request to:', `${serverUrl}/auth/login`);
    const res = await fetch(`${serverUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'Ghlisyouri@gmail.com', // Replace with your email
        password: 'Retter1998!!', // Replace with your password
      }),
    });

    const data = await res.json();
    console.log('Auth Token:', data.token); // Verify the token is correct
    return data.token; // Adjust based on your response structure
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
    formData.append('character', 'Test Character');
    formData.append('universe', 'Test Universe');
    formData.append('availability_status', 'available');
    formData.append('views_count', '0');
    formData.append('image_preview', fs.createReadStream('/path/to/your/image.jpg')); // Ensure the image path is correct

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
