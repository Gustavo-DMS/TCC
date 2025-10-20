export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 m-auto ">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      <p className="text-lg text-gray-700">Carregando...</p>
    </div>
  );
}
