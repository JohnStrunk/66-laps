export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[16px] row-start-2 items-center sm:items-start">
        <h1 className="text-6xl font-bold">66 Laps</h1>
        <p className="text-right w-full">&mdash; because counting is hard<br />especially with 10 lanes</p>
      </main>
    </div>
  );
}
