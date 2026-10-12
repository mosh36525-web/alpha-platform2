import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Library from "./pages/Library";
import Quizzes from "./pages/Quizzes";
import QuizRunner from "./pages/QuizRunner";
import StudentDashboard from "./pages/StudentDashboard";
import Account from "./pages/Account";
import Competition from "./pages/Competition";
import { useEffect, useState } from "react";
import { Accessibility, ArrowRight, Minus, Plus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
function AccessibilityTools(){ const [open,setOpen]=useState(false); const [large,setLarge]=useState(false); const [contrast,setContrast]=useState(false); useEffect(()=>{document.documentElement.classList.toggle("access-large",large);document.documentElement.classList.toggle("access-contrast",contrast);return()=>{document.documentElement.classList.remove("access-large","access-contrast")}},[large,contrast]); return <div className="access-tools" dir="rtl"><button className="access-toggle" aria-label="أدوات تسهيل الوصول" onClick={()=>setOpen(v=>!v)}><Accessibility size={18}/></button>{open&&<div className="access-menu"><strong>تسهيل الوصول</strong><button onClick={()=>setLarge(v=>!v)}><Plus size={14}/> تكبير النص</button><button onClick={()=>setLarge(false)}><Minus size={14}/> الحجم الطبيعي</button><button onClick={()=>setContrast(v=>!v)}>◐ تباين أعلى</button></div>}</div> }
function GlobalBack(){ const [path]=useLocation(); if(path==="/"||path==="/404") return null; return <button className="global-back" aria-label="العودة" onClick={()=>{if(window.history.length>1)window.history.back();else window.location.href="/"}}><ArrowRight size={16}/> العودة</button> }

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/account" component={Account} /><Route path="/competition" component={Competition} /><Route path="/app" component={Library} /><Route path="/progress" component={StudentDashboard} /><Route path="/quizzes" component={Quizzes} /><Route path="/quizzes/:id" component={QuizRunner} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
function BrandIconSync() { const branding=trpc.platform.settings.useQuery(); useEffect(()=>{ const icon=document.querySelector<HTMLLinkElement>("#app-favicon"); const cached=window.localStorage.getItem("alpha-favicon-url"); if(icon && cached) icon.href=cached; },[]); useEffect(()=>{ const icon=document.querySelector<HTMLLinkElement>("#app-favicon"); const next=branding.data?.faviconUrl; if(icon && next) { icon.href=next; window.localStorage.setItem("alpha-favicon-url",next); } if(branding.data?.platformName) document.title=branding.data.platformName; },[branding.data]); return null; }
function VisitTracker() { const { user } = useAuth(); const visit = trpc.analytics.recordVisit.useMutation(); useEffect(() => { const key="alpha-device-id"; const deviceHash=localStorage.getItem(key) ?? crypto.randomUUID().replaceAll("-",""); localStorage.setItem(key,deviceHash); void visit.mutate({deviceHash,path:window.location.pathname,userId:user?.id ?? null,name:user?.name ?? null,email:user?.email ?? null}); }, [user?.id]); return null; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><TooltipProvider><Toaster /><VisitTracker /><BrandIconSync /><GlobalBack /><AccessibilityTools /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
