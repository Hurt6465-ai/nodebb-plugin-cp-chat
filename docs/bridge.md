# Bridge contract

The frontend engine expects these same-origin endpoints:

- `GET /bridge/token` -> `{ "uid": "123", "token": "..." }`
- `GET /bridge/get-history?login_uid=123&channel_id=456&limit=20` -> `{ "data": [] }` or an array
- `POST /bridge/revoke` with `{ channel_id, message_seq, client_msg_no }`

If `bridgeBaseUrl` is configured in ACP, this plugin proxies those endpoints to the configured bridge.
If it is blank, token/history return safe empty values and revoke returns 501.
