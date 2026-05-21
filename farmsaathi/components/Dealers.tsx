"use client";

import { MapPin, Phone, Award, ArrowUpRight } from "lucide-react";

interface DealersProps {
  activeLocation: string;
}

export default function Dealers({ activeLocation }: DealersProps) {
  const allDealers = [
    {
      name: "Syngenta Krishi Kendra - Kanpur Centro",
      location: "Kanpur Nagar, Uttar Pradesh",
      specialty: "Wheat & Mustard Specialized Procurement",
      phone: "+91 99887 76655",
      rating: "4.9 ★",
      status: "Authorized Platinum Dealer",
      badgeColor: "bg-green-100 text-green-800 border-green-200"
    },
    {
      name: "AgriCure Crop Solutions",
      location: "Kanpur Nagar, Uttar Pradesh",
      specialty: "Cereals & Local Mandi Logistical Sync",
      phone: "+91 98765 12345",
      rating: "4.7 ★",
      status: "Verified Buyer",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      name: "Syngenta Crop Shield Outlet",
      location: "Chennai, Tamil Nadu",
      specialty: "Rice Paddy & Tropical Crop Inputs",
      phone: "+91 91234 56789",
      rating: "4.8 ★",
      status: "Authorized Platinum Dealer",
      badgeColor: "bg-green-100 text-green-800 border-green-200"
    },
    {
      name: "Tamil Nadu Farmer Logistics & Trade Hub",
      location: "Chennai, Tamil Nadu",
      specialty: "High Moisture Crop Protection & Procurement",
      phone: "+91 94440 98765",
      rating: "4.6 ★",
      status: "State Verified Partner",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
    }
  ];

  const currentRegion = activeLocation === "Chennai" ? "Tamil Nadu" : "Uttar Pradesh";
  const filteredDealers = allDealers.filter(dealer => dealer.location.includes(currentRegion));

  return (
    <section id="dealers" className="py-24 px-6 bg-slate-50 border-t border-slate-100 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Market Connection Hub</span>
            <h2 className="text-4xl font-black text-slate-950 mt-2">
              Verified Marketplace Dealers
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl">
              Connect directly with authorized procurement partners in <strong className="text-green-700">{currentRegion}</strong> to lock down top-tier Mandi premiums for your harvest.
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700">{filteredDealers.length} Active Distributors Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDealers.map((dealer, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${dealer.badgeColor}`}>
                    {dealer.status}
                  </span>
                  <span className="text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    {dealer.rating}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors flex items-center gap-1">
                  {dealer.name}
                </h3>
                
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400" /> {dealer.location}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Procurement Specialty</p>
                  <p className="text-slate-800 font-medium text-sm mt-1 flex items-center gap-2">
                    <Award size={16} className="text-green-600" /> {dealer.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a 
                  href={`tel:${dealer.phone.replace(/\s+/g, '')}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={16} /> {dealer.phone}
                </a>
                <button className="bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-700 font-bold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1">
                  Secure Rate <ArrowUpRight size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}