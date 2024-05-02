"use client";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";
import Cookie from "js-cookie";
import { ArrowLeft, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

export default function NewProductForm() {
  const [categorys, setCategorys] = useState<Category[]>([]);
  const { register, handleSubmit, reset } = useForm<Product>();
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [category, setCategory] = useState("");

  const router = useRouter();
  const token = Cookie.get("token");

  const onSubmit = async (data: Product) => {
    if (!data.name || !category || !data.size || !data.quantity) {
      return toast.error("Preencha todos os dados!", {
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

    setIsLoading(!isLoading);

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      const fileToUpload = formData.get("imageUrl");
      let imageUrl = "";

      if (fileToUpload instanceof File && fileToUpload.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.set("file", fileToUpload);

        const uploadResponse = await api.post("/upload", uploadFormData);

        imageUrl = uploadResponse.data.fileUrl;
      }

      try {
        await api.post(
          "/product",
          {
            name: data.name,
            imageUrl,
            quantity: data.quantity.toString(),
            size: data.size.toString(),
            color: data.color,
            categoryId: category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return toast.success("Produto salvo", {
          style: {
            background: "#4F46E5",
            color: "#E5E5E5",
          },
          iconTheme: {
            primary: "#E5E5E5",
            secondary: "#4F46E5",
          },
        });
      } catch (e) {
        return toast.error("Erro ao salvar produto", {
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
        reset();
        setPreview("");
        setIsLoading(!!isLoading);
      }
    }
  };

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  }

  const getCategorys = async () => {
    const response = await api.get("/category", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setCategorys(response.data);
  };

  useEffect(() => {
    getCategorys();
  }, []);

  return (
    <div className="relative container h-full flex flex-col flex-1 justify-center items-center p-3 gap-2">
      <div className="inline-flex justify-start w-full">
        <Button
          onClick={() => {
            router.push("/");
          }}
          variant="ghost"
          size="icon"
        >
          <ArrowLeft className="size-4" />
        </Button>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl flex flex-col items-center justify-center gap-3"
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="preview"
              className="aspect-square flex w-full h-80 rounded-xl object-cover shadow-sm"
            />
            <Trash2
              onClick={() => {
                if (formRef.current) {
                  formRef.current.reset();
                  setPreview(null);
                }
              }}
              className="absolute top-2 right-2 size-5.5 p-1 cursor-pointer text-zinc-500  hover:hover:text-red-600"
            />
          </div>
        ) : (
          <label
            htmlFor="media"
            className="aspect-video w-full flex justify-center items-center border-2 border-zinc-200 text-zinc-300 rounded-xl cursor-pointer hover:border-zinc-300 hover:text-zinc-400 transition-all"
          >
            <ImagePlus className=" size-8" />
          </label>
        )}

        <input
          onChange={onFileSelected}
          type="file"
          name="imageUrl"
          id="media"
          accept="image/*"
          className="invisible h-0 w-0"
        />

        <Input type="text" placeholder="Nome" {...register("name")} />
        <div className="w-full flex gap-2">
          <Input
            type="number"
            placeholder="Quantidade"
            {...register("quantity")}
          />
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>

                {categorys.map((category) => {
                  return (
                    <SelectItem value={category.id} key={category.id}>
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex gap-2">
          <Input type="number" placeholder="Tamanho" {...register("size")} />
          <Input type="text" placeholder="Cor" {...register("color")} />
        </div>

        <Button variant="default" className="mt-2 w-full" type="submit">
          {isLoading ? (
            <Loader2 className="size-5 text-neutral-200 animate-spin" />
          ) : (
            <>Salvar</>
          )}
        </Button>
      </form>
    </div>
  );
}
