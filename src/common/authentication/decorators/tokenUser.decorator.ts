import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if(request) return request.user;
    return null
  },
);
