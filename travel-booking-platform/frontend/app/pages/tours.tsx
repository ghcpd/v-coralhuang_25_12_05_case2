'use client';

import { tourService } from '../services/api';
import { useEffect, useState } from 'react';

interface Tour {
  id: string;
  title: string;
  destination: string;
  price: number;
  duration: number;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    destination: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await tourService.getAll();
      setTours(response.data.tours || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await tourService.search(searchFilters);
      setTours(response.data.tours || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Tours</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Destination"
            value={searchFilters.destination}
            onChange={(e) =>
              setSearchFilters({
                ...searchFilters,
                destination: e.target.value,
              })
            }
            className="form-input"
          />
          <input
            type="date"
            value={searchFilters.startDate}
            onChange={(e) =>
              setSearchFilters({
                ...searchFilters,
                startDate: e.target.value,
              })
            }
            className="form-input"
          />
          <input
            type="date"
            value={searchFilters.endDate}
            onChange={(e) =>
              setSearchFilters({
                ...searchFilters,
                endDate: e.target.value,
              })
            }
            className="form-input"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>

      {/* Tours List */}
      {loading ? (
        <p className="text-center">Loading tours...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="card hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-2">{tour.title}</h3>
              <p className="text-gray-600 mb-2">📍 {tour.destination}</p>
              <p className="text-gray-600 mb-2">📅 {tour.duration} days</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${tour.price}
              </p>
              <button className="btn-primary w-full">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
