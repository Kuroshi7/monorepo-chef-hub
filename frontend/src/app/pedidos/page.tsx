"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Pedido {
  id: number;
  status: string;
  total: string;
  paymentMethod: string;
  products: { name: string }[];
}

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:3001/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pedidos</h1>
      {loading ? (
        <div className="text-gray-700">Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">
                  Produtos
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">
                  Pagamento
                </th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr
                  key={pedido.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    <span className="block">
                      {pedido.products.map((p) => p.name).join(", ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        pedido.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : pedido.status === "Concluído"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle font-semibold">
                    R$ {pedido.total}
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    {pedido.paymentMethod}
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
