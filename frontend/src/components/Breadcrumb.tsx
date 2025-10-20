"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

function camelCaseToWords(s: string) {
  const result = s.replace(/([A-Z])/g, " $1");
  var parcial = result.charAt(0).toUpperCase() + result.slice(1);
  parcial = parcial.replace("Farmaco", "Fármaco");
  parcial = parcial.replace("Saida", "Saída");
  return parcial;
}

export function BreadcrumbCustom() {
  var router = usePathname();
  const routeItems = router.split("/");
  return (
    <Breadcrumb className="text-black text-lg p-5 px-7 absolute">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-white text-lg">
            Menu Inicial
          </BreadcrumbLink>
        </BreadcrumbItem>
        {routeItems.map((item, index) => {
          if (item) {
            const isLast = index === routeItems.length - 1;
            const formattedItem = item
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-lg text-white">
                      {camelCaseToWords(formattedItem)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="text-white text-lg"
                      href={
                        "/" +
                        routeItems
                          .slice(1, index + 1)
                          .filter(Boolean)
                          .join("/")
                      }
                    >
                      {camelCaseToWords(formattedItem)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          }
          return null;
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
