"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Metrics {
  revenue: number;
  orderCount: number;
  averageTicket: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:3001/dashboard/metrics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      {loading || !metrics ? (
        <div className="text-gray-700">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow-lg p-6 flex flex-col items-center border border-green-200">
            <div className="mb-2 text-4xl text-green-500">
              <svg
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 22c5.421 0 10-4.579 10-10s-4.579-10-10-10-10 4.579-10 10 4.579 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm1 13v-2h2v-2h-2v-2h2v-2h-2v-2h-2v2h-2v2h2v2h-2v2h2v2h2z" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Faturamento do Dia
            </div>
            <div className="text-3xl font-bold text-green-700 mt-2">
              R$ {metrics.revenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-200">
            <div className="mb-2 text-4xl text-blue-500">
              <svg
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Pedidos do Dia
            </div>
            <div className="text-3xl font-bold text-blue-700 mt-2">
              {metrics.orderCount}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow-lg p-6 flex flex-col items-center border border-purple-200">
            <div className="mb-2 text-4xl text-purple-500">
              <svg
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 22c5.421 0 10-4.579 10-10s-4.579-10-10-10-10 4.579-10 10 4.579 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm1 13v-2h2v-2h-2v-2h2v-2h-2v-2h-2v2h-2v2h2v2h-2v2h2v2h2z" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Ticket Médio
            </div>
            <div className="text-3xl font-bold text-purple-700 mt-2">
              R$ {metrics.averageTicket.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
