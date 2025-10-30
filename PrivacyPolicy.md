# Privacy Policy for PQSpy-NamelessNanashi

Effective date: 2025-10-29

This browser extension helps you see whether a webpage’s connections used post-quantum (PQ) cryptography. It operates locally in your browser and does not send any data to external servers.

## What data the extension processes

The extension passively observes network requests made by tabs in your browser in order to classify the TLS key exchange and summarize PQ usage. Specifically, for each open tab it may temporarily process the following metadata for requests made by that tab:

- The full URL of each requested resource
- The resource type (for example: main_frame, script, image, stylesheet)
- Whether a request was served from the browser cache
- TLS connection state (secure/insecure) and the TLS key exchange group name (for example: x25519, P256, ML-KEM/X25519 hybrids)

The extension does not read or modify page content, form data, cookies, or request/response bodies. It excludes “beacon” requests from processing.

## Purpose of processing

This metadata is used only to:

- Determine whether connections for the current page used a post-quantum or non–post-quantum key exchange
- Show a summary in the popup and set the toolbar icon accordingly

## Storage and retention

- All data is kept only in volatile in-memory variables within the extension’s background script, keyed by tab.
- Data for a tab is cleared when that tab is closed or the extension/browser is restarted or reloaded.
- The extension does not write to persistent storage (no use of browser.storage) and does not create logs or files.

## Sharing and transfers

- No data is transmitted to the developer or any third parties.
- The extension does not make network requests to external services beyond the normal web requests made by your browser to the sites you visit.

## Permissions used and why

- tabs: Needed to correlate requests with the active tab and update the toolbar icon/popup for that tab.
- webRequest and webRequestBlocking: Needed to observe request headers and query TLS security information to classify the key exchange. The extension does not block or modify requests; it only reads metadata.
- `<all_urls>`: Needed so the extension can observe requests on any site you visit for the purpose of PQ classification.

## User controls

- To clear data immediately, close the tab or disable/uninstall the extension.
- To stop any processing, uninstall or disable the extension in your browser’s extension manager.

## Children’s privacy

This extension is a general utility and does not target or knowingly process personal information of children.

## Open source transparency

This project is open source. You can review the code to verify these behaviors:

Repository: [github.com/NanashiTheNameless/pqspy](https://github.com/NanashiTheNameless/pqspy)

- No use of persistent storage APIs
- No analytics or telemetry
- No network calls by the extension itself to third-party services

## Changes to this policy

If this policy changes, the updated version will be committed to this repository. Material changes will update the “Effective date” above.

## Contact

Questions or privacy requests: please open an issue on the project’s GitHub repository.
