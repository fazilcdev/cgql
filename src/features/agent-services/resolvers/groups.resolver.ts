import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLError } from 'graphql';
import { NatsClientService } from 'chatbuk-common/dist/common/rpc-clients/nats/nats-client.module';
import { RPCServices } from 'chatbuk-common/dist/services/rpc-services';
import {
  Records,
  Chat,
  Membership,
  Access,
} from 'chatbuk-common/dist/services/agent-service/entities';
import { UserAgents } from 'chatbuk-common/dist/services/user-agents/services';
import { GqlAuthGuard } from '../../../common/authentication/guards/gql-auth.guard';
import { ACRolesGuard } from '../../../common/access-controll/guards/ac-roles.guard';
import { ACRoles } from '../../../common/access-controll/decorators/ac-roles.decorator';
import { TokenUser } from '../../../common/authentication/decorators/tokenUser.decorator';

/**
 * Groups / sub-chats / access API — forwards to agent-service over NATS. Covers group membership,
 * the sub-chat tree, record approval, and the combined permission+entitlement snapshot the UI uses
 * to gate actions. All authorization happens server-side in agent-service; this only forwards the
 * validated tokenUser.
 */
@UseGuards(GqlAuthGuard)
@Resolver()
export class GroupsResolver {
  constructor(private readonly nats: NatsClientService) {}

  private call(cmd: string, data: any, user: any) {
    return this.nats
      .sendSync(RPCServices.AgentService, cmd, { data, tokenUser: user })
      .catch((e) => {
        throw new GraphQLError(e.message);
      });
  }

  private callUserAgents(cmd: string, data: any, user: any) {
    return this.nats
      .sendSync(RPCServices.UserAgents, cmd, { ...data, data, tokenUser: user })
      .catch((e) => {
        throw new GraphQLError(e.message);
      });
  }

  // ---- Organizations (admin manage + the user's own orgs) -----------------

  @Query(() => GraphQLJSON, { nullable: true })
  async userOrganizations(@TokenUser() user: any) {
    const userId = user?.id || user?._id;
    return this.callUserAgents(
      UserAgents.GetUserOrganizationsQuery,
      { userId: String(userId) },
      user,
    );
  }

  /** All members of an org (for the owner/admin to manage). Authorized server-side. */
  @Query(() => GraphQLJSON, { nullable: true })
  async orgMembers(@TokenUser() user: any, @Args('orgId') orgId: string) {
    return this.callUserAgents(
      UserAgents.GetOrganizationMembersQuery,
      { orgId },
      user,
    );
  }

  // Org-member mutations are authorized in the user-agents handlers (org owner / org admin / platform
  // admin) so the chatbuk owner can manage their own team — no platform-only guard here.
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async addOrgMember(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.callUserAgents(UserAgents.AddOrgMemberCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async updateOrgMember(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.callUserAgents(UserAgents.UpdateOrgMemberPermissionsCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async removeOrgMember(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.callUserAgents(UserAgents.RemoveOrgMemberCommand, data, user);
  }

  // ---- Access snapshot (permissions + entitlements) -----------------------

  @Query(() => GraphQLJSONObject, { nullable: true })
  async accessSnapshot(
    @TokenUser() user: any,
    @Args({ name: 'workspaceId', nullable: true }) workspaceId?: string,
  ) {
    return this.call(Access.GetSnapshotQuery, { workspaceId }, user);
  }

  @Query(() => GraphQLJSONObject, { nullable: true })
  async myEntitlements(@TokenUser() user: any) {
    return this.call(Access.GetEntitlementsQuery, {}, user);
  }

  // ---- Feature catalog + admin-enabled set --------------------------------

  /** The static master feature catalog (for admin curation + frontend labels). */
  @Query(() => GraphQLJSON, { nullable: true })
  async featureCatalog(@TokenUser() user: any) {
    return this.call(Access.GetFeatureCatalogQuery, {}, user);
  }

  /** The admin-enabled subset of features. */
  @Query(() => GraphQLJSONObject, { nullable: true })
  async featureSettings(@TokenUser() user: any) {
    return this.call(Access.GetFeatureSettingsQuery, {}, user);
  }

  /** Usage report (admin) — rollups filtered per user / org / org-user. */
  @UseGuards(ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Query(() => GraphQLJSON, { nullable: true })
  async usageReport(
    @TokenUser() user: any,
    @Args({ name: 'data', nullable: true, type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Access.GetUsageReportQuery, data || {}, user);
  }

  /** Save the enabled subset — admin only. */
  @UseGuards(ACRolesGuard)
  @ACRoles(['Admin', 'Super Admin'])
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async updateFeatureSettings(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Access.UpdateFeatureSettingsCommand, data, user);
  }

  // ---- Sub-chat tree ------------------------------------------------------

  @Query(() => GraphQLJSON, { nullable: true })
  async chatTree(
    @TokenUser() user: any,
    @Args({ name: 'workspaceId', nullable: true }) workspaceId?: string,
  ) {
    return this.call(Chat.GetChatTreeQuery, { workspaceId }, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async createSubChat(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Chat.CreateSubChatCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async markMessagesRead(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Chat.MarkMessagesReadCommand, data, user);
  }

  // ---- Group membership ---------------------------------------------------

  @Query(() => GraphQLJSON, { nullable: true })
  async workspaceMembers(
    @TokenUser() user: any,
    @Args({ name: 'workspaceId', nullable: true }) workspaceId?: string,
  ) {
    return this.call(Membership.ListMembersQuery, { workspaceId }, user);
  }

  @Query(() => GraphQLJSON, { nullable: true })
  async workspaceInvitations(@TokenUser() user: any) {
    return this.call(Membership.ListInvitationsQuery, {}, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async addWorkspaceMember(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Membership.AddMemberCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async updateWorkspaceMember(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Membership.UpdateMemberCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async removeWorkspaceMember(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Membership.RemoveMemberCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async acceptWorkspaceInvitation(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Membership.AcceptInvitationCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async declineWorkspaceInvitation(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Membership.DeclineInvitationCommand, data, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async createWorkspace(
    @TokenUser() user: any,
    @Args({ name: 'data', type: () => GraphQLJSONObject }) data: any,
  ) {
    return this.call(Membership.CreateWorkspaceCommand, data, user);
  }

  // ---- Record approval ----------------------------------------------------

  /** The pending-approval queue for a workspace (managers/owners only; gated in agent-service). */
  @Query(() => GraphQLJSON, { nullable: true })
  async pendingApprovals(
    @TokenUser() user: any,
    @Args('workspaceId', { nullable: true }) workspaceId?: string,
  ) {
    return this.call(Records.ListPendingApprovalsQuery, { workspaceId }, user);
  }

  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async approveRecord(@TokenUser() user: any, @Args('recordId') recordId: string) {
    return this.call(Records.ApproveRecordCommand, { recordId }, user);
  }
}
