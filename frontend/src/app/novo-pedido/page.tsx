"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Produto {
  id: number;
  name: string;
  price: number;
  category: string;
}

const paymentMethods = [
  { value: "pix", label: "PIX" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao", label: "Cartão" },
];

const novoPedidoSchema = z.object({
  pagamento: z.string(),
});

type NovoPedidoForm = z.infer<typeof novoPedidoSchema>;

export default function NovoPedidoPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<{ id: number; name: string; price: number; qtd: number }[]>([]);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<NovoPedidoForm>({
    resolver: zodResolver(novoPedidoSchema),
    defaultValues: { pagamento: paymentMethods[0].value },
  });
  const pagamento = watch("pagamento");
  const [loading, setLoading] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:3001/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .finally(() => setLoading(false));
  }, []);

  const adicionarAoCarrinho = (produto: Produto) => {
    setAviso(null);
    setCarrinho((prev) => {
      const existente = prev.find((p) => p.id === produto.id);
      if (existente) {
        setAviso("Só é permitido um item por pedido.");
        return prev;
      }
      return [...prev, { ...produto, qtd: 1 }];
    });
  };

  const removerDoCarrinho = (id: number) => {
    setCarrinho((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = carrinho.reduce(
    (sum, p) => sum + p.price,
    0
  );

  const onSubmit = async (data: { pagamento: string }) => {
    const token = localStorage.getItem("jwt");
    const productsIds = carrinho.map((p) => p.id);
    await fetch("http://localhost:3001/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productsIds,
        paymentMethod: data.pagamento,
      }),
    });
    setCarrinho([]);
    reset();
    alert("Pedido realizado com sucesso!");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Novo Pedido</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {aviso && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 text-center font-medium">
            {aviso}
          </div>
        )}
        <div>
          <h2 className="font-semibold mb-2 text-gray-700">Produtos</h2>
          {loading ? (
            <div className="text-gray-700">Carregando...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {produtos.map((produto) => (
                <div key={produto.id} className="border p-2 rounded flex flex-col bg-white">
                  <span className="text-gray-800">{produto.name}</span>
                  <span className="text-sm text-gray-600">
                    R$ {Number(produto.price).toFixed(2)}
                  </span>
                  <Button
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                    type="button"
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    Adicionar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-2 text-gray-700">Carrinho</h2>
          {carrinho.length === 0 ? (
            <div className="text-gray-500">Nenhum produto adicionado.</div>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-gray-700">Produto</th>
                  <th className="px-2 py-1 text-gray-700">Subtotal</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item) => (
                  <tr key={item.id}>
                    <td className="px-2 py-1 text-gray-800">{item.name}</td>
                    <td className="px-2 py-1 text-gray-800">
                      R$ {item.price.toFixed(2)}
                    </td>
                    <td className="px-2 py-1">
                      <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => removerDoCarrinho(item.id)}
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-2 font-bold text-gray-800">
            Subtotal: R$ {subtotal.toFixed(2)}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2 text-gray-700">Forma de Pagamento</h2>
          <select
            className="border rounded px-2 py-1 text-gray-800 bg-white"
            {...register("pagamento")}
          >
            {paymentMethods.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>
          {errors.pagamento && (
            <span className="text-red-600 text-xs">{errors.pagamento.message}</span>
          )}
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Finalizar Pedido
        </Button>
      </form>
    </div>
  );
}
