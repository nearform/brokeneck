# brokeneck-desktop

Runs your Admin UI as a desktop application!

## How to use it

1. Make sure you built the UI at least once: run `lerna run build` at root level
1. Configure brockneck-fastify to serve UI. `packages/brokeneck-fastify/.env` must include `BROKENECK_UI=true`
1. Start electron: `yarn start`

## How it works

`brokeneck-desktop` is an Electron wrapper which starts your `brokeneck-fastify` server, and opens it as an HTML page.
It behaves exactly the same as if you were browsing the Admin UI with Chromium browser. The only difference is your server running _within_ the desktop application instead of being hosted and accessed through the wire.

It still requires connectivity to access the actual Authentication provider (Auth0, Azure Active Directory or AWS Cognito).

Anything that UI would store in its local-storage is persisted when you close the application.

## Development

Development should happen on [brokeneck-fastify](../brokeneck-fastify/README.md) & [brokeneck-react](../brokeneck-react/README.md) packages only.
If you change brokeneck server or UI, rebuild them with the `lerna run build` command at top level, and restart the desktop application with `yarn start`.