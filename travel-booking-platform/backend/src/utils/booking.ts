import axios from 'axios';

const bookingClient = axios.create({
  baseURL: 'https://api.booking.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.BOOKING_API_KEY}`,
  },
});

export const searchAccommodations = async (searchParams: {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) => {
  try {
    const response = await bookingClient.get('/properties', {
      params: {
        location: searchParams.location,
        checkin: searchParams.checkIn,
        checkout: searchParams.checkOut,
        guests: searchParams.guests,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Booking API error:', error);
    throw error;
  }
};

export const getAccommodationDetails = async (propertyId: string) => {
  try {
    return await bookingClient.get(`/properties/${propertyId}`);
  } catch (error) {
    console.error('Booking API error:', error);
    throw error;
  }
};
