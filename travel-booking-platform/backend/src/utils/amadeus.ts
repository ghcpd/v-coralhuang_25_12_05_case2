import axios from 'axios';

const amadeusClient = axios.create({
  baseURL: 'https://api.amadeus.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.AMADEUS_API_KEY}`,
  },
});

export const searchFlights = async (searchParams: {
  origin: string;
  destination: string;
  departDate: string;
  passengers: number;
}) => {
  try {
    const response = await amadeusClient.get('/shopping/flight-offers', {
      params: {
        originLocationCode: searchParams.origin,
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departDate,
        adults: searchParams.passengers,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Amadeus API error:', error);
    throw error;
  }
};

export const getFlightDetails = async (flightId: string) => {
  try {
    return await amadeusClient.get(`/shopping/flight-offers/${flightId}`);
  } catch (error) {
    console.error('Amadeus API error:', error);
    throw error;
  }
};
