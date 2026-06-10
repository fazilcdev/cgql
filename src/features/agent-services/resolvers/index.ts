import { CommandResolver } from './command.resolver';
import { QueryResolver } from './query.resolver';
import { McpProviderResolver } from './mcp-provider.resolver';
import { RecordsResolver } from './records.resolver';

export const Resolvers = [CommandResolver, QueryResolver, McpProviderResolver, RecordsResolver];