// src/app/development/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StarRating from '../../components/StarRating';

interface Agency {
  _id: string;
  name: string;
  location: string;
  teamSize: string;
  rate: string;
  description: string;
  image: string;
  rating: number;
  category: string;
}

export default function DevelopmentPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/agencies');
        if (!response.ok) {
          throw new Error('Failed to fetch agencies');
        }
        const data = await response.json();
        
        // Filter agencies by "Development" category on initial load
        const developmentAgencies = data.filter((agency: Agency) => agency.category === 'Development');
        
        setAgencies(developmentAgencies);
        setFilteredAgencies(developmentAgencies);
      } catch (error) {
        console.error('Error fetching agencies:', error);
        setError('Could not load agencies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  if (loading) {
    return <p className="text-center">Loading agencies...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
            {/* Optional: Add filter section if needed */}
          </div>
          <div className="w-full lg:w-3/4">
            <h2 className="text-3xl font-bold mb-8">Development Agencies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgencies.length > 0 ? (
                filteredAgencies.map((agency) => (
                  <Link key={agency._id} href={`/agencies/${agency._id}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer">
                      <Image
                        src={`http://localhost:5000/${agency.image}`}
                        alt={`${agency.name} logo`}
                        width={300}
                        height={150}
                        className="mb-4 w-[500px] h-[450px] object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/default-image.png';
                        }}
                        layout="responsive"
                      />
                      <h3 className="text-xl font-semibold mb-2">{agency.name}</h3>
                      <div className="flex items-center mb-2">
                        <StarRating rating={agency.rating} />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{agency.description || "Growing Brands Online"}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{agency.location}</span>
                        <span>{agency.rate}</span>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button className="bg-black text-white px-4 py-2 rounded">Visit Website</button>
                        <button className="bg-gray-300 text-black px-4 py-2 rounded">View Portfolio</button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No development agencies found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
