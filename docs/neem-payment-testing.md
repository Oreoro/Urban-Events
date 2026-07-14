# Neem Payment Testing

Neem's public website confirms the payments product supports API integration, payment links, payment buttons, cards, mobile wallets, Raast, 1Bill, and related checkout flows. Endpoint-level API docs are not public in search results; Neem points developers to the Neem developer portal at `https://portal.dev.neem.io`.

Official references:

- `https://www.neem.io/payments`
- `https://portal.dev.neem.io`

For this app, the implemented Neem flow uses:

1. `POST {{neem_base_url}}/v1/oauth2/token`
   - Auth: `Authorization: Basic {{neem_base_token}}`
   - Body: `grant_type=client_credentials`
   - Expected: JSON response with `access_token`

2. `POST {{neem_base_url}}/v2/pod/initiate`
   - Auth: `Authorization: Bearer {{neem_access_token}}`
   - Header: `X-Neem-Partner-Id: {{neem_partner_id}}`
   - Body: `Data.PODBill`
   - Expected success: `Data.PODBill.StatusCode` equals `N100` and `Data.PODBill.PaymentUrl` is present

3. `POST {{app_api_base_url}}/public/events/{{event_id}}/order/{{order_short_id}}/neem/generate_token`
   - This hits Urban Events and verifies the complete server-side order validation plus Neem redirect generation.
   - Requires a real reserved order that is still awaiting payment.
   - Expected success: JSON response with `redirect_url`

Important payload details:

- `MobileNumber` should be a Pakistan number normalized as `92XXXXXXXXXX`, for example `923001234567`.
- `InstructedAmount.Amount` should not include redundant trailing decimals. Use `5350`, not `5350.00`.
- `Currency` should match the order currency, currently `PKR` for the live event.
- `BasketId` must match the Urban Events order short id when testing through the app endpoint.

Postman collection:

- Import `docs/postman/neem-payment-smoke.postman_collection.json`.
- Set collection variables for `neem_base_url`, `neem_base_token`, and `neem_partner_id`.
- Run "1. Neem OAuth Token", then "2. Neem POD Initiate".
- To test the deployed app path, set `event_id` and `order_short_id` to a fresh checkout order, then run "3. Urban Events Neem Generate Token".
