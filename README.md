
# PrimeCare Payments (Stripe + Paytrail) – Final Skeleton

This ZIP contains a minimal Next.js App Router backend setup for PrimeCare with:

- `/api/create-payment-intent`  → Stripe PaymentIntent (custom card form, etc.)
- `/api/create-paytrail-payment` → Paytrail payment *template* (you must add your merchant/signature details)
- Example environment config file: `.env.local.example`

## 1. Install dependencies

```bash
npm install
# or
yarn
```

## 2. Copy env example

```bash
cp .env.local.example .env.local
```

Then fill:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `PAYTRAIL_MERCHANT_ID`
- `PAYTRAIL_SECRET_KEY`
- `PAYMENT_SUCCESS_URL`
- `PAYMENT_CANCEL_URL`
- `DOMAIN_URL`
- `NEXT_PUBLIC_DOMAIN_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## 3. API endpoints

### Stripe – `/api/create-payment-intent`

Expected request body (JSON):

```json
{
  "priceId": "consultation_basic",
  "customerEmail": "client@example.com"
}
```

Valid `priceId` values:

- `consultation_basic` → 39.00€
- `prescription_renewal` → 9.90€
- `follow_up` → 25.00€

Response:

```json
{
  "clientSecret": "pi_12345_secret_67890"
}
```

You use `clientSecret` in your frontend custom card form.

### Paytrail – `/api/create-paytrail-payment`

This is a **template** route – it:

- Accepts amount and basic order info from your frontend
- Prepares a payload for Paytrail
- Shows you clearly where to compute the signature
- Expects you to follow the official Paytrail docs for signing

Expected request body (JSON):

```json
{
  "amount": 3900,
  "orderNumber": "PC-123456",
  "customer": {
    "email": "client@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

Response (when fully wired to Paytrail):

```json
{
  "redirectUrl": "https://payments.paytrail.com/pay/..."
}
```

Currently it returns a placeholder URL if `PAYTRAIL_MERCHANT_ID` or `PAYTRAIL_SECRET_KEY` are missing.

## 4. Frontend fetch examples

```ts
// STRIPE
await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create-payment-intent`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    priceId: "consultation_basic",
    customerEmail: customerEmail,
  }),
});

// PAYTRAIL
await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create-paytrail-payment`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 3900,
    orderNumber: "PC-123456",
    customer: {
      email: customerEmail,
      firstName: "Test",
      lastName: "User",
    },
  }),
});
```

## 5. Run dev server

```bash
npm run dev
```

Then open: `http://localhost:3000`

You can now plug these routes into your existing PrimeCare frontend.
