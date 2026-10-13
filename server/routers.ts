import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, contentProcedure, ownerProcedure, platformManagerProcedure, protectedProcedure, publicProcedure, router, supportProcedure } from "./_core/trpc";
import * as db from "./db";

const contentInput = z.object({ title:z.string().min(2).max(255), description:z.string().min(2), category:z.string().min(1).max(80), duration:z.string().min(1).max(80), lessons:z.number().int().min(0).max(999), accent:z.enum(["gold","blue","violet"]), isPublished:z.number().int().min(0).max(1) });
const quizInput = z.object({ title:z.string().min(2).max(255), section:z.string().min(1).max(80), questions:z.number().int().min(0).max(9999), isPublished:z.number().int().min(0).max(1) });
const fileInput = z.object({ title:z.string().min(2).max(255), kind:z.string().min(1).max(80), size:z.string().min(1).max(40), pages:z.number().int().min(0).max(9999), downloadUrl:z.string().optional().nullable(), isPublished:z.number().int().min(0).max(1) });
const brandingInput = z.object({ platformName:z.string().min(2).max(120), logoUrl:z.string().min(1), fontFamily:z.string().min(2).max(120), primaryColor:z.string().regex(/^#[0-9a-fA-F]{6}$/), backgroundColor:z.string().regex(/^#[0-9a-fA-F]{6}$/), faviconUrl:z.string().min(1) });
const roleInput = z.enum(["user", "platform_manager", "content_moderator", "support_moderator"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({ 
    me: publicProcedure.query(opts => opts.ctx.user), 
    logout: publicProcedure.mutation(({ctx}) => { 
      const opts = getSessionCookieOptions(ctx.req); 
      ctx.res.clearCookie(COOKIE_NAME, {...opts, maxAge: -1}); 
      return { success: true } as const; 
    }),
    // تسجيل دخول مباشر وتجريبي لفتح المنصة فوراً
    demoLogin: publicProcedure.mutation(async ({ctx}) => {
      const demoUser = {
        id: "demo-admin-123",
        openId: "demo-admin-123",
        name: "مدير المنصة (تجريبي)",
        email: "admin@alpha.com",
        role: "admin",
      };
      
      const opts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, JSON.stringify(demoUser), opts);
      return { success: true, user: demoUser };
    })
  }),
  platform: router({ settings: publicProcedure.query(() => db.getBranding()), updateSettings: ownerProcedure.input(brandingInput).mutation(({input}) => db.updateBranding(input)), saveBranding: ownerProcedure.input(brandingInput).mutation(({input}) => db.updateBranding(input)) }),
  student: router({ dashboard: protectedProcedure.query(({ctx}) => db.getStudentDashboard(ctx.user.id)), competitionInvites: protectedProcedure.query(({ctx}) => db.getCompetitionInvites(ctx.user.id)), respondCompetitionInvite: protectedProcedure.input(z.object({competitionId:z.number().int(),response:z.enum(["accepted","rejected"])})).mutation(({ctx,input}) => db.respondCompetitionInvite(ctx.user.id,input.competitionId,input.response)), competitionDetails: protectedProcedure.input(z.object({competitionId:z.number().int()})).query(({ctx,input}) => db.getCompetitionDetails(ctx.user.id,input.competitionId)), errorBank: protectedProcedure.query(({ctx}) => db.getStudentDashboard(ctx.user.id).then(data => data.errorQuestions)), leaderboard: publicProcedure.query(() => db.getLeaderboard()), createCompetition: protectedProcedure.input(z.object({quizId:z.number().int(),friendIds:z.array(z.string().min(1)).min(1).max(3)})).mutation(({ctx,input}) => db.createCompetition(input.quizId,ctx.user.id,input.friendIds)) }), analytics: router({ recordVisit: publicProcedure.input(z.object({deviceHash:z.string().min(16).max(128),path:z.string().max(255),name:z.string().nullable().optional(),email:z.string().nullable().optional(),userId:z.number().int().nullable().optional()})).mutation(({input}) => db.recordVisit({deviceHash:input.deviceHash,lastPath:input.path,name:input.name,email:input.email,userId:input.userId})) }),
  content: router({ featured: protectedProcedure.query(() => db.getPublicContent()), videos: protectedProcedure.query(() => db.listVideos().then(rows => rows.filter(row => row.isPublished))), files: protectedProcedure.query(() => db.getPublicFiles()), quizzes: protectedProcedure.query(() => db.getPublicQuizzes()), quizDetails: protectedProcedure.input(z.object({id:z.number().int()})).query(({input}) => db.getQuizDetails(input.id)), submitAttempt: protectedProcedure.input(z.object({quizId:z.number().int(), answers:z.record(z.string(), z.enum(["A","B","C","D"])), durationSeconds:z.number().int().min(0).max(660), questionIds:z.array(z.number().int()).optional(), competitionId:z.number().int().optional()})).mutation(({ctx,input}) => db.submitQuizAttempt(ctx.user.id,input.quizId,input.answers,input.durationSeconds,input.questionIds,input.competitionId)) }),
  admin: router({
    stats: adminProcedure.query(() => db.getDashboardStats()), recentUsers: adminProcedure.query(() => db.getRecentUsers()), users: adminProcedure.query(() => db.getAllUsers()),
    updateUser: ownerProcedure.input(z.object({id:z.number().int(), role:roleInput, status:z.enum(["active","suspended"])})).mutation(({input}) => db.updateUserAccess(input.id,input.role,input.status)),
    updateUserStatus: platformManagerProcedure.input(z.object({id:z.number().int(), status:z.enum(["active","suspended"])})).mutation(({input}) => db.updateUserStatus(input.id,input.status)),
    content: contentProcedure.query(() => db.listContent()), createContent: contentProcedure.input(contentInput).mutation(({input}) => db.createContent(input)), updateContent: contentProcedure.input(contentInput.extend({id:z.number().int()})).mutation(({input}) => {const {id,...data}=input; return db.updateContent(id,data)}), deleteContent: contentProcedure.input(z.object({id:z.number().int()})).mutation(({input}) => db.deleteContent(input.id)),
    files: contentProcedure.query(() => db.listFiles()), uploadFile: contentProcedure.input(z.object({fileName:z.string().min(1).max(255),contentType:z.string().max(120),data:z.string().min(1),size:z.number().int().positive().max(25*1024*1024)})).mutation(({input}) => db.uploadEducationalFile(input)), createFile: contentProcedure.input(fileInput).mutation(({input}) => db.createFile(input)), updateFile: contentProcedure.input(fileInput.extend({id:z.number().int()})).mutation(({input}) => {const {id,...data}=input; return db.updateFile(id,data)}), deleteFile: contentProcedure.input(z.object({id:z.number().int()})).mutation(({input}) => db.deleteFile(input.id)),
    quizzes: contentProcedure.query(() => db.listQuizzes()), quizQuestions: contentProcedure.input(z.object({quizId:z.number().int()})).query(({input}) => db.getQuizQuestionsForAdmin(input.quizId)), saveQuizQuestions: contentProcedure.input(z.object({quizId:z.number().int(),questions:z.array(z.object({position:z.number().int().min(1).max(11),prompt:z.string().min(1),imageUrl:z.string().optional().nullable(),optionA:z.string().min(1),optionB:z.string().min(1),optionC:z.string().min(1),optionD:z.string().min(1),correctOption:z.enum(["A","B","C","D"])}).strict()).length(11)})).mutation(({input}) => db.replaceQuizQuestions(input.quizId,input.questions.map(question=>({...question,quizId:input.quizId})))), addQuiz: contentProcedure.input(z.object({title:z.string().trim().min(2).max(255),section:z.string().trim().min(1).max(80),isPublished:z.number().int().min(0).max(1)})).mutation(({input}) => db.createQuiz({title:input.title,section:input.section,questions:11,isPublished:input.isPublished})), createQuiz: contentProcedure.input(quizInput).mutation(({input}) => db.createQuiz(input)), updateQuiz: contentProcedure.input(quizInput.extend({id:z.number().int()})).mutation(({input}) => {const {id,...data}=input; return db.updateQuiz(id,data)}), deleteQuiz: contentProcedure.input(z.object({id:z.number().int()})).mutation(({input}) => db.deleteQuiz(input.id)),
    supportSummary: supportProcedure.query(() => db.getAllUsers()), videos: contentProcedure.query(() => db.listVideos()), createVideo: contentProcedure.input(z.object({title:z.string().min(2),description:z.string().optional().nullable(),videoUrl:z.string().min(1).refine(value => value.startsWith("/") || /^https?:\/\//.test(value), "أدخل رابط فيديو صحيح"),thumbnailUrl:z.string().min(1).refine(value => value.startsWith("/") || /^https?:\/\//.test(value), "أدخل رابط صورة صحيح").optional().nullable(),isPublished:z.number().int().min(0).max(1)})).mutation(({input}) => db.createVideo(input)), visitStats: adminProcedure.query(() => db.getVisitStats()), visitLog: adminProcedure.query(() => db.listVisitLog()), resetVisits: ownerProcedure.mutation(() => db.resetVisitLog()),
  }),
});

export type AppRouter = typeof appRouter;