# Thunai (துணை)

Cross-border PayPal checkout for vending machines, with round-up giving to local children's homes.

A traveller with a PayPal account pays at a local vending machine by scanning a code. The total can be rounded up to the next ₹10, the small difference goes to a nearby orphanage or NGO, and the machine's sponsor adds half again. Gifts are collected and paid to each partner in one monthly PayPal Payouts batch. The page works in English, Tamil and Hindi, with three text sizes and full keyboard and screen-reader support.

It runs with no setup in **demo mode** (payments simulated). Add PayPal sandbox keys and the same code talks to PayPal.

## What is inside

| Part | Where | What it does |
|---|---|---|
| Server | `server/` | Express API. Prices orders, creates and captures PayPal orders, records gifts, builds payout batches |
| Customer page | `public/index.html`, `public/app.js` | The vending checkout, offers, giving and vendor tabs |
| Operator dashboard | `public/dashboard.html`, `public/dashboard.js` | AG Grid tables for partner funding, payouts waiting and the gift ledger |
| Render deploy | `render.yaml` | One-click blueprint for the web service |
| Postman | `postman/` | Collection and environment for the server and for PayPal sandbox calls |
| API spec | `openapi.yaml`, `docs/APIMATIC.md` | For APIMatic SDKs and docs, and for using its PayPal Context Plugin |
| Tests | `test/` | 10 tests, including one against a fake PayPal server |

## Run it locally

You need **Node.js 18 or newer** ([nodejs.org](https://nodejs.org)). Check with `node -v`.

```bash
cd thunai
npm install
cp .env.example .env        # on Windows: copy .env.example .env
npm start
```

Open http://localhost:3000. You should see "Demo mode" at the top.

Try it:
1. Add snacks on the machine, keep round-up on, pick a partner, press **Pay with PayPal**.
2. Press **Approve in PayPal (simulated)**. You get a receipt that splits the sale from the gift.
3. Open the **Giving** tab, then http://localhost:3000/dashboard.html to see the gift in the ledger and in "Waiting for payout".
4. On the dashboard type `change-me` into **Admin token** (the `ADMIN_TOKEN` value in your `.env`), press **Preview batch**, then press **Send payouts** twice (the second press confirms).

Run the tests with `npm test`.

## Use the PayPal sandbox (no real money)

1. Sign in at https://developer.paypal.com and open **Apps & Credentials**, with **Sandbox** selected.
2. Create an app. Copy its **Client ID** and **Secret**.
3. Open **Testing Tools > Sandbox Accounts**. Note a **personal** account (your test buyer) and make sure you have a **business** account (the merchant).
4. Edit `.env`:
   ```
   PAYPAL_ENV=sandbox
   PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-secret
   ADMIN_TOKEN=pick-a-long-random-value
   NGO_EMAIL_N1=email-of-a-sandbox-personal-account
   ```
5. Restart with `npm start`. The top of the page now says "PayPal sandbox".
6. Check out. The page shows a QR code and an **Open the PayPal approval page** button. Approve with your sandbox buyer. The page notices within a few seconds, captures the payment and shows the receipt.
7. On the dashboard, enter your `ADMIN_TOKEN` and send the payout batch. Payouts only work if the Payouts feature is enabled for your sandbox business account. If PayPal refuses, the dashboard shows its message and debug id.

To scan the code with a real phone, the phone must be able to reach your server. Use a tunnel such as `ngrok http 3000` and set `BASE_URL` to the address it gives you, or deploy to Render.

## Test the API in Postman

1. In Postman choose **Import** and select both files in `postman/`.
2. Choose the **Thunai local** environment and fill in `adminToken` (and your PayPal keys if you want the direct PayPal calls).
3. Run the **Thunai server** requests top to bottom. In demo mode use **Mock approve**. The requests include tests that check the server's prices.
4. The **PayPal sandbox direct** folder checks your keys against PayPal itself. PayPal also publishes an official API collection in Postman's public workspace.

## APIMatic

See `docs/APIMATIC.md`. Import `openapi.yaml` to get an SDK and a docs portal, and use the PayPal Context Plugin when changing the PayPal code.

## Put it on GitHub

```bash
cd thunai
git init -b main
git add .
git commit -m "Thunai: PayPal checkout for vending machines with round-up giving"
```

Create an empty repository on github.com (no README, no .gitignore), then:

```bash
git remote add origin https://github.com/YOUR-NAME/thunai.git
git push -u origin main
```

`.gitignore` already keeps `.env` (your secrets) and `node_modules` out of the repository. Check that `git status` does not list `.env` before you push.

## Deploy on Render

1. Push the project to GitHub as above.
2. In Render choose **New > Blueprint** and pick the repository. Render reads `render.yaml`.
3. When asked, enter `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` (sandbox values). `ADMIN_TOKEN` is generated for you. Open the service's **Environment** tab to read it.
4. Open the service URL. The QR code and PayPal return pages use that address automatically.

The free plan stores data in a file that resets on redeploy. For real use, replace `server/store.js` with Render Postgres. To send payouts on a schedule, uncomment the cron job in `render.yaml`.

## How the money flows

- The server prices every order. The browser never sends an amount to PayPal.
- Each order is charged to the customer in US dollars at an example rate (`FX_RATE_INR_PER_USD`, default 90). Use a live rate in production.
- The round-up gift is part of the charge. The sponsor match is a pledge funded separately, so it is not charged to the customer. Payouts include both, so the sender account needs the sponsor's funds in it.
- Capture only happens after PayPal reports the order as approved.

## Before a real launch

- Replace the sample partners in `server/catalog.js` with verified organisations. Any partner that receives foreign-sourced money needs a valid FCRA registration. Check this and tax-receipt rules with a legal advisor.
- Confirm that your PayPal account type and country support the currencies and the Payouts feature you need.
- Replace the JSON-file store with a database, and add webhooks (`CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED`) instead of polling.
- Add rate limiting and put the dashboard behind a proper sign-in. The admin token is a minimum.
- Offers on the Offers tab are examples. They are not live promotions.

## Project layout

```
server/        Express app, PayPal client (real and demo), pricing, store
public/        Customer page, operator dashboard, return page
test/          API tests and a fake-PayPal test
postman/       Collection and environment
scripts/       run-payout.js for scheduled payouts
openapi.yaml   API description for APIMatic and Postman
render.yaml    Render blueprint
```

## Licence

MIT. Sample partner names, amounts and offers are placeholders.
