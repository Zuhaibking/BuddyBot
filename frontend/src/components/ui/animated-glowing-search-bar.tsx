import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedGlowingSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const AnimatedGlowingSearchBar: React.FC<AnimatedGlowingSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[720px] items-center justify-center">
      <div className="group relative flex w-full items-center justify-center">
        <div className="absolute -z-10 h-full w-full overflow-hidden rounded-2xl blur-[3px] before:absolute before:-left-1/2 before:-top-1/2 before:h-[240%] before:w-[240%] before:animate-[spin_7s_linear_infinite] before:bg-[conic-gradient(from_120deg,rgba(0,0,0,0.1),#2f2a5f_8%,rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.15)_50%,#7f2c74_62%,rgba(0,0,0,0.1)_85%)]" />
        <div className="absolute -z-10 h-[98%] w-[99%] overflow-hidden rounded-2xl blur-[2px] before:absolute before:-left-1/2 before:-top-1/2 before:h-[220%] before:w-[220%] before:animate-[spin_9s_linear_infinite_reverse] before:bg-[conic-gradient(from_20deg,rgba(0,0,0,0),#18116a_10%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_58%,#6e1b60_70%,rgba(0,0,0,0)_90%)]" />

        <div className="relative flex h-14 w-full items-center rounded-2xl border border-white/15 bg-[#060608]/95 pl-12 pr-14 backdrop-blur-xl">
          <Search className="pointer-events-none absolute left-4 h-5 w-5 text-white/70" />

          <input
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-full w-full bg-transparent text-base text-white placeholder:text-white/35 focus:outline-none"
            disabled={disabled}
          />

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className={cn(
              "absolute right-2 inline-flex h-10 items-center justify-center rounded-xl border px-3 transition-colors",
              value.trim() && !disabled
                ? "border-white/20 bg-gradient-to-b from-[#1a1838] via-[#08080c] to-[#241f55] text-white hover:border-white/40"
                : "cursor-not-allowed border-white/10 bg-white/5 text-white/35"
            )}
            aria-label="Send"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlowingSearchBar;