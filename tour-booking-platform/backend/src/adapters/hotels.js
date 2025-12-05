// Simple adapter to call a hotel API (stub)
module.exports = {
  searchHotels: async (params) => {
    // TODO: call real API and normalize response
    return [{id: 'h1', price: 12000, currency: 'USD', rooms: 3, meta: {}}];
  }
}
