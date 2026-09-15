import Image from "next/image";

export default function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen p-4">
      <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2">
        <div className="flex  items-center justify-center bg-[#EDF2F6] px-5 py-8 lg:min-h-0 lg:px-12">
          <div className="w-full max-w-[540px] rounded-xl bg-white px-6 py-12 sm:px-12">
            {children}
          </div>
        </div>
        <div className="relative bg-[#EDF2F6]  min-h-[540px] ">
          <Image
            src="/images/authleftimage.png"
            alt="Napotech logo"
            fill
            priority
            className="h-full w-full object-center rounded-2xl lg:rounded-none"
          />
        </div>
      </div>
    </main>
  );
}