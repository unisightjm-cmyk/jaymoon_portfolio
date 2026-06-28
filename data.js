/* =========================================================
   Universal Insight — shared data layer
   Stored in localStorage under key "ui.archive.v1"
   NOTE: easy to swap for Supabase later — just replace
   load() / save() with async fetch calls.
   ========================================================= */

window.UI_ARCHIVE = (function(){
  // --- Self-Healing Cache Cleanup for Outdated/Corrupted Local Storage ---
  try {
    const cachedPostsRaw = localStorage.getItem('ui.archive.posts');
    if (cachedPostsRaw) {
      const cachedPosts = JSON.parse(cachedPostsRaw);
      if (Array.isArray(cachedPosts) && cachedPosts.length > 0) {
        const invalidPosts = cachedPosts.filter(p => !p || typeof p !== 'object' || !p.id);
        if (invalidPosts.length > 0) {
          console.warn("Detected corrupted posts cache. Self-healing by removing corrupt cache.");
          localStorage.removeItem('ui.archive.posts');
        }
      }
    }
  } catch(e) {}
  try {
    const cachedVibesRaw = localStorage.getItem('ui.archive.vibes');
    if (cachedVibesRaw) {
      const cachedVibes = JSON.parse(cachedVibesRaw);
      if (Array.isArray(cachedVibes) && cachedVibes.length > 0) {
        const invalidVibes = cachedVibes.filter(v => !v || typeof v !== 'object' || !v.id);
        if (invalidVibes.length > 0) {
          console.warn("Detected corrupted vibes cache. Self-healing by removing corrupt cache.");
          localStorage.removeItem('ui.archive.vibes');
        }
      }
    }
  } catch(e) {}

  const KEY = "ui.archive.v4";
  const PASS_KEY = "ui.archive.pass";
  const SESSION_KEY = "ui.archive.session";
  const LANG_KEY = "ui.archive.lang";

  const SUPABASE_URL = "https://nhpxefusirwpanhoeire.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Hkp_oaUWJ0pahYQcqqphFA_06uqDeVc";
  let supabaseClient = null;
  try {
    if(window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch(e) {
    console.error("Supabase init error:", e);
  }

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
      ko: [],
      en: []
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
      en: { title: "The <em>Quiet</em> Archive", subtitle: "— artifacts from his desk —" }
    },
    hint: {
      ko: "오브제에 마우스를 올리면 떠오릅니다 · 클릭하면 펼쳐집니다",
      en: "Hover an artifact to lift it · click to read"
    },

    /* objects (the shelf items)
       action: "panel" | "link"
       url:   used when action = "link"
    */
    objects: [
      { id: "about",      shelf: "top",    type: "magnifier",action: "panel", url: "" , label: { ko: "소개",           en: "About" } },
      { id: "insights",   shelf: "top",    type: "notebook", action: "link",  url: "archive.html" , label: { ko: "인사이트",       en: "Insights" } },
      { id: "sound",      shelf: "bottom", type: "headphones",action:"panel", url: "" , label: { ko: "사운드",         en: "Sound" } },
      { id: "journey",    shelf: "bottom", type: "laptop",   action: "link", url: "vibecoding.html" , label: { ko: "Vibe Coding",           en: "Vibe Coding" } },
      { id: "contact",    shelf: "bottom", type: "pen",      action: "panel", url: "" , label: { ko: "편지 쓰기",           en: "Write a Letter" } }
    ],

    /* panel content per object — edited freely in admin */
    panels: {
      about: {
        ko: { eyebrow: "Universal Insight", h2: "조용한 사유를 <em>형태</em>로 옮기는 일.", lede: "“시끄러우려고 만들지 않는다. 사유가 형태를 요구해서 만든다.”", body: "Jay Moon (문재홍). 16년차 운영자. 문제를 오래 품은 뒤에야 무언가를 만든다. 만들 때의 기준은 늘 같다 — 시선을 견디는 조용한 것.", cta: "전문 읽기 →" },
        en: { eyebrow: "Universal Insight", h2: "I translate <em>quiet</em> thinking into things.", lede: "“I don’t build to be loud. I build because the thinking demanded a shape.”", body: "I’m Jay Moon (Jaehong Moon) — a 16-year operator at the intersection of sport, organization, and craft, and lately a curious builder thinking out loud with Claude.", cta: "Read the long form →" }
      },
      insights: {
        ko: { eyebrow: "Jay Moon의 글 모음", h2: "9개월,<br/><em>아흔 셋</em>의 조용한 사유.", lede: "“오래 남는 일은 좀처럼 자신을 드러내지 않는다.”", body: "지난 9개월간 매일 한 편씩 써 내려간 에세이 컬렉션. 철학, AI, 존재, 양자적 사유, 그리고 그것들이 부드럽게 겹치는 자리들.", cta: "아카이브 열기 →" },
        en: { eyebrow: "Reflections by Jay Moon", h2: "Nine months,<br/><em>ninety-three</em> quiet thoughts.", lede: "“The work that lasts is rarely the work that announces itself.”", body: "A collection of essays written daily over the past nine months — explorations on philosophy, AI, existence, quantum thought, and the soft places where these ideas overlap.", cta: "Open the archive →" }
      },
      sound: {
        ko: { eyebrow: "Thought → Sound", h2: "음악을 만든다기보다,<br/>생각을 <em>소리</em>로 옮긴다.", lede: "Suno는 베틀이고, 실은 그날 아침 떠오른 생각이다.", body: "Suno로 만든 작은 카탈로그. 헤드폰을 끼고, 조용한 방에서 들어주세요.", cta: "카탈로그 듣기 →" },
        en: { eyebrow: "Thought → Sound", h2: "I don’t just create music.<br/>I <em>translate</em> thought into sound.", lede: "Suno is the loom; the thread is whatever I was thinking that morning.", body: "A small, growing catalog of pieces written by feeding ideas into Suno and shaping the output until the sound matches the thought it came from.", cta: "Listen to the catalog →" }
      },
      journey: {
        ko: { eyebrow: "Vibe Coding 산출물", h2: "AI와 함께하는<br/><em>새로운</em> 창작의 여정.", lede: "“코딩을 배우지 않아도 아이디어는 실현된다.”", body: "Vibe Coding을 통해 만들어낸 다양한 산출물과 프로젝트. AI를 파트너로 삼아 상상을 현실로 만들어가는 과정의 기록들입니다.", cta: "산출물 보기 →" },
        en: { eyebrow: "Vibe Coding Creations", h2: "A <em>new</em> journey of creation with AI.", lede: "“Ideas become reality without learning to code.”", body: "Various outputs and projects created through Vibe Coding. A record of the process of turning imagination into reality with AI as a partner.", cta: "View creations →" }
      },
      contact: {
        ko: { eyebrow: "편지 쓰기", h2: "<em>편지를</em> 써주세요.", lede: "모두 읽습니다. 답은 천천히, 그리고 의도적으로.", body: "", cta: "보내기 →" },
        en: { eyebrow: "Write a Letter", h2: "Write me a <em>letter.</em>", lede: "I read everything. I reply slowly, and on purpose.", body: "", cta: "Send →" }
      }
    },

    /* misc text used inside panels */
    strings: {
      ko: { closeAria: "닫기", essayMore: "더 읽기", langKo: "한국어", langEn: "EN", admin: "관리자", 
            msgPlaceholder: "남기고 싶은 말을 적어주세요...", msgSubmit: "쪽지 남기기", 
            emailSubmit: "이메일 보내기", msgSuccess: "쪽지가 보관되었습니다." },
      en: { closeAria: "Close",  essayMore: "Read more", langKo: "KO", langEn: "English", admin: "Admin",
            msgPlaceholder: "Leave a message...", msgSubmit: "Send Note", 
            emailSubmit: "Send Email", msgSuccess: "Message saved." }
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

  function loadLocal(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULTS, parsed);
    }catch(e){ return JSON.parse(JSON.stringify(DEFAULTS)); }
  }
  function saveLocal(data){
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch(e) {
      console.warn("localStorage quota exceeded for brand/founder state caching.");
    }
  }

  async function loadAsync() {
    if(!supabaseClient) return loadLocal();
    try {
      const { data, error } = await supabaseClient.from('archive_data').select('value').eq('id', 'state').single();
      if(data && data.value) {
        saveLocal(deepMerge(DEFAULTS, data.value)); // cache locally (safe)
        return deepMerge(DEFAULTS, data.value);
      }
    } catch(e) { console.error("Supabase load error:", e); }
    return loadLocal();
  }

  async function saveAsync(data) {
    saveLocal(data);
    if(supabaseClient) {
      try {
        await supabaseClient.from('archive_data').upsert({ id: 'state', value: data });
      } catch(e) { console.error("Supabase save error:", e); }
    }
  }

  async function loadItemAsync(key, defaultValue = []) {
    if(!supabaseClient) {
      try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
      } catch(e) { return defaultValue; }
    }
    try {
      const { data, error } = await supabaseClient.from('archive_data').select('value').eq('id', key).single();
      if(data && data.value) {
        let mergedVal = data.value;
        try {
          const localRaw = localStorage.getItem(key);
          if (localRaw) {
            const localVal = JSON.parse(localRaw);
            if (Array.isArray(data.value) && Array.isArray(localVal)) {
              const mergedMap = new Map();
              // Add database items first
              data.value.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
              // Merge local items (preserving local changes/new posts written offline)
              localVal.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
              mergedVal = Array.from(mergedMap.values());
            }
          }
        } catch(mergeErr) {
          console.warn("Failed to merge local and remote data:", mergeErr);
        }

        try {
          localStorage.setItem(key, JSON.stringify(mergedVal));
        } catch(localErr) {
          console.warn(`Failed to cache ${key} in localStorage (possibly quota exceeded).`);
        }
        return mergedVal;
      }
    } catch(e) { console.error("Supabase load item error:", e); }
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
    } catch(e) { return defaultValue; }
  }

  async function saveItemAsync(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(localErr) {
      console.warn(`Failed to save ${key} to localStorage (possibly quota exceeded).`);
    }
    if(supabaseClient) {
      try {
        await supabaseClient.from('archive_data').upsert({ id: key, value: value });
      } catch(e) { console.error("Supabase save item error:", e); }
    }
  }

  function reset(){ localStorage.removeItem(KEY); }

  /* lang */
  function getLang(){ return localStorage.getItem(LANG_KEY) || 'ko'; }
  function setLang(l){ localStorage.setItem(LANG_KEY, l); }

  /* admin auth */
  function getPassword(){
    const data = loadLocal();
    return (data.admin && data.admin.password) || DEFAULTS.admin.password;
  }
  function setPassword(p){
    const data = loadLocal();
    data.admin = data.admin || {};
    data.admin.password = p;
    saveLocal(data);
  }
  function isLoggedIn(){ return sessionStorage.getItem(SESSION_KEY) === 'ok'; }
  function login(p){
    if(p === getPassword()){ sessionStorage.setItem(SESSION_KEY,'ok'); return true; }
    return false;
  }
  function logout(){ sessionStorage.removeItem(SESSION_KEY); }

  return {
    DEFAULTS, load: loadLocal, save: saveLocal, reset,
    loadAsync, saveAsync, loadItemAsync,
    saveItemAsync,
    getLang: () => localStorage.getItem(LANG_KEY) || 'ko',
    setLang: (l) => localStorage.setItem(LANG_KEY, l),
    getPassword, setPassword,
    isLoggedIn, login, logout
  };
})();
