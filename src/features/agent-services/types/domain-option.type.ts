import { ObjectType, Field } from '@nestjs/graphql';

/** A curated, domain-specific option for a sub-chat's structured `subChatType`. */
@ObjectType()
export class SubChatTypeOption {
  @Field()
  id: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  description?: string;
}

/**
 * One engine-supported domain (vertical), as registered in agent-service's DomainPackRegistry.
 * Drives the admin agent-type domain picker; `systemPrompt` is the in-code default shown as an
 * editable reference so an admin can customise it per agent type.
 */
@ObjectType()
export class DomainOption {
  @Field()
  domain: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  systemPrompt?: string;

  /** Per-domain sub-chat type options (built-in defaults; absent ⇒ no picker for this domain). */
  @Field(() => [SubChatTypeOption], { nullable: true })
  subChatTypes?: SubChatTypeOption[];
}
