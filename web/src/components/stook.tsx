"use client";

import { api } from "@/lib/api";
import { Product } from "@/types/Product";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "./card";
import { Button } from "./ui/button";

export default function Stook() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container flex-col items-center justify-center gap-2">
      <div className="w-full flex justify-between items-center">
        <p className="text-base text-zinc-400">Estoque</p>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            type="submit"
            onClick={() => {
              router.push("/products/new");
            }}
          >
            Adicionar <Plus className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      <div className="w-full flex items-center justify-center flex-wrap gap-3 py-3 md:py-6">
        {products.map((product) => {
          return <Card key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
