"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedGlowingSearchBar from "@/components/ui/animated-glowing-search-bar";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import { cn } from "@/lib/utils";

export function VercelV0Chat() {
    const [value, setValue] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
    const messagesRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef(true);

    useEffect(() => {
        const listEl = messagesRef.current;
        if (!listEl || !shouldAutoScrollRef.current) return;
        listEl.scrollTo({ top: listEl.scrollHeight, behavior: "smooth" });
    }, [chatHistory]);

    const handleMessageScroll = () => {
        const listEl = messagesRef.current;
        if (!listEl) return;
        const distanceFromBottom = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
        shouldAutoScrollRef.current = distanceFromBottom < 120;
    };

    const sendMessage = async () => {
        if (!value.trim()) return;

        const messageText = value.trim();
        setValue("");

        setChatHistory((prev) => [...prev, { role: "user", content: messageText }]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText }),
            });
            const data = await response.json().catch(() => ({
                error: "Server returned an invalid response",
            }));

            if (data.reply) {
                setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: "Error: " + (data.error || "Failed to fetch response"),
                    },
                ]);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            setChatHistory((prev) => [
                ...prev,
                { role: "assistant", content: "Network error: " + message },
            ]);
        }
    };

    return (
        <div className="relative flex h-screen w-screen overflow-hidden bg-black text-white">
            <div className="absolute inset-0">
                <SmokeBackground smokeColor="#7f7f86" />
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.1),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.78)_100%)]" />

            <div className="relative z-10 flex h-full min-h-0 w-full flex-col">
                <header className="shrink-0 px-4 pt-6 sm:px-6 lg:px-8">
                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
                        <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                            Chat interface
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                            What can I help you build?
                        </h1>
                    </div>
                </header>

                <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 pb-4 pt-6 sm:px-6 lg:px-8">
                    <div className="flex min-h-0 flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                        <div className="flex min-h-0 flex-1 flex-col">
                            <div
                                ref={messagesRef}
                                onScroll={handleMessageScroll}
                                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 pb-8 sm:px-6"
                            >
                                {chatHistory.length === 0 ? (
                                    <div className="flex h-full min-h-[320px] items-center justify-center text-center text-white/70">
                                        <div className="max-w-xl space-y-3">
                                            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
                                                Start a conversation
                                            </p>
                                            <p className="text-xl sm:text-2xl">
                                                Ask a question, describe a feature, or paste a prompt.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {chatHistory.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg sm:text-base",
                                                    msg.role === "user"
                                                        ? "ml-auto bg-white text-black"
                                                        : "mr-auto border border-white/10 bg-black/30 text-white"
                                                )}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="shrink-0 border-t border-white/10 bg-black/35 p-4 sm:p-5">
                                <div className="rounded-[24px] border border-white/10 bg-black/20 p-3 shadow-inner">
                                    <AnimatedGlowingSearchBar
                                        value={value}
                                        onChange={setValue}
                                        onSubmit={sendMessage}
                                        placeholder="Ask me a question..."
                                        disabled={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
