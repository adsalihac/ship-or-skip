import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MvpCalculator } from "../../components/MvpCalculator";

export const metadata: Metadata = {
  title: "MVP Scope Calculator — Solo Founders",
  description:
    "What's the smallest thing you can build in 2 weeks? Get an execution difficulty score and a tailored MVP scope recommendation.",
};

export default function MvpCalculatorPage() {
  return (
    <main className="flex-1 pb-24">
      <div className="mx-auto mt-4 w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Link
          href="/solo-founders"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 transition hover:text-gray-950"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to tools
        </Link>
      </div>
      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <MvpCalculator />
      </div>
    </main>
  );
}
