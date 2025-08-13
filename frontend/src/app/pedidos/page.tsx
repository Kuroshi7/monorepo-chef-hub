"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Pedido {
  id: number;
  status: string;
  total: string;
  paymentMethod: string;
  products: { name: string }[];
}

const statusSchema = z.object({
  statusId: z
    .string()
    .min(1, "ID obrigatório")
    .refine((val) => /^\d+$/.test(val), { message: "ID deve ser numérico" }),
    novoStatus: z.string(),
});

type StatusForm = z.infer<typeof statusSchema>;

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: { statusId: "", novoStatus: "pendente" },
  });

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
      .then((data: Pedido[]) =>
        setPedidos(data.filter((pedido) => pedido.status !== "concluido"))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (data: { statusId: string; novoStatus: string }) => {
    setStatusMsg(null);
    const token = localStorage.getItem("jwt");
    if (!data.statusId || !data.novoStatus) {
      setStatusMsg("Preencha todos os campos.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3001/orders/${data.statusId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: data.novoStatus }),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar status");
      setStatusMsg("Status atualizado com sucesso!");
      setLoading(true);
      fetch("http://localhost:3001/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: Pedido[]) =>
          setPedidos(data.filter((pedido) => pedido.status !== "concluido"))
        )
        .finally(() => setLoading(false));
      reset();
    } catch {
      setStatusMsg("Falha ao atualizar status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Tem certeza que deseja cancelar o pedido #${id}?`)) {
      return;
    }

    setStatusMsg(null);
    const token = localStorage.getItem("jwt");

    try {
      const res = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao cancelar o pedido");

      setStatusMsg("Pedido cancelado com sucesso!");
      setPedidos((prevPedidos) => prevPedidos.filter((p) => p.id !== id));
    } catch {
      setStatusMsg("Falha ao cancelar o pedido.");
    }
  };

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
                  Senha
                </th>
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
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr
                  key={pedido.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 align-middle font-mono">
                    {pedido.id}
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    <span className="block">
                      {(() => {
                        const counts: Record<string, number> = {};
                        pedido.products.forEach((p) => {
                          counts[p.name] = (counts[p.name] || 0) + 1;
                        });
                        return Object.entries(counts)
                          .map(([name, qtd]) => `${name} x${qtd}`)
                          .join(", ");
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        pedido.status === "pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : pedido.status === "preparando"
                          ? "bg-blue-100 text-blue-800"
                          : pedido.status === "pronto"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pedido.status.charAt(0).toUpperCase() +
                        pedido.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle font-semibold">
                    R$ {pedido.total}
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    {pedido.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-gray-800 align-middle">
                    <button
                      onClick={() => handleDelete(pedido.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-10 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Atualizar Status do Pedido
        </h2>
        <form
          onSubmit={handleSubmit(handleStatusUpdate)}
          className="flex flex-col gap-3 bg-white p-4 rounded shadow border"
        >
          <label className="text-gray-700 font-medium">
            ID do Pedido
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="border rounded px-2 py-1 ml-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Digite o ID"
              required
              {...register("statusId")}
            />
            {errors.statusId && (
              <span className="text-red-600 text-xs ml-2">{errors.statusId.message}</span>
            )}
          </label>
          <label className="text-gray-700 font-medium">
            Novo Status
            <select
              className="border rounded px-2 py-1 ml-2"
              required
              {...register("novoStatus")}
            >
              <option value="pendente">Pendente</option>
              <option value="preparando">Preparando</option>
              <option value="pronto">Pronto</option>
              <option value="concluido">Concluído</option>
            </select>
            {errors.novoStatus && (
              <span className="text-red-600 text-xs ml-2">{errors.novoStatus.message}</span>
            )}
          </label>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Atualizar Status
          </button>
          {statusMsg && (
            <div className="text-center text-sm mt-2 text-gray-700">
              {statusMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
