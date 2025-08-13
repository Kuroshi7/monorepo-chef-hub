"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Produtos", href: "/produtos" },
  { name: "Novo Pedido", href: "/novo-pedido" },
  { name: "Pedidos", href: "/pedidos" },
];

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("jwt");
      
      
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Limpa redireciona
      localStorage.removeItem("jwt");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.href}>
              <Button className="w-full justify-start text-gray-200 hover:bg-gray-800 hover:text-white">
                <Link href={item.href} className="w-full h-full block text-left">
                  {item.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <Button
        onClick={handleLogout}
        className="mt-auto w-full bg-red-600 hover:bg-red-700 text-white"
      >
        Sair
      </Button>
    </aside>
  );
}
