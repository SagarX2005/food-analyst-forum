import type { ReactNode } from "react";
import { Header } from "@components/shared/header";
import { Footer } from "@components/shared/footer";
import { Breadcrumb } from "@components/shared/breadcrumb";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased selection:bg-[#4a9d23] selection:text-white">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
