"use client"

import React from "react";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

export default function VendorProfilePage() {
  const products = new Array(10).fill(0).map((_, i) => ({
    id: i + 1,
    title: "Conjunto Cadeiras e mesas",
    price: "R$ 150,00",
    city: "Recife, PE",
    image: "/chair-yellow.jpg",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <main className="w-full max-w-[1200px] mx-auto px-6 py-10">
        {/* Profile card */}
        <section className="relative bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <div className="flex gap-6 items-center">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-full flex items-center justify-center">
                {/* placeholder avatar */}
                <img
                  src="/avatar-placeholder.png"
                  alt="avatar"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            </div>

            {/* Main info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Rogerio dos Santos</h2>

                  <div className="mt-2 text-sm text-gray-600 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FiMapPin /> <span>Caís, Rio Formoso - PE</span>
                    </span>

                    <span className="flex items-center gap-1 text-green-600">
                      <FaCheckCircle /> <span className="ml-1">Vendedor verificado</span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-semibold mr-2">Categorias</span>
                    <div className="flex gap-2">
                      <button className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">Infantil</button>
                      <button className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">Heróis</button>
                      <button className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">Desenhos</button>
                    </div>
                  </div>
                </div>

                {/* Action buttons on the right */}
                <div className="flex flex-col gap-4 items-end">
                  <button className="flex items-center gap-2 border border-pink-400 text-pink-500 rounded-full px-4 py-2 text-sm bg-white">
                    <span className="w-4 h-4 bg-pink-100 rounded-full flex items-center justify-center">💬</span>
                    Chat com o vendedor
                  </button>

                  <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm bg-white">
                    <FiClock /> Horários
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos para pronta entrega */}
        <section className="mt-10">
          <h3 className="text-lg font-bold mb-4">Produtos para pronta entrega</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((p) => (
              <article key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-medium mb-2">{p.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{p.price}</span>
                    <span className="flex items-center gap-1"><FiMapPin /> {p.city}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
