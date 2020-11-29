export default class GraphQLError extends Error {
  constructor(err) {
    const error = [
      err.fetchError,
      ...((err.httpError && JSON.parse(err.httpError?.body || {})?.errors) ||
        []),
      ...(err.graphQLErrors || [])
    ].find(Boolean)

    const { message, ...rest } = error

    super(message)

    Object.assign(this, rest)
  }
}
