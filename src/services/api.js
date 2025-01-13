const API_URL = 'http://localhost:4000/api';

export async function fetchClothes() {
  const response = await fetch(`${API_URL}/clothes`);
  return response.json();
}

export async function addClothingItem(item) {
  const response = await fetch(`${API_URL}/clothes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });
  return response.json();
}

export async function updateClothingItem(id, updates) {
  const response = await fetch(`${API_URL}/clothes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return response.json();
}

export async function deleteClothingItem(id) {
  const response = await fetch(`${API_URL}/clothes/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}
