export default function Home() {
    return (
        <div className="grid gap-16 justify-items-center items-center p-8 pb-20 min-h-screen sm:p-20 grid-rows-[20px_1fr_20px] font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col row-start-2 items-center sm:items-start gap-[32px]">
                <h1 className="text-4xl font-bold text-center">
                    {process.env.NEXT_PUBLIC_TESTE}
                </h1>
            </main>
        </div>
    );
}
