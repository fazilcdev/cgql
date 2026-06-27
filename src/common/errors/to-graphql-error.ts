import { GraphQLError } from 'graphql';

/**
 * Maps an HTTP-ish status code to a stable GraphQL error `code`. The frontend keys its
 * user-facing messages off this code (see the apps' lib/errors.ts), so keep the
 * vocabulary in sync: UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, BAD_USER_INPUT, CONFLICT,
 * LIMIT_REACHED, INTERNAL_SERVER_ERROR.
 */
const STATUS_TO_CODE: Record<number, string> = {
  400: 'BAD_USER_INPUT',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'BAD_USER_INPUT',
  429: 'LIMIT_REACHED',
};

/**
 * Normalises an error caught from a NATS/RPC call into a `GraphQLError` that carries a stable
 * `extensions.code` + `extensions.statusCode`. Downstream services bubble errors over NATS with
 * varying shapes (`status` / `statusCode` / nested `response`), and we want the original code to
 * survive instead of collapsing to a bare message. The GraphQLModule `formatError` then strips
 * any internals and forwards just `{ message, extensions: { code, statusCode } }` to the client.
 */
export function toGraphQLError(e: any): GraphQLError {
  const status =
    e?.status ?? e?.statusCode ?? e?.response?.statusCode ?? e?.response?.status;
  const code = e?.code ?? (status ? STATUS_TO_CODE[status] : undefined) ?? 'INTERNAL_SERVER_ERROR';

  return new GraphQLError(e?.message ?? 'Unexpected error', {
    extensions: { code, statusCode: status ?? null },
  });
}
