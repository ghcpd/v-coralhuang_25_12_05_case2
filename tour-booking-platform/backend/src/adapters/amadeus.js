// Simple adapter to call Amadeus or other flight APIs (stub)
module.exports = {
  searchFlights: async (params) => {
    // TODO: call real API and normalize response
    return [{id: 'f1', price: 20000, currency: 'USD', seats: 5, meta: {}}];
  }
}
