import { createContext, useContext } from "react";

/**
 * How a picture the app uploaded (a role badge's image, say) becomes an address the browser can load. The app
 * knows where its pictures live, so it provides this; without a provider the address is used as it is.
 * Returns `undefined` when the address cannot be made (no instance to ask yet).
 */
export type AssetUrlResolver = (path: string | null | undefined) => string | undefined;

export const AssetUrlContext = createContext<AssetUrlResolver>((path) => path || undefined);

export const useAssetUrl = (): AssetUrlResolver => useContext(AssetUrlContext);
