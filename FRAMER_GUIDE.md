# Framer 포팅 가이드 — The Quiet Archive

이 HTML 프로토타입을 Framer로 옮길 때의 권장 구조와 정확한 모션 값입니다.

---

## 1. 프로젝트 구조

```
/ Pages
├── Home (Desktop · Tablet · Mobile, 3 breakpoints)
├── Admin (선택 — Framer는 정적이므로 보통 별도 CMS로 분리)

/ Components
├── Topbar
│   ├── BrandMark
│   └── LangToggle (variants: KO / EN)
├── FounderCard
│   ├── PortraitFrame (asset slot)
│   ├── NameBlock
│   └── Signature
├── Bookshelf
│   ├── ShelfFrame (top + sides + bottom)
│   ├── Shelf (top / bottom — 2 instances)
│   └── ShelfObject  ← 핵심 컴포넌트
├── ContentPanel (right-slide drawer)
│   └── PanelBody (slot for stagger children)
└── Overlays
    ├── FilmGrain
    └── Vignette

/ CMS Collections (Framer CMS 사용 시)
├── Objects (id, type, action, url, label_ko, label_en, shelf)
└── Panels  (objectId, lang, eyebrow, h2, lede, body, cta)
```

브레이크포인트: **Desktop 1440 / Tablet 1024 / Mobile 390**.

---

## 2. ShelfObject — Variants 설계

`ShelfObject`는 7개 오브제 모두를 커버하는 단일 컴포넌트로 만들고, **type prop**으로 비주얼을 스위치합니다.

### Props
- `type` : `notebook | book | magnifier | headphones | laptop | pen | clock`
- `label` : string
- `action` : `panel | link`
- `url` : string (action=link일 때)

### Variants
| Variant | 용도 |
|---|---|
| **Default** | 기본 상태 |
| **Hover** | 마우스 오버 — 떠오름 + 골드 글로우 |
| **Active** | 클릭 후 — 살짝 앞·우측으로 이동, 다른 오브제는 dim |
| **Dimmed** | 다른 오브제가 활성일 때 |

### Default → Hover (whileHover)
```ts
transition: { duration: 0.42, ease: [0.2, 0.7, 0.2, 1] }   // ease-out
animate: {
  z: 38,                     // translateZ(38px)
  rotateX: 7,
  rotateY: -4,
  filter: "drop-shadow(0 22px 30px rgba(0,0,0,.6)) drop-shadow(0 0 24px rgba(201,168,108,.18))"
}
// label 페이드 인: opacity 0 → 1, y -4 → 0, duration 0.42
```

### Default → Active (whileTap / onClick)
```ts
transition: { duration: 0.68, ease: [0.2, 0.75, 0.2, 1] }
animate: {
  z: 80,
  x: 20,
  scale: 1.05,
  filter: "drop-shadow(0 30px 40px rgba(0,0,0,.7)) drop-shadow(0 0 32px rgba(201,168,108,.28))"
}
```

### Dimmed (다른 오브제가 active 일 때)
```ts
animate: { opacity: 0.35, filter: "saturate(0.6) brightness(0.7)" }
transition: { duration: 0.5 }
```

---

## 3. ContentPanel — Slide-in Drawer

```ts
// initial / exit
{ x: "100%" }
// animate
{ x: 0, transition: { duration: 0.68, ease: [0.2, 0.75, 0.2, 1] } }
```

### Stagger children (panel inner)
```ts
const container = {
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
```
순서: `eyebrow → h2 → lede → body → cta`.

모바일(width < 768)에서는 width를 `100vw`로 — Framer Variants의 Breakpoint 기능으로 처리.

---

## 4. FounderCard 분리

- **PortraitFrame**은 별도 컴포넌트. 안에 `Image` 슬롯 1개를 두고, 외곽은 walnut 그라디언트 + 골드 inner stroke 4단계 box-shadow를 그대로 재현.
- **NameBlock**은 `Playfair Display 700` 54px + `em`(italic 400 gold) 분리.
- **Signature**는 텍스트 레이어에 `Cormorant Italic 38px`, `rotate: -3deg`, color = gold.

