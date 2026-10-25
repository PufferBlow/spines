import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BADGE_SHAPES } from "../roleBadges";
import { RoleBadge } from "./RoleBadge";
import { AssetUrlContext } from "../assetUrl";

describe("RoleBadge", () => {
  it("is a named image when it has a label and decoration when it has none", () => {
    const { container, rerender } = render(<RoleBadge badge={{ tier: "staff", tone: "sky", glyph: "shield" }} size={20} label="Moderator" />);
    expect(screen.getByRole("img", { name: "Moderator" })).toHaveAttribute("width", "20");
    rerender(<RoleBadge badge={{ tier: "staff", tone: "sky", glyph: "shield" }} />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("crops an uploaded picture to the tier's shape", () => {
    const { container } = render(<RoleBadge badge={{ tier: "community", tone: "violet", glyph: "image", image_url: "https://x.test/b.png" }} label="Artist" />);
    expect(container.querySelector("image")).toHaveAttribute("href", "https://x.test/b.png");
    expect(container.querySelector("clipPath path")).toHaveAttribute("d", BADGE_SHAPES.community);
  });
});

describe("RoleBadge picture address", () => {
  it("uses the app's resolver for an uploaded picture, and the address as it is without one", () => {
    const badge = { tier: "community", tone: "violet", glyph: "image", image_url: "/storage/b.png" } as const;
    const { container, unmount } = render(<RoleBadge badge={badge} label="Artist" />);
    expect(container.querySelector("image")).toHaveAttribute("href", "/storage/b.png");
    unmount();
    const { container: resolved } = render(
      <AssetUrlContext.Provider value={(path) => `https://instance.test${path}`}>
        <RoleBadge badge={badge} label="Artist" />
      </AssetUrlContext.Provider>,
    );
    expect(resolved.querySelector("image")).toHaveAttribute("href", "https://instance.test/storage/b.png");
  });
});
