/* =========================================================
   Universal Insight — shared data layer
   Stored in localStorage under key "ui.archive.v1"
   NOTE: easy to swap for Supabase later — just replace
   load() / save() with async fetch calls.
   ========================================================= */

window.UI_ARCHIVE = (function(){
  const KEY = "ui.archive.v1";
  const PASS_KEY = "ui.archive.pass";
  const SESSION_KEY = "ui.archive.session";
  const LANG_KEY = "ui.archive.lang";

  /* ---------- defaults ---------- */
  const DEFAULTS = {
    /* admin password (initial) */
    admin: { password: "jay2026" },

    /* topbar / brand */
    brand: {
      ko: { mark: "Jay Moon · Universal Insight", est: "est. 2016 · 서울" },
      en: { mark: "Jay Moon · Universal Insight", est: "est. 2016 · Seoul" }
    },
    nav: {
      ko: ["인사이트","여정","사운드","창작물","소개"],
      en: ["Insights","Journey","Sound","Creations","About"]
    },

    /* founder card */
    founder: {
      ko: {
        eyebrow: "Universal Insight",
        nameFirst: "Jay",
        nameLast: "Moon",
        han: "문재홍 · Jaehong Moon",
        role: '대한축구협회(KFA)에서 16년간 일해온 운영자. 조용히 쓰고, 천천히 만들고, 깊이 듣는 사람.',
        roleAccent: "대한축구협회(KFA)",
        signature: "Jay Moon",
        credentials: "est. 2016 · seoul · kfa"
      },
      en: {
        eyebrow: "Universal Insight",
        nameFirst: "Jay",
        nameLast: "Moon",
        han: "문재홍 · Jaehong Moon",
        role: "Operator at the Korea Football Association for sixteen years. Quiet writer, slow builder, careful listener.",
        roleAccent: "Korea Football Association",
        signature: "Jay Moon",
        credentials: "est. 2016 · seoul · kfa"
      }
    },

    /* shelf eyebrow */
    shelfHeader: {
      ko: { title: "고요한 <em>아카이브</em>", subtitle: "— 책상 위의 일곱 가지 물건 —" },
      en: { title: "The <em>Quiet</em> Archive", subtitle: "— seven artifacts from his desk —" }
    },
    hint: {
      ko: "오브제에 마우스를 올리면 떠오릅니다 · 클릭하면 펼쳐집니다",
      en: "Hover an artifact to lift it · click to read"
    },

    /* objects (the 7 shelf items)
       action: "panel" | "link"
       url:   used when action = "link"
    */
    objects: [
      { id: "insights",   shelf: "top",    type: "notebook", action: "panel", url: "" , label: { ko: "01 · 인사이트",       en: "01 · Insights" } },
      { id: "reflection", shelf: "top",    type: "book",     action: "panel", url: "" , label: { ko: "02 · 첫 글",          en: "02 · First Entry" } },
      { id: "about",      shelf: "top",    type: "magnifier",action: "panel", url: "" , label: { ko: "03 · 소개",           en: "03 · About" } },
      { id: "sound",      shelf: "bottom", type: "headphones",action:"panel", url: "" , label: { ko: "04 · 사운드",         en: "04 · Sound" } },
      { id: "journey",    shelf: "bottom", type: "laptop",   action: "panel", url: "" , label: { ko: "05 · 여정",           en: "05 · The Journey" } },
      { id: "contact",    shelf: "bottom", type: "pen",      action: "panel", url: "" , label: { ko: "06 · 편지 쓰기",           en: "06 · Write a Letter" } },
      { id: "highlights", shelf: "bottom", type: "clock",    action: "panel", url: "" , label: { ko: "07 · 하이라이트",     en: "07 · Highlights" } }
    ],

    /* panel content per object — edited freely in admin */
    panels: {
      insights: {
        ko: { eyebrow: "01 · Jay Moon의 글 모음", h2: "9개월,<br/><em>아흔 셋</em>의 조용한 사유.", lede: "“오래 남는 일은 좀처럼 자신을 드러내지 않는다.”", body: "지난 9개월간 매일 한 편씩 써 내려간 에세이 컬렉션. 철학, AI, 존재, 양자적 사유, 그리고 그것들이 부드럽게 겹치는 자리들.", cta: "아카이브 열기 →" },
        en: { eyebrow: "01 · Reflections by Jay Moon", h2: "Nine months,<br/><em>ninety-three</em> quiet thoughts.", lede: "“The work that lasts is rarely the work that announces itself.”", body: "A collection of essays written daily over the past nine months — explorations on philosophy, AI, existence, quantum thought, and the soft places where these ideas overlap.", cta: "Open the archive →" }
      },
      reflection: {
        ko: { eyebrow: "첫 글 · 2025.08.04", h2: "관찰되지 않은 것들의 <em>무게</em>에 관하여.", lede: "“질문이 던져지기 전, 답은 모든 곳에 동시에 존재한다.”", body: "중첩(superposition)을 물리학이 아니라 존재의 방식으로 생각해본다. 아직 적히지 않은 생각은 모든 가능한 형태로 동시에 존재한다. 글쓰기는 그것을 붕괴시키는 일이다.", cta: "이어서 읽기 →" },
        en: { eyebrow: "First entry · 2025.08.04", h2: "On the <em>weight</em> of unobserved things.", lede: "“Before the question is asked, the answer is everywhere at once.”", body: "I’ve been thinking about superposition not as physics, but as a way of being. The thoughts that haven’t been written down yet — they exist in every possible form. Writing collapses them.", cta: "Continue reading →" }
      },
      about: {
        ko: { eyebrow: "03 · Universal Insight", h2: "조용한 사유를 <em>형태</em>로 옮기는 일.", lede: "“시끄러우려고 만들지 않는다. 사유가 형태를 요구해서 만든다.”", body: "Jay Moon (문재홍). 16년차 운영자. 문제를 오래 품은 뒤에야 무언가를 만든다. 만들 때의 기준은 늘 같다 — 시선을 견디는 조용한 것.", cta: "전문 읽기 →" },
        en: { eyebrow: "03 · Universal Insight", h2: "I translate <em>quiet</em> thinking into things.", lede: "“I don’t build to be loud. I build because the thinking demanded a shape.”", body: "I’m Jay Moon (Jaehong Moon) — a 16-year operator at the intersection of sport, organization, and craft, and lately a curious builder thinking out loud with Claude.", cta: "Read the long form →" }
      },
      sound: {
        ko: { eyebrow: "04 · Thought → Sound", h2: "음악을 만든다기보다,<br/>생각을 <em>소리</em>로 옮긴다.", lede: "Suno는 베틀이고, 실은 그날 아침 떠오른 생각이다.", body: "Suno로 만든 작은 카탈로그. 헤드폰을 끼고, 조용한 방에서 들어주세요.", cta: "카탈로그 듣기 →" },
        en: { eyebrow: "04 · Thought → Sound", h2: "I don’t just create music.<br/>I <em>translate</em> thought into sound.", lede: "Suno is the loom; the thread is whatever I was thinking that morning.", body: "A small, growing catalog of pieces written by feeding ideas into Suno and shaping the output until the sound matches the thought it came from.", cta: "Listen to the catalog →" }
      },
      journey: {
        ko: { eyebrow: "05 · 16년의 조용한 장인정신", h2: "16년.<br/>하나의 <em>협회.</em>", lede: "“오래 남는 일은 좀처럼 자신을 드러내지 않는다.”", body: "2016년 대한축구협회에 합류한 뒤 줄곧 한 자리. 운영, 조직, 그리고 최근의 프로덕트 — 대부분 외부에서는 보이지 않는 챕터들.", cta: "전체 이력 보기 →" },
        en: { eyebrow: "05 · 16 Years of Quiet Craft", h2: "Sixteen years.<br/>One <em>federation.</em>", lede: "“The work that lasts is rarely the work that announces itself.”", body: "Joined the Korea Football Association in 2016 and stayed. The career below is a series of operational, product, and organizational chapters — most of them invisible from the outside.", cta: "See full résumé →" }
      },
      contact: {
        ko: { eyebrow: "06 · 편지 쓰기", h2: "<em>편지를</em> 써주세요.", lede: "모두 읽습니다. 답은 천천히, 그리고 의도적으로.", body: "", cta: "보내기 →" },
        en: { eyebrow: "06 · Write a Letter", h2: "Write me a <em>letter.</em>", lede: "I read everything. I reply slowly, and on purpose.", body: "", cta: "Send →" }
      },
      highlights: {
        ko: { eyebrow: "07 · 프로젝트 하이라이트", h2: "자랑스럽게 여기는 <em>세 가지.</em>", lede: "16년 운영자의 시간에서 골라낸 세 챕터.", body: "", cta: "여정으로 돌아가기 →" },
        en: { eyebrow: "07 · Project Highlights", h2: "Three things I’m <em>proud</em> of.", lede: "Selected from sixteen years of operational work, in no particular order.", body: "", cta: "Back to The Journey →" }
      }
    },

    /* misc text used inside panels */
    strings: {
      ko: { closeAria: "닫기", essayMore: "더 읽기", langKo: "한국어", langEn: "EN", admin: "관리자" },
      en: { closeAria: "Close",  essayMore: "Read more", langKo: "KO", langEn: "English", admin: "Admin" }
    }
  };

  /* ---------- helpers ---------- */
  function deepMerge(base, over){
    if(Array.isArray(base)) return Array.isArray(over) ? over : base;
    if(base && typeof base === 'object'){
      const out = {...base};
      if(over && typeof over === 'object'){
        for(const k of Object.keys(over)){
          out[k] = deepMerge(base[k], over[k]);
        }
      }
      return out;
    }
    return over === undefined ? base : over;
  }

  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULTS, parsed);
    }catch(e){ return JSON.parse(JSON.stringify(DEFAULTS)); }
  }
  function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
  function reset(){ localStorage.removeItem(KEY); }

  /* lang */
  function getLang(){ return localStorage.getItem(LANG_KEY) || 'ko'; }
  function setLang(l){ localStorage.setItem(LANG_KEY, l); }

  /* admin auth */
  function getPassword(){
    const data = load();
    return (data.admin && data.admin.password) || DEFAULTS.admin.password;
  }
  function setPassword(p){
    const data = load();
    data.admin = data.admin || {};
    data.admin.password = p;
    save(data);
  }
  function isLoggedIn(){ return sessionStorage.getItem(SESSION_KEY) === 'ok'; }
  function login(p){
    if(p === getPassword()){ sessionStorage.setItem(SESSION_KEY,'ok'); return true; }
    return false;
  }
  function logout(){ sessionStorage.removeItem(SESSION_KEY); }

  return {
    DEFAULTS, load, save, reset,
    getLang, setLang,
    getPassword, setPassword,
    isLoggedIn, login, logout
  };
})();
