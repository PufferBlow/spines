// The loader, resolved against this module so a bundler (Vite) ships the files with the app.

/** The "gulp and puff" loader, white, as an animated PNG (2.6 s loop). */
export const loaderAnimated = new URL("../assets/loader/pufferblow-loader-mono-white-1024.png", import.meta.url).href;
/** The same loader, one still frame, for when the system asks for less motion. */
export const loaderStill = new URL("../assets/loader/pufferblow-loader-mono-white-still.png", import.meta.url).href;
