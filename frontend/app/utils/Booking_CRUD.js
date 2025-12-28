const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:5000/api';

export const createBooking = async (bookingData, token) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });

  // Try to parse JSON, but fallback to text for non-JSON error bodies
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // leave data as null
  }

  if (!response.ok) {
    const msg = (data && data.message) || text || `Request failed with status ${response.status}`;
    throw new Error(msg);
  }

  return data;
};

export const getMyBookings = async (token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
      // attempt to read message
      const text = await response.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch(e) {}
      const msg = (data && data.message) || text || `Failed to fetch bookings (status ${response.status})`;
      throw new Error(msg);
    }

    return await response.json();
}
