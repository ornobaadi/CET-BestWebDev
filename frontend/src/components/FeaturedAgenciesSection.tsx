'use client';

import Link from 'next/link';
import Image from 'next/image';
import StarRating from './StarRating'; // Import StarRating component
import { Agency } from '../../../backend/src/types/Agency'; // Adjust the import path as necessary

interface FeaturedAgenciesSectionProps {
  agencies: Agency[];
}

export default function FeaturedAgenciesSection({ agencies }: FeaturedAgenciesSectionProps) {
  // Filter the agencies by categories
  const developmentAgencies = agencies.filter((agency) => agency.category === 'Development').slice(0, 3);
  const itServicesAgencies = agencies.filter((agency) => agency.category === 'IT Services').slice(0, 3);
  const marketingAgencies = agencies.filter((agency) => agency.category === 'Marketing').slice(0, 3);

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Featured Agencies</h2>

        {/* Development Agencies */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Development</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {developmentAgencies.map((agency) => (
              <Link key={agency._id} href={`/agencies/${agency._id}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer">
                  {agency.image && (
                    <Image
                      src={`http://localhost:5000/${agency.image}`}
                      alt={`${agency.name} logo`}
                      
                      width={300}
                      height={150}
                      className="mb-4 w-[500px] h-[450px] object-cover"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{agency.name}</h3>
                  <StarRating rating={agency.rating} />
                  <p className="text-sm text-gray-600 mb-4">Growing Brands Online</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{agency.location}</span>
                    <span>{agency.rate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* IT Services Agencies */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">IT Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {itServicesAgencies.map((agency) => (
              <Link key={agency._id} href={`/agencies/${agency._id}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer">
                  {agency.image && (
                    <Image
                      src={`http://localhost:5000/${agency.image}`}
                      alt={`${agency.name} logo`}
                      width={300}
                      height={150}
                      className="mb-4 w-[500px] h-[450px] object-cover"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{agency.name}</h3>
                  <StarRating rating={agency.rating} />
                  <p className="text-sm text-gray-600 mb-4">Growing Brands Online</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{agency.location}</span>
                    <span>{agency.rate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Marketing Agencies */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Marketing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketingAgencies.map((agency) => (
              <Link key={agency._id} href={`/agencies/${agency._id}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer">
                  {agency.image && (
                    <Image
                      src={`http://localhost:5000/${agency.image}`}
                      alt={`${agency.name} logo`}
                      width={300}
                      height={150}
                      className="mb-4 w-[500px] h-[450px] object-cover"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{agency.name}</h3>
                  <StarRating rating={agency.rating} />
                  <p className="text-sm text-gray-600 mb-4">Growing Brands Online</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{agency.location}</span>
                    <span>{agency.rate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
