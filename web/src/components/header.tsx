import { getUser } from "@/lib/auth";
import { CircleUserRound, LogOut } from "lucide-react";
import Image from "next/image";
import logo from "/public/logo.svg";

export default function Header() {
  const user = getUser();

  return (
    <header className="h-max w-full flex justify-between py-4 px-3 md:px-8 border-b-2">
      <Image
        draggable="false"
        src={logo}
        alt="logo-sportstook"
        className="w-28 md:w-48"
      />
      <div className="flex gap-4 justify-center items-center">
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium text-zinc-800">{user.name}</p>
          <a
            href="/api/auth/logout"
            className="flex gap-1 justify-center items-center text-sm cursor-pointer text-zinc-500 hover:text-red-500"
          >
            sair <LogOut className="size-3" />
          </a>
        </div>
        <CircleUserRound
          strokeWidth={1.6}
          className="size-10 md:size-12 text-indigo-600"
        />
      </div>
    </header>
  );
}
