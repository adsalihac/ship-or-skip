import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { IdeaComparison } from "../../components/IdeaComparison";

export const metadata: Metadata = { title: "Idea Comparison — Solo Founders", description: "Compare 2-3 ideas side-by-side across all analysis dimensions." };

export default function Page() {
  return (<main className="flex-1 pb-24"><div className="mx-auto mt-4 w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"><Link href="/solo-founders" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted transition hover:text-foreground"><ArrowLeft className="size-4" />Back to tools</Link></div><div className="mx-auto max-w-[1200px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10"><IdeaComparison /></div></main>);
}
