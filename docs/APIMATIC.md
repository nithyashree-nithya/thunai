# Using APIMatic with Thunai

APIMatic gives you two things that fit this project. Both are steps you do yourself, because they need your own APIMatic account.

## 1. Context Plugin for PayPal (build the PayPal calls with fewer mistakes)

The Context Plugin gives an AI coding tool such as Claude Code the PayPal API and SDK details it needs, so it does not have to guess request shapes.

1. Open the APIMatic page for this hackathon and follow its setup steps for the plugin:
   https://paypalaihackathon.devpost.com/details/apimatic
2. In Claude Code, from the project folder, ask for a review of the PayPal code. For example:
   - "Using the PayPal context plugin, check `server/paypal.js` against the current Orders v2 API and list anything that differs."
   - "Using the PayPal context plugin, check the Payouts request built in `server/app.js` (`buildBatch`) and fix any field that is wrong."
   - "Using the PayPal context plugin, add a webhook handler for `CHECKOUT.ORDER.APPROVED` and `PAYMENT.CAPTURE.COMPLETED`, so the server does not need to poll."
3. Keep a note of what the plugin changed. The hackathon prize terms ask that you used the plugin in your build, and they ask you to fill in a form to claim the free subscription. Read the terms on the page above.

## 2. Generate docs and SDKs for Thunai's own API

`openapi.yaml` in the project root describes every Thunai endpoint.

1. In APIMatic, create an API and import `openapi.yaml`.
2. Generate an SDK (for example TypeScript or Python) so a vending machine controller can call Thunai without hand-written requests.
3. Publish the documentation portal and share its link in your submission.

The same file also imports into Postman.
