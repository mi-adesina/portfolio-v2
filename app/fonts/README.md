# Font files required here

`lib/fonts.ts` was switched from `next/font/google` to `next/font/local`
to remove the build's dependency on reaching `fonts.googleapis.com` /
`fonts.gstatic.com` — but `next/font/local` needs the actual font
files, which aren't (and can't be) included here without network
access to fetch them.

## What to add

Same three typefaces, same weights as before — nothing about the
design changed, only how the files get to the build:

```
app/fonts/space-grotesk/SpaceGrotesk-Medium.woff2    (weight 500)
app/fonts/space-grotesk/SpaceGrotesk-SemiBold.woff2  (weight 600)
app/fonts/space-grotesk/SpaceGrotesk-Bold.woff2      (weight 700)
app/fonts/inter/Inter-Regular.woff2                  (weight 400)
app/fonts/inter/Inter-Medium.woff2                   (weight 500)
app/fonts/inter/Inter-SemiBold.woff2                 (weight 600)
app/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2 (weight 400)
app/fonts/jetbrains-mono/JetBrainsMono-Medium.woff2  (weight 500)
```

## Where to get them

All three are open-source (SIL Open Font License) and free to
self-host. The easiest source that gives you exactly `.woff2` files
with no extra tooling: **google-webfonts-helper**
(https://gwfh.mranftl.com/fonts) — search each family, select the
specific weights above, and download the "modern browsers (woff2)"
package. Alternatively, `npmjs.com` has `@fontsource/space-grotesk`,
`@fontsource/inter`, and `@fontsource/jetbrains-mono` — installing
those gives you the same `.woff2` files under `node_modules`, which
you can copy into the paths above (or point `lib/fonts.ts`'s `path`
values at `node_modules` directly, though copying is more robust
against a future `npm install` changing exact file names).

## Why this wasn't done for you

Downloading font files requires the same network access this fix is
working around — I can't fetch binary assets any more than the build
machine that reported this error could. Once the files are in place,
`lib/fonts.ts` needs no further changes.
