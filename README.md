# PQSpy-NamelessNanashi

=====

### Firefox extension to quickly check if the webpage you're visiting was protected using post-quantum encryption.

Privacy
------------------------

See Privacy Policy: [PrivacyPolicy.md](<PrivacyPolicy.md>)

## If you want this version

Install A manual version from the [releases](<https://github.com/NanashiTheNameless/pqspy/releases>) tab.

--- OR ---

Install from [addons.mozilla.org](<https://addons.mozilla.org/en-US/firefox/addon/pqspy-namelessnanashi/>).

Reminder for usage
------------------------

###### Firefox 132+ now defaults to using [X25519MLKEM768](<https://datatracker.ietf.org/doc/draft-kwiatkowski-tls-ecdhe-mlkem>) without needing settings changes! (On Beta and Nightly branches at least)

### If you are using Firefox 124 through Firefox 131

⚠️ Don't forget to enable PQC Kyber: go to `about:config`
   and set `security.tls.enable_kyber`
   and `network.http.http3.enable_kyber` to `true`. ⚠️

###### You can use [Cloudflare's PostQuantum test-page](<https://pq.cloudflareresearch.com/>) to ensure you have PostQuantum enabled!

Installation from source
------------------------

1. Clone this repository: `git clone https://github.com/NanashiTheNameless/pqspy`.
2. In Firefox, go to `about:addons`
3. Click the gear, and then _Debug Add-Ons_.
4. Press *Load Temporary Add-on*.
5. Browse to `manifest.json`.
