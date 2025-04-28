const API_URL = import.meta.env.VITE_API_URL;

export async function rateProduct(productId: number, rating: number, token: string) {
  const response = await fetch(`${API_URL}/products/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId: productId.toString(), rating }),
  });

  if (!response.ok) {
    throw new Error('Failed to rate product');
  }
  return response.json();
}
