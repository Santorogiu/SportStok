import { api } from "@/lib/api";
import { Loader2, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "../types/Product";
import { Button } from "./ui/button";
import Cookie from "js-cookie";

export default function Card({ product }: { product: Product }) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(product.quantity);
  const [isLoading, setIsLoading] = useState(false);

  const token = Cookie.get("token");

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      api.delete(`/product/${product.id}`);

      return toast.success("Excluído com sucesso!", {
        style: {
          background: "#4F46E5",
          color: "#E5E5E5",
        },
        iconTheme: {
          primary: "#E5E5E5",
          secondary: "#4F46E5",
        },
      });
    } catch (error) {
      console.log(error);
      return toast.error("Erro ao excluir!", {
        style: {
          background: "#4F46E5",
          color: "#E5E5E5",
        },
        iconTheme: {
          primary: "#E5E5E5",
          secondary: "#4F46E5",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlus = async () => {
    try {
     setQuantity(quantity + 1);
     const realValue = quantity + 1;
     return api.put(
        `/product/${product?.id}`,
          {
            name: product.name,
            quantity: realValue.toString(),
            size: product.size?.toString(),
            color: product.color,
            categoryId: product.categoryId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
    } catch (error) {
      console.log(error);
      return toast.error("Erro ao aumentar quantidade!", {
        style: {
          background: "#4F46E5",
          color: "#E5E5E5",
        },
        iconTheme: {
          primary: "#E5E5E5",
          secondary: "#4F46E5",
        },
      });
    }
  };

  const handleMinus = async () => {
    try {
      setQuantity(quantity - 1);
      const realValue = quantity - 1;
      return api.put(
        `/product/${product.id}`,
          {
            name: product.name,
            quantity: realValue.toString(),
            size: product.size?.toString(),
            color: product.color,
            categoryId: product.categoryId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
    } catch (error) {
      console.log(error);
      return toast.error("Erro ao diminuir quantidade!", {
        style: {
          background: "#4F46E5",
          color: "#E5E5E5",
        },
        iconTheme: {
          primary: "#E5E5E5",
          secondary: "#4F46E5",
        },
      });
    }
  };

  return (
    <div className="w-full sm:w-64 md:w-80 flex flex-col gap-2 p-3 rounded-2xl shadow-md bg-white">
      <Image
        width={1000}
        height={1000}
        draggable="false"
        className="aspect-square flex w-full h-full rounded-xl object-cover shadow-sm"
        alt="imagem-produto"
        src={product.imageUrl!}
      />

      <div className="flex flex-col justify-center items-center gap-4 py-3">
        <p className="text-sm font-medium text-zinc-600">{product.name}</p>

        <div className="w-36 h-8 flex justify-between items-center rounded-full bg-indigo-100">
          <Button
            className="w-8 h-8 rounded-full flex justify-center items-center"
            size="icon"
            disabled={quantity < 1}
            onClick={handleMinus}
          >
            <Minus className="size-3" />
          </Button>

          <span className="text-sm font-medium text-indigo-600">
            {quantity}
          </span>

          <Button
            className="w-8 h-8 rounded-full flex justify-center items-center"
            size="icon"
            onClick={handlePlus}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-2">
        <Button
          variant="destructive"
          className="w-full"
          disabled={isLoading}
          onClick={() => handleDelete()}
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Excluir <Trash2 className="ml-2 size-4" />{" "}
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push(`/products/edit/${product.id}`)}
        >
          Editar <Pencil className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
