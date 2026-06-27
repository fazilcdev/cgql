import { CommandResolver } from './command.resolver';
import { QueryResolver } from './query.resolver';
import { McpProviderResolver } from './mcp-provider.resolver';
import { RecordsResolver } from './records.resolver';
import { GroupsResolver } from './groups.resolver';
import { SystemLogResolver } from './system-log.resolver';
import { DomainsResolver } from './domains.resolver';

export const Resolvers = [CommandResolver, QueryResolver, McpProviderResolver, RecordsResolver, GroupsResolver, SystemLogResolver, DomainsResolver];