모바일에서는 카드 전체를 **center align**, 데스크탑은 left align — Layout Override로 처리.

---

## 5. 3D 느낌

Framer는 부모 프레임에 `perspective`를 직접 지원합니다.

```ts
// Bookshelf 부모 프레임
{
  perspective: 2200,
  perspectiveOrigin: "50% 45%",
  transformStyle: "preserve-3d"
}
```

ShelfObject는 자식이므로 `rotateX / rotateY / z` 만 지정하면 됩니다.

---

## 6. 필름 그레인 + Vignette

두 개의 풀스크린 오버레이를 페이지 최상단에 둡니다.

### FilmGrain
- `position: fixed`, `inset: 0`, `pointerEvents: none`, `mixBlendMode: overlay`, `opacity: 0.32`
- Background는 SVG `feTurbulence` 패턴을 data URI로. (이 프로토타입의 `.grain` 스타일을 그대로 복사)
- **선택**: 8프레임 노이즈 PNG 시퀀스를 `0.6s steps(8)`로 애니메이션하면 더 살아있는 그레인.

### Vignette
- `radial-gradient(ellipse 90% 75% at 50% 50%, transparent 40%, rgba(20,15,12,.55) 100%)`
- 단순 Frame + Background.

---

## 7. 디자인 토큰 (Framer Tokens)

```ts
const tokens = {
  color: {
    walnut:      "#2C2522",
    walnutDeep:  "#1F1A18",
    shelf:       "#3F3732",
    cream:       "#F4F0E9",
    creamCard:   "#FAF7F2",
    gold:        "#C9A86C",
    goldSoft:    "#B8985F",
    sub:         "#A89F94",
    ink:         "#2A2520"
  },
  font: {
    serif:    "Playfair Display, Noto Serif KR, serif",
    serifIt:  "Cormorant, Noto Serif KR, serif",
    sans:     "Inter, Noto Sans KR, sans-serif",
    mono:     "JetBrains Mono, monospace"
  },
  ease: {
    smoothOut: [0.2, 0.7, 0.2, 1],
    drawer:    [0.2, 0.75, 0.2, 1]
  },
  motion: {
    hover: 0.42,
    click: 0.68,
    panelStagger: 0.12
  }
};
```

이 토큰을 Framer의 `Color Styles`와 `Text Styles`에 등록해두면 일관성 있게 운영할 수 있습니다.

---

## 8. CMS 연동 (선택)

Framer CMS를 사용한다면:

1. **Objects** 컬렉션에서 7개 row를 만들고 `ShelfObject` 컴포넌트와 바인딩.
2. **Panels** 컬렉션을 두 언어로 분리하거나, 한 row에 `lang` 필드를 넣어 필터.
3. `action == "link"`일 때 `<a href={url} target="_blank">`로 감싸 클릭 시 외부 이동, 그 외에는 panel state를 토글.

향후 `localStorage` → Supabase로 마이그레이션할 때, `data.js`의 `load()` / `save()`만 비동기 fetch로 바꾸면 됩니다 — admin.html UI는 그대로 작동합니다.

---

## 9. 모바일 최적화 체크리스트

- [ ] Topbar nav는 햄버거로 collapse (Framer ComponentVariants)
- [ ] FounderCard와 Bookshelf를 vertical stack
- [ ] 책장의 frame-side / frame-top 숨김, Shelf를 일반 grid로 풀어 wrap
- [ ] ShelfObject 크기 0.75–0.85배
- [ ] ContentPanel을 `width: 100vw`로 fullscreen
- [ ] Close 버튼을 44×44 touch target으로 확대
- [ ] `prefers-reduced-motion` 미디어 쿼리에서 모든 transition을 0.01ms로

—

이 가이드를 따라가면 현재 HTML과 시각적 · 인터랙션 패리티를 유지하면서 Framer로 자연스럽게 옮길 수 있습니다.
