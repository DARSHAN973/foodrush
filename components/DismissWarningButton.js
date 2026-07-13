"use client";

import { useTransition } from "react";
import { markWarningAsReadAction } from "@/app/actions/vendorActions";

export default function DismissWarningButton({ warningId }) {
  const [isPending, startTransition] = useTransition();

  const handleDismiss = () => {
    startTransition(async () => {
      await markWarningAsReadAction(warningId);
    });
  };

  return (
    <button
      onClick={handleDismiss}
      disabled={isPending}
      className="shrink-0 rounded-xl bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-200 active:scale-95 transition disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "Dismissing..." : "Dismiss"}
    </button>
  );
}
