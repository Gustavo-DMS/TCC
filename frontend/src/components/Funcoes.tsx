import Link from "next/link";

export default function Funcoes({
  link,
  children,
  text,
}: React.PropsWithChildren<{ link: string; text: string }>) {
  return (
    <main className="flex flex-col flex-grow">
      <div className="flex gap-2">
        <div className="bg-white rounded-full p-2 shadow-white shadow ">
          {children}
        </div>
        <Link
          href={link}
          className="my-auto bg-[#254370] p-2 rounded-full text-white flex-grow pl-4 hover:bg-[#1e3550] transition max-w-[400px] "
        >
          {text}
        </Link>
      </div>
    </main>
  );
}
