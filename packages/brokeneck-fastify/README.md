# brokeneck-fastify

Plugs into your favourite Authentication provider (Auth0, Azure Active Directory or AWS Cognito) and exposes GraphQL endpoints for managing it.

It can also serve your Admin UI, or be embedded without your fastify server.

## Auth0 setup

TODO

## Azure Active Directory setup

TODO

### AWS Cognito setup

TODO

## How to use it (standalone mode)

1. Make sure you built the UI at least once: run `lerna run build` at root level
1. Plug into an Authentication provider (see Configuration section down bellow)
1. Start: `yarn start`

### Configuration

Configure your server through environment variables.
For simpler developement, you can use a `.env` file.

- `CORS_ORIGIN` (boolean): enables the [Access-Control-Allow-Origin header](https://www.npmjs.com/package/fastify-cors#options). Set to true to let your UI accessing the server when running in dev mode.

- `BROKENECK_UI` (boolean): enables serving Brokeneck UI.

- `BROKENECK_MERCURIUS_GRAPHIQL` (graphiql|playground): when set, enables serving GraphIQL on http://localhost:5001/graphiqul, or GraphQL playground on http://localhost:5001/playground ([Reference](https://github.com/mercurius-js/mercurius/blob/HEAD/docs/api/options.md#plugin-options)).

- `BROKENECK_PROVIDER` (auth0|azure|cognito): sets the Authentication provider (required).

- `BROKENECK_AUTH0_DOMAIN` (string): the Auth0 domain to connect to. Please follow [the instructions](https://www.npmjs.com/package/auth0#management-api-client) on how to allow your brokeneck server accessing Auth0 Management API.  
 
- `BROKENECK_AUTH0_CLIENT_ID` (string): the Auth0 client ID this server will use.

- `BROKENECK_AUTH0_CLIENT_SECRET` (string): the Auth0 client secret needed for this server to connect.

- `BROKENECK_AUTH0_CONNECTION` (string): the name of the [Auth0 connection](https://auth0.com/docs/identityproviders) to use when creating new users. `Username-Password-Authentication` is the name of Auth0 default database created for you.

- `BROKENECK_AZURE_TENANT_ID` (string): the Azure Active Directory Tenant Id. Create a [tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) and 

- `BROKENECK_AZURE_CLIENT_ID` (string): the Azure Active Directory client ID this server will use. Register an "App" in your tenant to get your client ID.

- `BROKENECK_AZURE_SECRET` (string): the Azure Active Directory secret needed for this server to connect. Go to your "App" secrets to create one, and use it.

- `BROKENECK_COGNITO_REGION` (string): the AWS region hosting your Cognito User Pool.

- `BROKENECK_COGNITO_USER_POOL_ID` (string): the AWS Cognito User Pool ID to create user into.


## How to use it (embedded mode)

`brokeneck-fastify` can be used as a fastify plugin:



### Configuration

TODO

## How it works

`brokeneck-fastify` TODO


## Development

Development should happen on [brokeneck-fastify](../brokeneck-fastify/README.md) & [brokeneck-react](../brokeneck-react/README.md) packages only.
If you change brokeneck server or UI, rebuild them with the `lerna run build` command at top level, and restart the desktop application with `yarn start`.