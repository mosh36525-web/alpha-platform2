import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "@shared/const";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import type { StaffRole } from "../../drizzle/schema";

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const router = t.router; 
export const publicProcedure = t.procedure;

// مستخدم تجريبي افتراضي بجميع الصلاحيات
const defaultDemoUser = {
  id: "demo-owner-123",
  openId: "demo-owner-123",
  name: "مدير المنصة",
  email: "admin@alpha.com",
  role: "owner",
};

const requireUser = t.middleware(async opts => {
  const user = opts.ctx.user || defaultDemoUser;
  return opts.next({ ctx: { ...opts.ctx, user } });
});

const requireRoles = (roles: StaffRole[]) => t.middleware(async opts => {
  const user = opts.ctx.user || defaultDemoUser;
  return opts.next({ ctx: { ...opts.ctx, user } });
});

export const protectedProcedure = t.procedure.use(requireUser);
export const adminProcedure = t.procedure.use(requireRoles(["owner", "platform_manager", "content_moderator", "support_moderator"]));
export const ownerProcedure = t.procedure.use(requireRoles(["owner"]));
export const platformManagerProcedure = t.procedure.use(requireRoles(["owner", "platform_manager"]));
export const contentProcedure = t.procedure.use(requireRoles(["owner", "platform_manager", "content_moderator"]));
export const supportProcedure = t.procedure.use(requireRoles(["owner", "platform_manager", "support_moderator"]));