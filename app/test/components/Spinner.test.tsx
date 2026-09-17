import { describe, it, expect } from "vitest";
import { Spinner, FullScreenLoader } from "@/components/ui/Spinner";
import { renderWith } from "./helpers";

describe("Spinner", () => {
  it("renderiza con aria-hidden", () => {
    const { container } = renderWith(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("acepta className", () => {
    const { container } = renderWith(<Spinner className="h-8 w-8" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("h-8");
    expect(svg?.getAttribute("class")).toContain("animate-spin");
  });
});

describe("FullScreenLoader", () => {
  it("renderiza un spinner centrado", () => {
    const { container } = renderWith(<FullScreenLoader />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("class")).toContain("animate-spin");
  });
});
