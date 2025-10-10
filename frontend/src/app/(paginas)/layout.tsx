import { BreadcrumbCustom } from "@/components/Breadcrumb";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex grow flex-col">
      <BreadcrumbCustom />
      <div className="flex flex-col flex-grow mx-5 my-20 bg-[#456ca6] rounded-4xl p-10 ">
        {children}
      </div>
    </div>
  );
}
