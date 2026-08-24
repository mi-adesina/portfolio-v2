import localFont from "next/font/local";

// Switched from next/font/google to next/font/local: next/font/google
// downloads and self-hosts font files *during the build itself*, so a
// build machine without network access to fonts.googleapis.com /
// fonts.gstatic.com can't complete the build at all — there's no
// runtime fallback possible for that specific failure mode. This
// keeps the exact same three typefaces, weights, and CSS variable
// names; only the loading mechanism changed. See app/fonts/README.md
// for what needs to be added before this compiles.
//
// Paths are relative to this file's location (lib/fonts.ts), not to
// app/fonts/ itself — hence ../app/fonts/... rather than ./...

export const displayFont = localFont({
  src: [
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const bodyFont = localFont({
  src: [
    {
      path: "../app/fonts/inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/inter/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const monoFont = localFont({
  src: [
    {
      path: "../app/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/jetbrains-mono/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});
