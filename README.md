PQSpy-NamelessNanashi
=====

Firefox extension to quickly check if the webpage you're visiting
was protected using post-quantum encryption.

~~Install from [addons.mozilla.org](<null>).~~ (Not Ready Yet)

⚠️ Don't forget to enable PQC Kyber: go to `about:config`
   and set `security.tls.enable_kyber`
   and `network.http.http3.enable_kyber` to `true`. ⚠️

Installation from source
------------------------

1. Clone this repository: `git clone https://github.com/NanashiTheNameless/pqspy`.
2. In Firefox, go to `about:addons`
3. Click the gear, and then _Debug Add-Ons_.
4. Press *Load Temporary Add-on*.
5. Browse to `manifest.json`.

Also don't forget to turn on PQC (Kyber):

6. Go to `about:config` and set `security.tls.enable_kyber`
   (and `network.http.http3.enable_kyber` if present) to `true`.
