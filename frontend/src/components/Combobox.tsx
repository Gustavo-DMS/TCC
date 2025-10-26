"use client";
import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useVirtualizer } from "@tanstack/react-virtual";

export function ExampleCombobox({
  data,
  chave,
  value,
  placeholder,
  formData,
}: {
  data: Array<any>;
  chave: string;
  value: string;
  placeholder?: string;
  formData: { formField: string; form: any };
}) {
  const [open, setOpen] = React.useState(false);
  const [valor, setValor] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[210px] justify-between overflow-scroll"
        >
          {valor !== ""
            ? data.find((item) => item[chave] === valor)?.[value]
            : placeholder || "Selecione..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[210px] p-0">
        <Command>
          <CommandInput placeholder={placeholder || "Faça uma busca..."} />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item[chave]}
                  value={item[value]}
                  onSelect={(currentValue) => {
                    setValor(item[chave] === valor ? "" : item[chave]);
                    if (formData) {
                      formData.form.setValue(formData.formField, item[chave]);
                    }
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      valor === item[chave] ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item[value]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function VirtualizedCombobox({
  chave,
  placeholder,
  formData,
  data,
  filterFn,
  displayFunc,
  vazio,
}: React.PropsWithChildren<{
  chave: string;
  placeholder?: string;
  formData: { formField: string; form: any };
  filterFn: (inputValue: string) => Array<any>;
  displayFunc: (item: any) => string;
  data: Array<any>;
  vazio?: string;
}>) {
  const [open, setOpen] = React.useState(false);
  const [valor, setValor] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const parentRef = React.useRef<HTMLDivElement>(null);

  const dataFiltered = React.useMemo(
    () => filterFn(inputValue),
    [inputValue, filterFn],
  );

  const rowVirtualizer = useVirtualizer({
    count: dataFiltered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 10,
  });

  React.useEffect(() => {
    if (open) {
      // wait until popover content has actually rendered
      setInputValue("");
      setTimeout(() => {
        rowVirtualizer.measure(); // force recompute
      }, 0);
    }
  }, [open, rowVirtualizer]);

  React.useLayoutEffect(() => {
    rowVirtualizer.measure(); // force recompute
    rowVirtualizer.scrollToIndex(0, { align: "start" }); // optional, keep list in sync
  }, [dataFiltered, rowVirtualizer]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[210px] overflow-scroll"
        >
          {valor !== ""
            ? displayFunc(data.find((item) => item[chave] === valor))
            : placeholder || "Selecione..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder || "Faça uma busca..."}
            onValueChange={(e) => setInputValue(e)}
          />
          <CommandList>
            <CommandEmpty>
              {vazio ? vazio : "Nenhuma opção encontrada"}
            </CommandEmpty>
            <CommandGroup>
              <div
                ref={parentRef}
                style={{
                  height: "290px",
                  overflowY: "auto",
                  contain: "strict",
                }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                      key={`${dataFiltered[virtualItem.index][chave]}-${inputValue}`}
                      data-index={virtualItem.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <CommandItem
                        key={dataFiltered[virtualItem.index][chave]}
                        value={`${dataFiltered[virtualItem.index][chave]}`}
                        className="overflow-scroll"
                        onSelect={(currentValue) => {
                          setValor(
                            dataFiltered[virtualItem.index][chave] === valor
                              ? ""
                              : dataFiltered[virtualItem.index][chave],
                          );
                          if (formData) {
                            formData.form.setValue(
                              formData.formField,
                              dataFiltered[virtualItem.index][chave],
                            );
                          }
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            valor === dataFiltered[virtualItem.index][chave]
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {displayFunc(dataFiltered[virtualItem.index])}
                      </CommandItem>
                    </div>
                  ))}
                </div>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
