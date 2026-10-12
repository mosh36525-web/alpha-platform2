import { createApp } from "../server/app";

// Vercel detects this default export and runs the Express app as one Function.
const app = createApp();
export default app;
