import AnimatedGlowingSearchBar from "@/components/ui/animated-glowing-search-bar";
import { useState } from "react";

const DemoOne = () => {
  const [value, setValue] = useState("");

  return (
    <AnimatedGlowingSearchBar
      value={value}
      onChange={setValue}
      onSubmit={() => undefined}
    />
  );
};

export { DemoOne };