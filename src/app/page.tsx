import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-start min-h-screen pt-[50vh] px-24 text-[#3a2c1a] font-serif">
      <h1 className="mb-8 tracking-tight">
        <span className="text-8xl transition-colors duration-200 hover:text-[#a67c52] cursor-pointer font-[var(--font-cinzel)] italic" style={{ color: '#f6bf10' }}>Myles Harris</span>
      </h1>
      <h2 className="text-3xl opacity-80">Atlanta born, LA based Engineer</h2>
    </main>
  );
}
