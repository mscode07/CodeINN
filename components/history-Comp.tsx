"use client";

import { Input } from "@/components/ui/input";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const HistoryComp = () => {
  const [history, setHistory] = useState<
    { id: string; prompt: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Input placeholder="Search history" />
          </div>
          <div className="border border-gray-700 rounded-md h-[300px] overflow-y-scroll">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 items-center flex gap-2 justify-center mt-8">
                No history yet.
                <LoaderIcon className="animate-spin" />
              </p>
            ) : (
              history.map((item) => (
                <Link href={`/editor/${item.id}`} key={item.id}>
                  <div className="mb-2 px-4 py-2 border-b border-gray-700 rounded-md bg-black/5 hover:bg-gray-800">
                    <p className="text-sm">{item.prompt}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
