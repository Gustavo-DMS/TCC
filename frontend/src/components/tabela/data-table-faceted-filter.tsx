import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { CheckIcon, PlusCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

interface DataTableFacetedFilter<TData, TValue> {
  coluna: Column<TData, TValue>;
  titulo: string;
  separar?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  coluna,
  titulo,
  separar,
}: DataTableFacetedFilter<TData, TValue>) {
  const facets = coluna?.getFacetedUniqueValues();
  const selectedValues = Array.from(
    new Set(coluna?.getFilterValue() as string[]),
  );
  // console.log(selectedValues);
  const opcoes = [...facets.keys()];

  let listaSeparados = [];

  if (separar) {
    opcoes.forEach((element) =>
      element
        .split(",")
        .forEach((subelement: string) => listaSeparados.push(subelement)),
    );
  } else {
    listaSeparados = opcoes;
  }

  const removerFiltroEspecifico = (value: any) => {
    const updatedValues = selectedValues.filter((valor) => valor !== value);
    coluna?.setFilterValue(updatedValues.length ? updatedValues : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 w-4 h-4" />
          {titulo}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="px-1 font-normal rounded-sm lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex lg:flex-row lg:items-center">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="px-1 font-normal rounded-sm"
                  >
                    {selectedValues.length} selecionados
                  </Badge>
                ) : (
                  opcoes
                    .filter((option) => selectedValues.includes(option))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option}
                        className="gap-1 items-center px-1 font-normal rounded-sm"
                      >
                        <span>{option == null ? "vazio" : option}</span>
                        <XCircle
                          size="1em"
                          className="cursor-pointer"
                          onClick={() => removerFiltroEspecifico(option)}
                        />
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 min-w-[200px]" align="start">
        <Command>
          <CommandInput placeholder={titulo} />
          <CommandList>
            <CommandEmpty>Nenhum Resultado foi Encontrado</CommandEmpty>
            <CommandGroup>
              {listaSeparados.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        const index = selectedValues.indexOf(option);
                        selectedValues.splice(index, 1);
                      } else {
                        selectedValues.push(option);
                      }
                      const filterValues = Array.from(selectedValues);
                      coluna?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary flex-shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{option == null ? "vazio" : option}</span>
                    {facets?.get(option) && (
                      <span className="flex justify-center items-center ml-auto w-4 h-4 font-mono text-xs">
                        {facets.get(option)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => coluna?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Limpar Filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
