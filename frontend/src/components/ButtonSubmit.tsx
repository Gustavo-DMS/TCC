"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

export default function ButtonSubmit({
  children,
  onClick,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!onClick) {
      console.warn("No onClick handler provided");
      return;
    }
    try {
      setLoading(true);
      await onClick(e); // supports async handlers
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn(
        "bg-gradient-to-tr from-blue-500 rounded-lg to-[#493960] p-3 text-white font-bold text-lg",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <>
          <Spinner /> Carregando...
        </>
      ) : (
        children || "Cadastrar"
      )}
    </Button>
  );
}
