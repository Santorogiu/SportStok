"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import logo from "/public/logo.svg";

interface Inputs {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    if (!username || !password) {
      return toast.error("Preencha usúario e senha!", {
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

    try {
      const params = {
        username,
        password,
      };

      await axios.get("/api/auth/login", { params });
      router.push("/");
    } catch (e) {
      return toast.error("Usuário ou senha incorreto!", {
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
      setIsLoading(!!isLoading);
    }
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center gap-6 bg-neutral-100 text-zinc-800">
      <Toaster position="top-center" />
      <Image
        draggable="false"
        src={logo}
        alt="logo-sportstook"
        className="w-96"
      />
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input type="text" placeholder="Usuário" {...register("username")} />
        <Input type="password" placeholder="Senha" {...register("password")} />
        <Button variant="default" type="submit">
          {isLoading ? (
            <Loader2 className="size-5 text-neutral-200 animate-spin" />
          ) : (
            <>
              Entrar <LogIn className="ml-2 size-4" />{" "}
            </>
          )}
        </Button>
        <p className="w-full flex justify-center items-center gap-2 text-sm font-medium text-zinc-800 ">
          Não tem uma conta?
          <span className="cursor-pointer text-indigo-600 hover:text-indigo-900">
            Cadastre-se
          </span>
        </p>
      </form>
    </main>
  );
}
