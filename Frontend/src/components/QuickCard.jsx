import React from "react";

export default function QuickCard({ emoji, title, subtitle, onClick }) {
  return (
    <div className="bg-white p-6 rounded-xl card-shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="text-center">
        <div className="text-4xl mb-4">{emoji}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
