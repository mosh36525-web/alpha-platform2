import type React from "react";
import { ArrowLeft, ArrowUpLeft, BookOpen, ChevronLeft, FolderOpen, Headphones, HelpCircle, Info, Layers3, LogIn, MessageCircle, Moon, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getDailyQuote } from "@/lib/dailyQuote";
import "@/quiz.css";
import { useTheme } from "@/contexts/ThemeContext";

const safeLogin = () => { try { startLogin(); } catch { window.location.href = "/api/oauth/callback"; } };

export default function Home() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const content = trpc.content.featured.useQuery();
  const quizzes = trpc.content.quizzes.useQuery(undefined, { enabled: Boolean(user) });
  const files = trpc.content.files.useQuery(undefined, { enabled: Boolean(user) });
  const videos = trpc.content.videos.useQuery(undefined, { enabled: Boolean(user) });
  const progress = trpc.student.dashboard.useQuery(undefined, { enabled: Boolean(user) });
  const branding = trpc.platform.settings.useQuery();
  const platform = branding.data;
  const cards = content.data ?? [];
  const quote = getDailyQuote();
  return <div className="alpha-page" dir="rtl" style={{"--brand-font": platform?.fontFamily ?? "IBM Plex Sans Arabic", "--brand-primary": platform?.primaryColor ?? "#f2c75d", "--brand-background": platform?.backgroundColor ?? "#090b0e"} as React.CSSProperties}>
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-lockup"><div className="brand-mark brand-image"><img src={platform?.logoUrl ?? "/brand/alpha-owner.png"} alt="Alpha" /></div><div><strong>{platform?.platformName ?? "ALPHA"}</strong><small>منصة ألفا في أقسام الكمي</small></div></div>
        <nav className="main-nav">
          <a className="active" href="#home">الرئيسية</a><a href="#library-content">الملفات</a><Link href="/quizzes">الكويزات</Link><Link href="/competition">تنافس</Link><Link href="/progress">إنجازي</Link>{user && <Link className="folders-nav-link" href="/progress"><FolderOpen size={14}/> مجلداتي</Link>}<a href="#about">عن Alpha</a><a href="#support">الدعم</a>
        </nav>
        <div className="header-actions"><Link className="account-chip" href="/account"><span className="avatar">{user?.name?.slice(0,1) ?? "A"}</span><span>حسابي</span></Link>{user && user.role !== "user" && <Link className="admin-top-link" href="/admin">لوحة التحكم</Link>}<button className="theme-top-toggle" onClick={toggleTheme} aria-label="تبديل الوضع">{theme === "dark" ? <Sun size={15}/> : <Moon size={15}/>}</button>{user ? <button className="text-action" onClick={() => void logout()}>خروج</button> : <button className="text-action" onClick={safeLogin}>دخول</button>}</div>
      </div>
    </header>

    <main id="home">
      <section className="daily-quote home-quote top-daily-quote"><span className="section-kicker">اقتباس اليوم</span><blockquote>“{quote.text}”</blockquote><cite>{quote.source}</cite></section>
      <section className="hero-section container-alpha">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> ALPHA / QUANTITATIVE</div><h1>طريقك الأقصر<br/>والأفضل <em>لإتقان الكمي.</em></h1><p>مساحة تعليمية هادئة تجمع لك المراجعة والكويزات والتقدم في تجربة واحدة واضحة.</p><div className="hero-actions"><button className="gold-button" onClick={() => document.getElementById("library")?.scrollIntoView({behavior:"smooth"})}>شاهد الملفات <ArrowLeft size={18}/></button>{user ? <Link className="ghost-button" href="/app">مكتبتي <ArrowUpLeft size={17}/></Link> : <button className="ghost-button" onClick={safeLogin}>ابدأ الآن <LogIn size={17}/></button>}</div><div className="hero-note"><ShieldCheck size={16}/> محتوى مرتب، واضح، وبلا تشتيت</div></div>
        <div className="hero-visual"><div className="grid-orbit orbit-one"/><div className="grid-orbit orbit-two"/><div className="library-card"><div className="card-topline"><span>01 / 01</span><span>مساحة Alpha <i/></span></div><div className="library-title"><div className="book-icon"><BookOpen size={25}/></div><div><small>جاهز للمراجعة</small><h3>مسار Alpha</h3></div></div><div className="progress-panel"><div><span>محتوى مرتب</span><b>جاهز</b></div><div className="progress-bar"><span/></div><div><small>ملفات وكويزات</small><small>استمر</small></div></div><div className="mini-row"><span>ملفات ومراجعة منظمة</span><ChevronLeft size={17}/><div className="mini-icon"><Layers3 size={17}/></div></div><div className="mini-row muted-row"><span>حلول مختصرة وتمارين ذكية</span><ChevronLeft size={17}/><div className="mini-icon"><Sparkles size={17}/></div></div></div></div>
      </section>

      {user && <section className="home-progress container-alpha"><div><span className="section-kicker">لوحة إنجازك</span><h2>استمر، أنت أقرب مما تتخيل.</h2><p>{progress.data?.errors?.length ?? 0} أخطاء للمراجعة · {progress.data?.remaining ?? 3} كويزات مختلفة متبقية اليوم</p></div><div className="home-progress-stats"><strong>{progress.data?.completed ?? 0}</strong><span>محاولات مكتملة</span></div><div className="home-progress-stats"><strong>{progress.data?.errors?.length ?? 0}</strong><span>بنك الأخطاء</span></div><Link className="gold-button" href="/progress">فتح لوحة الإنجاز <ArrowLeft size={16}/></Link></section>}

      <section className="stats-strip container-alpha"><div><strong>01</strong><span>ملف Alpha الرئيسي</span></div><div><strong>{quizzes.data?.length ?? 0}</strong><span>كويزات منشورة</span></div><div><strong>∞</strong><span>مراجعة منظمة</span></div><div><strong>24/7</strong><span>وصول منظم</span></div></section>

      <section id="library-content" className="section-block container-alpha"><div className="section-heading"><div><span className="section-kicker">محتوى مختار</span><h2>كل ما تحتاجه<br/><em>في مكان واحد.</em></h2></div><p>تعلّم بهدوء، اختبر فهمك، وراجع أخطاءك من لوحة إنجاز واحدة. كل خطوة مصممة لتأخذك للأمام.</p></div><div className="content-grid">{cards.length ? cards.map((item, index) => <article className={`content-card accent-${item.accent}`} key={item.id}><div className="card-number">0{index+1}</div><div className="round-icon"><BookOpen size={19}/></div><span className="card-label">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><div className="card-footer"><span>{item.lessons} درس</span><span>{item.duration}</span><ChevronLeft size={17}/></div></article>) : ["مسار Alpha التجريبي"].map((title,index) => <article className="content-card" key={title}><div className="card-number">0{index+1}</div><div className="round-icon"><BookOpen size={19}/></div><span className="card-label">كمي</span><h3>{title}</h3><p>مسار تعريفي منظم يساعدك على اكتشاف طريقة المراجعة داخل Alpha.</p><div className="card-footer"><span>جاهز</span><span>Alpha</span><ChevronLeft size={17}/></div></article>)}</div></section>

      <section id="about" className="about-alpha-section container-alpha">
        <div className="about-alpha-copy"><span className="section-kicker"><Info size={15}/> عن Alpha</span><h2>منصة تساعدك<br/><em>تذاكر بوضوح.</em></h2><p>Alpha مساحة تعليمية عربية للقسم الكمي؛ تجمع الملفات، الكويزات، المنافسة، وبنك الأخطاء في تجربة واحدة بدون تشتيت.</p><div className="about-alpha-points"><div><ShieldCheck size={17}/><span>تقدمك محفوظ وتظهر لك الخطوة التالية.</span></div><div><Sparkles size={17}/><span>كويزات قصيرة مع مراجعة واضحة بعد التسليم.</span></div><div><Layers3 size={17}/><span>محتوى منظم يصلح للمراجعة اليومية.</span></div></div></div><div className="about-alpha-card"><span className="about-card-mark">A</span><strong>طريقك الأقصر لإتقان الكمي</strong><p>ابدأ بالملفات، جرّب الكويز، ثم عُد إلى بنك الأخطاء حتى تثبت المعلومة.</p><Link className="ghost-button" href={user ? "/app" : "/quizzes"}>{user ? "افتح مكتبتك" : "استكشف الكويزات"}<ArrowLeft size={16}/></Link></div>
      </section>
      <section id="support" className="support-home-section container-alpha">
        <div className="section-heading compact"><div><span className="section-kicker"><Headphones size={15}/> الدعم الفني</span><h2>نحن هنا<br/><em>لمساعدتك.</em></h2></div><p>إذا واجهت مشكلة في الدخول أو فتح ملف أو إرسال كويز، ابدأ من الخيار المناسب وسنوجهك للحل.</p></div>
        <div className="support-home-grid"><article className="support-home-card"><div className="support-card-icon"><HelpCircle size={21}/></div><h3>أسئلة سريعة</h3><p>تأكد من تسجيل الدخول أولًا، ثم حدّث الصفحة إذا لم يظهر المحتوى أو الملف.</p><Link href="/account" className="inline-link">مراجعة حسابي <ArrowLeft size={15}/></Link></article><article className="support-home-card"><div className="support-card-icon"><MessageCircle size={21}/></div><h3>مشكلة في كويز؟</h3><p>دوّن اسم الكويز ورقم السؤال، وتواصل مع مشرف الدعم من داخل المنصة.</p><Link href="/account" className="inline-link">فتح الحساب <ArrowLeft size={15}/></Link></article><article className="support-home-card"><div className="support-card-icon"><ShieldCheck size={21}/></div><h3>محتواك آمن</h3><p>نتائجك وتقدمك مرتبطان بحسابك، ولا تُحتسب المحاولة إلا بعد تسليم الكويز.</p><Link href="/progress" className="inline-link">عرض إنجازي <ArrowLeft size={15}/></Link></article></div>
      </section>
      <section id="tracks" className="feature-band container-alpha"><div><span className="section-kicker">اختبر نفسك</span><h2>كويزات الأقسام،<br/><em>تقدم أكبر.</em></h2></div><div className="band-steps">{(quizzes.data??[]).slice(0,3).map((quiz,index)=><div key={quiz.id}><span>0{index+1}</span><p>{quiz.section}<br/><small>{quiz.title}</small></p></div>)}{!quizzes.isLoading&&!quizzes.data?.length&&<div><span>—</span><p>لا توجد كويزات منشورة<br/><small>ستظهر هنا تلقائيًا</small></p></div>}</div><Link href="/quizzes" className="round-arrow"><ArrowLeft size={21}/></Link></section>

      {user && <section id="explanations" className="explanation-section container-alpha"><div className="section-heading compact"><div><span className="section-kicker">شرح الأقسام</span><h2>فيديوهات تساعدك<br/><em>على الفهم والمراجعة.</em></h2></div><p>شروحات مرئية للكويزات والملفات، تُضاف تلقائيًا من لوحة التحكم.</p></div><div className="explanation-grid">{(videos.data ?? []).map(video => <a className="explanation-card" key={video.id} href={video.videoUrl} target="_blank" rel="noreferrer">{video.thumbnailUrl ? <img src={video.thumbnailUrl} alt=""/> : <div className="video-placeholder"><span>▶</span></div>}<div><span className="card-label">شرح قسم</span><h3>{video.title}</h3><p>{video.description ?? "شرح مختصر يساعدك على مراجعة المحتوى."}</p></div></a>)}{!videos.isLoading && !videos.data?.length && <div className="empty-state">ستظهر فيديوهات الشرح هنا بعد نشرها من لوحة التحكم.</div>}</div></section>}
      <section id="library" className="file-list-section container-alpha"><div className="section-heading compact"><div><span className="section-kicker">المكتبة</span><h2>ملفات جاهزة<br/><em>للمراجعة.</em></h2></div><Link className="inline-link" href="/app">شاهد الكل <ArrowLeft size={15}/></Link></div><div className="file-list">{user ? (files.data ?? []).slice(0,3).map((file) => <div className="file-row" key={file.id}><div className="file-icon"><Layers3 size={18}/></div><div><strong>{file.title}</strong><small>{file.kind} · {file.size} · {file.pages} صفحة</small></div><ChevronLeft size={17}/></div>) : <div className="empty-state">سجّل الدخول للوصول إلى الملفات التعليمية والكويزات.</div>}</div></section>
    </main>
    <footer className="site-footer container-alpha"><div className="brand-lockup"><div className="brand-mark brand-image"><img src={platform?.logoUrl ?? "/brand/alpha-owner.png"} alt="Alpha" /></div><div><strong>{platform?.platformName ?? "ALPHA"}</strong><small>منصة ألفا في أقسام الكمي</small></div></div><span>طريقك الأقصر والأفضل لإتقان الكمي</span><span>© 2026 Alpha</span></footer>
  </div>;
}
