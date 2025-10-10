"use client";
import { Minus, Plus } from "lucide-react";
import React from "react";

export default function Quantidade({
  formData,
  limite,
}: {
  formData?: { formField: string; form: any };
  limite?: number;
}) {
  const [quantidade, setQuantidade] = React.useState(0);

  React.useEffect(() => {
    if (formData) {
      formData.form.setValue(formData.formField, quantidade);
    }
    if (limite !== undefined && quantidade > limite) {
      setQuantidade(limite);
    }
  }, [quantidade, formData]);
  return (
    <div className="flex bg-white rounded px-1 justify-center">
      <Minus
        onClick={() => {
          if (quantidade > 0) {
            setQuantidade(quantidade - 1);
          }
        }}
        className="aspect-square w-5 text-center text-blue-600 font-bold text-2xl"
      />
      <input
        type="number"
        value={quantidade}
        className="text-black px-2 text-center max-w-10"
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          setQuantidade(num);
          if (e.target.value == "") {
            setQuantidade(0);
          }
        }}
      />
      <Plus
        onClick={() => {
          setQuantidade(quantidade + 1);
        }}
        className="aspect-square w-5 text-center text-blue-600 font-bold text-2xl"
      />
    </div>
  );
}
