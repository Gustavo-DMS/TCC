export const dynamic = "force-dynamic";
export default async function Home() {
  const fds = await fetch("http://backend:4000/");
  const data = await fds.json();
  console.log(data);

  return (
    <div className="grid gap-16 justify-items-center items-center p-8 pb-20 min-h-screen sm:p-20 grid-rows-[20px_1fr_20px] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start gap-[32px]">
        <h1 className="text-4xl font-bold text-center">
          {data.teste.map((item: any, idx: number) => {
            return <p key={idx}>{item[1]}</p>;
          })}
        </h1>
      </main>
    </div>
  );
}
