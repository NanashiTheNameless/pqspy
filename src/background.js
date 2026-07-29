"use strict";

// What we've seen per tab. Kept only in memory: the background page is
// persistent under manifest v2, and storage.session wouldn't have outlived it
// anyway, being keyed on the extension instance. These URLs are browsing
// history, so there's every reason not to write them down.
const kexes = {};

function summarize(data) {
    const pq = data.pq.length;
    const npq = data.nonpq.length;
    const unk = data.unknown.length;
    const tot = pq + npq + unk;

    // Cached responses are counted above too, so this really is nothing seen.
    if (tot == 0) {
        return ["unk", "No resources"];
    }

    // Nothing we recognised either way, so we can't claim it isn't
    // post-quantum. Has to come before the pq == 0 case below.
    if (pq == 0 && npq == 0) {
        return ["unk", "unknown"];
    }

    if (pq == 0) {
        return ["no", "not post-quantum encrypted"];
    }

    if (npq == 0 && unk == 0) {
        return ["yes", "post-quantum encrypted"];
    }

    // A mixed page is the warning -- unless the page itself was one of the
    // ones without, which is a cross however well its subresources did. The
    // popup's #page line spells that case out.
    return [data.main === "nonpq" ? "no" : "warn",
            "partially post-quantum encrypted (" + pq + "/" + tot + ")"];
}

// Names come from getKeaGroupName() in nsNSSCallbacks.cpp; which of them
// Firefox offers is set by namedGroups in nsNSSIOLayer.cpp.
function classify(kex) {
    switch (kex) {
        case "mlkem768x25519":
        case "mlkem1024":
        case "xyber768d00":
        case "secp256r1mlkem768":
        case "secp384r1mlkem1024":
            return "pq";
        case "x25519":
        case "P256":
        case "P384":
        case "P521":
        case "FF 2048":
        case "FF 3072":
        case "custom":
            return "nonpq";
        default:
            return "unknown";
    }
}

// Set on every request rather than only when the verdict changes: Firefox
// drops a tab's icon back to the manifest default whenever it navigates.
function showIcon(tid, icon) {
    browser.browserAction.setIcon({
        tabId: tid,
        path: {
            32: "icons/" + icon + ".png",
        }
    });
}

async function record(details) {
    const tid = details.tabId;
    if (tid < 0) return;
    if (details.type === "beacon")
        return;
    const info = await browser.webRequest.getSecurityInfo(
        details.requestId,
        {},
    );
    if (details.type === "main_frame" || !kexes[tid])
        kexes[tid] = {
            summary: null,
            // Which of icons/*.png the verdict corresponds to; the popup
            // shows the same image next to its summary line.
            icon: null,
            // Which bucket the main frame itself fell into, so a page served
            // without post-quantum encryption isn't excused by its
            // subresources.
            main: null,
            pq: [],
            nonpq: [],
            unknown: [],
        };
    let kex = info.keaGroupName;
    let tp;
    if (info.state === "insecure") {
        tp = "nonpq";
        kex = "no encryption";
    } else if (kex) {
        // Serialised into the cache entry along with the rest of the security
        // info, so a cached response says as much about the connection it
        // first arrived on as a fresh one does.
        tp = classify(kex);
    } else {
        // No group to report: a resumed TLS session, for one. Encrypted, but
        // we can't say with what.
        tp = "unknown";
        kex = "unknown key exchange";
    }

    // Cached or not is a property of the response, not a bucket of its own:
    // it still counts towards the totals, and the popup splits the lists on
    // this flag so nothing gets listed twice.
    kexes[tid][tp].push([kex, details.type, details.url, details.fromCache]);

    if (details.type === "main_frame")
        kexes[tid].main = tp;

    const [icon, summary] = summarize(kexes[tid]);
    kexes[tid].summary = summary;
    kexes[tid].icon = icon;

    showIcon(tid, icon);
}

// getSecurityInfo() returns undefined if the channel is no longer registered,
// and there are other ways this can throw. Left unhandled it's a silent
// rejection that leaves the tab on the icon it already had -- which for a
// fresh tab is the manifest's unk.png, indistinguishable from a real answer.
async function logKex(details) {
    try {
        await record(details);
    } catch (e) {
        console.error("PQSpy: could not check", details.url, e);
    }
}

browser.webRequest.onHeadersReceived.addListener(logKex,
    {urls: ["*://*/*"]},
    ["blocking"]
);

browser.tabs.onRemoved.addListener(function(tid, info) {
    delete kexes[tid];
});

// The icon set while the main frame's headers were in flight gets dropped
// again when the navigation commits. Usually a subresource comes along and
// sets it back, but a page that requests nothing else -- an image opened on
// its own, say -- would be left showing the default.
browser.tabs.onUpdated.addListener(function(tid, info) {
    if (info.status !== "complete" || !kexes[tid])
        return;
    showIcon(tid, summarize(kexes[tid])[0]);
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "pqspy") {
        sendResponse(kexes[message.tabId]);
    }
});
