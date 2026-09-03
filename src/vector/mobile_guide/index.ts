/*
 * VERJI: Rewritten for the Verji mobile guide. Upstream Element used this script to build a
 * mobile.element.io "configure your app" link from the homeserver config; the Verji apps have the
 * homeserver built in, so this now only wires up the "Go to Desktop Site" link and lets the app store
 * links be overridden through config.json.
 */
import { logger } from "matrix-js-sdk/src/logger";

import { getVectorConfig } from "../getconfig";

function onBackToDesktopClick(): void {
    // Cookie should expire in 4 hours. The name is shared with the redirect in src/vector/index.ts
    // and the mobile guide toast in matrix-react-sdk, so keep them in sync if it ever changes.
    document.cookie = "element_mobile_redirect_to_guide=false;path=/;max-age=14400";
    window.location.href = "../";
}

/**
 * Applies a `mobile_builds` value from config.json to one of the app store links on the page:
 * a string replaces the default (Verji) link, `null` hides it, and anything else keeps the default.
 */
function applyStoreLink(elementId: string, url: string | null | undefined): void {
    const link = document.getElementById(elementId) as HTMLAnchorElement | null;
    if (!link) return;

    if (url === null) {
        link.style.display = "none";
    } else if (typeof url === "string" && url.length > 0) {
        link.href = url;
    }
}

async function initPage(): Promise<void> {
    document.getElementById("back_to_desktop_button")!.onclick = onBackToDesktopClick;

    // The store links can be overridden through the same `mobile_builds` config option the main app
    // uses for its download prompts. If the config can't be loaded we simply keep the default links.
    try {
        const config = await getVectorConfig("..");
        const mobileBuilds = config?.["mobile_builds"];
        applyStoreLink("ios_store_link", mobileBuilds?.ios);
        applyStoreLink("android_store_link", mobileBuilds?.android);
    } catch (e) {
        logger.warn("Unable to load config for the mobile guide, keeping the default app store links", e);
    }
}

initPage();
