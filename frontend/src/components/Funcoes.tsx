import Link from "next/link";

export default function Funcoes({
    link,
    children,
}: React.PropsWithChildren<{ link: string }>) {
    return (
        <main className="flex flex-col flex-grow mx-5 my-20 bg-[#456ca6] rounded-lg p-10">
            <div className="flex gap-2">
                <div className="bg-white rounded-full p-2">{children}</div>
                <Link href={link} className="my-auto bg-[#254370] p-2 rounded-full">
                    Teste
                </Link>
            </div>
        </main>
    );
}
