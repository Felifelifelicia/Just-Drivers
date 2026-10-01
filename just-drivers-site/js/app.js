/* =========================================================
   她的方向盘 / Her Wheel — 主程序
   ========================================================= */
(function () {
  const I18N = window.HW_I18N, RT = window.HW_RESULT_TEXT, C = window.HW_CONTENT;
  const Store = window.HW_STORE, CFG = window.HW_CONFIG || {};
  const app = document.getElementById("app");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 语言 ---------- */
  function initialLang() {
    try { const s = localStorage.getItem("hw_lang"); if (s && I18N[s]) return s; } catch (e) {}
    const n = (navigator.language || "").toLowerCase();
    if (n.startsWith("ko")) return "ko";
    return "zh";
  }
  let lang = initialLang();
  const HTML_LANG = { zh: "zh-CN", en: "en", ko: "ko" };
  const LOCALE = { zh: "zh-CN", en: "en-AU", ko: "ko-KR" };

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || I18N.zh[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  /* 内容文字：{zh, en, ko}，韩文缺省时用英文 */
  function L(obj, vars) {
    if (obj == null) return "";
    let s = typeof obj === "string" ? obj : (obj[lang] || (lang === "ko" ? obj.en : null) || obj.zh || obj.en || "");
    if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(LOCALE[lang], { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return ""; }
  }

  const ARROW = '<span class="btn-arrow" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/></svg></span>';
  const EXT = '<svg class="ext" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9"/></svg>';

  /* ---------- 顶部导航 ---------- */
  const NAV = [["", "navHome"], ["videos", "navVideos"], ["quiz", "navQuiz"], ["data", "navData"], ["forum", "navForum"]];

  function renderHeader(route) {
    const top = route.split("/")[0];
    document.getElementById("site-header").innerHTML = `
      <div class="wrap header-inner">
        <a class="brand" href="#/">
          <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="3"/><path d="M4.5 13.5c4 .8 7.6 1.3 11.5 1.3s7.5-.5 11.5-1.3M16 19v9"/></svg>
          <span>${esc(t("siteName"))}</span>
        </a>
        <nav class="main-nav" aria-label="${esc(t("siteName"))}">
          ${NAV.map(([r, k]) => `<a href="#/${r}" ${top === r ? 'aria-current="page"' : ""}>${esc(t(k))}</a>`).join("")}
        </nav>
        <div class="lang-switch" role="group" aria-label="${esc(t("langLabel"))}">
          ${[["zh", "中"], ["en", "EN"], ["ko", "한"]].map(([c, label]) =>
            `<button type="button" data-lang="${c}" aria-pressed="${c === lang}">${label}</button>`).join("")}
        </div>
      </div>`;
    document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => {
      lang = b.dataset.lang;
      try { localStorage.setItem("hw_lang", lang); } catch (e) {}
      render();
    }));
  }

  function renderFooter() {
    document.getElementById("site-footer").innerHTML = `
      <div class="wrap footer-inner">
        <p class="footer-brand">${esc(t("siteName"))}</p>
        <p>${esc(t("footerNote"))}</p>
      </div>`;
  }

  /* ---------- 首页 ---------- */
  let stopScene = null;

  function attitudeState() {
    return { pre: Store.getMine("att_pre"), post: Store.getMine("att_post") };
  }

  const NOTE_DOODLE = `<svg class="note-doodle" viewBox="0 0 120 60" aria-hidden="true"><path d="M8 44c3-12 12-15 22-16l8-11c3-4 7-5 12-5h26c6 0 9 3 12 7l7 9c9 1 15 5 15 15"/><path d="M6 45h104"/><circle cx="32" cy="46" r="7"/><circle cx="88" cy="46" r="7"/><path d="M46 28l4-9h22l5 9"/></svg>`;

  function journeyNote(extraClass) {
    const s = attitudeState();
    let title, body, btn;
    if (!s.pre) { title = t("preTitle"); body = t("preBody"); btn = t("preBtn"); }
    else if (!s.post) { title = t("preDoneTitle"); body = t("preDoneBody"); btn = t("postBtn"); }
    else { title = t("bothDoneTitle"); body = t("bothDoneBody"); btn = t("seeResultBtn"); }
    return `
      <section class="note clay ${extraClass || ""}">
        ${NOTE_DOODLE}
        <div class="note-text">
          <p class="note-sign">${esc(t("noteSign"))}</p>
          <h2>${esc(title)}</h2>
          <p>${esc(body)}</p>
        </div>
        <a class="btn btn-ink" href="#/quiz/attitude">${esc(btn)}${ARROW}</a>
      </section>`;
  }

  function filmCard(f, i) {
    return `
      <figure class="print print-${i}${f.feature ? " feature" : ""}" tabindex="0">
        <div class="print-photo">
          <img src="${esc(f.img)}" alt="${esc(L(f.title))}" loading="lazy">
          <p class="print-note">${esc(L(f.note))}</p>
        </div>
        <figcaption>
          <h3>${esc(L(f.title))}<span class="year">${esc(f.year)}</span></h3>
          <p class="hook">${esc(L(f.hook))}</p>
          <p class="print-note-touch">${esc(L(f.note))}</p>
        </figcaption>
      </figure>`;
  }

  function viewHome() {
    app.innerHTML = `
      <section class="hero wrap">
        <h1 class="chalk">${esc(t("heroTitle"))}</h1>
        <p class="lede">${esc(t("heroSub"))}</p>
      </section>
      <div class="wrap">
        <div class="scene-frame clay">
          <canvas class="scene" tabindex="0" role="img" aria-label="${esc(t("sceneLabel"))}"></canvas>
        </div>
      </div>
      <div class="wrap">${journeyNote()}</div>
      <section class="wrap films-home">
        <header class="films-head">
          <h2 class="chalk">${esc(t("filmsTitle"))}</h2>
          <p>${esc(t("filmsIntro"))}</p>
        </header>
        <div class="film-wall">${C.films.map(filmCard).join("")}</div>
      </section>`;

    const canvas = app.querySelector("canvas.scene");
    if (window.HW_SCENE) {
      stopScene = window.HW_SCENE.mount(canvas, {
        honkText: () => t("honk"),
        handFont: '"Indie Flower", "Xiaolai SC", "Gaegu", cursive'
      });
    }
    app.querySelectorAll(".print").forEach(p => {
      p.addEventListener("click", () => p.classList.toggle("open"));
      p.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); p.classList.toggle("open"); } });
    });
  }

  /* ---------- 视频：叠放封面 ---------- */
  function deck(list, id) {
    return `
      <div class="deck-wrap">
        <div class="deck" id="${id}" style="--n:${list.length}">
          ${list.map((v, i) => `
            <a class="deck-card" href="${esc(v.url)}" target="_blank" rel="noopener" data-i="${i}" style="--i:${i}"
               aria-label="@${esc(v.creator)}：${esc(L(v.title))}（${esc(t("watchOnDouyin"))}）">
              <img src="${esc(v.cover)}" alt="" loading="lazy">
              <span class="deck-cap-touch"><span class="creator">@${esc(v.creator)}</span>${esc(L(v.title))}</span>
            </a>`).join("")}
        </div>
        <p class="deck-cap" aria-hidden="true"><span class="creator"></span><span class="v-title"></span></p>
      </div>`;
  }

  function wireDeck(el, list) {
    const cards = Array.from(el.querySelectorAll(".deck-card"));
    const cap = el.parentElement.querySelector(".deck-cap");
    function setActive(a) {
      cards.forEach((c, i) => {
        const d = a < 0 ? 0 : i - a;
        c.style.setProperty("--d", d);
        c.style.setProperty("--ad", Math.abs(d));
        c.classList.toggle("active", i === a);
        c.style.zIndex = a < 0 ? i + 1 : 100 - Math.abs(d);
      });
      if (a >= 0) {
        cap.querySelector(".creator").textContent = "@" + list[a].creator;
        cap.querySelector(".v-title").textContent = L(list[a].title);
        cap.classList.add("on");
      } else cap.classList.remove("on");
    }
    el.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const a = Math.max(0, Math.min(cards.length - 1, Math.floor((e.clientX - r.left) / r.width * cards.length)));
      setActive(a);
    });
    el.addEventListener("pointerleave", () => setActive(-1));
    cards.forEach((c, i) => {
      c.addEventListener("focus", () => setActive(i));
      c.addEventListener("blur", () => setActive(-1));
    });
    setActive(-1);
  }

  function postTestNudge() {
    const s = attitudeState();
    if (!s.pre || s.post) return "";
    return journeyNote("quiet");
  }

  function viewVideos() {
    app.innerHTML = `
      <div class="wrap page">
        <header class="page-head">
          <h1 class="chalk">${esc(t("videosTitle"))}</h1>
          <p class="lede">${esc(t("videosIntro"))}</p>
        </header>
        <section class="video-group">
          <div class="group-head"><h2>${esc(t("groupTalk"))}</h2><p>${esc(t("groupTalkDesc"))}</p></div>
          ${deck(C.videos.talk, "deck-talk")}
        </section>
        <section class="video-group">
          <div class="group-head"><h2>${esc(t("groupDrive"))}</h2><p>${esc(t("groupDriveDesc"))}</p></div>
          ${deck(C.videos.drive, "deck-drive")}
        </section>
        ${postTestNudge()}
      </div>`;
    wireDeck(document.getElementById("deck-talk"), C.videos.talk);
    wireDeck(document.getElementById("deck-drive"), C.videos.drive);
  }

  /* ---------- 通用测试引擎 ---------- */
  function runQuiz(mount, items, onDone) {
    let i = 0;
    const ans = items.map(it => (it.kind === "multi" ? [] : null));

    function answered(k) { return items[k].kind === "multi" || ans[k] !== null; }

    function draw() {
      const it = items[i];
      let body = "";
      if (it.kind === "single" || it.kind === "multi") {
        body = `<div class="options" role="${it.kind === "multi" ? "group" : "radiogroup"}" aria-labelledby="q-text">
          ${it.opts.map((o, k) => {
            const on = it.kind === "multi" ? ans[i].includes(k) : ans[i] === k;
            return `<button type="button" class="option" data-k="${k}" role="${it.kind === "multi" ? "checkbox" : "radio"}" aria-checked="${on}">${esc(L(o))}</button>`;
          }).join("")}
        </div>
        ${it.kind === "multi" ? `<p class="hint">${esc(t("multiHint"))}</p>` : ""}`;
      } else {
        const max = it.kind === "rating" ? 10 : 7;
        const lo = it.kind === "rating" ? t("selfRateLow") : t("scaleLow");
        const hi = it.kind === "rating" ? t("selfRateHigh") : t("scaleHigh");
        body = `<div class="scale" role="radiogroup" aria-labelledby="q-text">
            ${Array.from({ length: max }, (_, k) => k + 1).map(v =>
              `<button type="button" class="scale-btn" data-v="${v}" role="radio" aria-checked="${ans[i] === v}">${v}</button>`).join("")}
          </div>
          <div class="scale-ends"><span>${esc(lo)}</span><span>${esc(hi)}</span></div>`;
      }
      const last = i === items.length - 1;
      mount.innerHTML = `
        <div class="quiz-card">
          <div class="progress" aria-hidden="true"><span style="width:${((i + 1) / items.length) * 100}%"></span></div>
          <p class="q-count">${esc(t("progress", { i: i + 1, n: items.length }))}</p>
          <h2 id="q-text" class="q-text" tabindex="-1">${esc(L(it.q))}</h2>
          ${body}
          <div class="quiz-nav">
            ${i > 0 ? `<button type="button" class="btn-text" data-act="prev">${esc(t("prevBtn"))}</button>` : "<span></span>"}
            <button type="button" class="btn btn-ink" data-act="next" ${answered(i) ? "" : "disabled"}>${esc(last ? t("finishBtn") : t("nextBtn"))}${ARROW}</button>
          </div>
        </div>`;

      mount.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
        const k = Number(b.dataset.k);
        if (it.kind === "multi") {
          const pos = ans[i].indexOf(k); pos >= 0 ? ans[i].splice(pos, 1) : ans[i].push(k);
        } else ans[i] = k;
        draw(); focusAfter('[data-k="' + k + '"]');
      }));
      mount.querySelectorAll(".scale-btn").forEach(b => b.addEventListener("click", () => {
        ans[i] = Number(b.dataset.v); draw(); focusAfter('[data-v="' + b.dataset.v + '"]');
      }));
      const prev = mount.querySelector('[data-act="prev"]');
      if (prev) prev.addEventListener("click", () => { i--; draw(); focusQ(); });
      mount.querySelector('[data-act="next"]').addEventListener("click", () => {
        if (!answered(i)) return;
        if (last) onDone(ans); else { i++; draw(); focusQ(); }
      });
    }
    function focusQ() { const q = mount.querySelector("#q-text"); if (q) q.focus({ preventScroll: false }); }
    function focusAfter(sel) { const el = mount.querySelector(sel); if (el) el.focus(); }
    draw();
  }

  /* ---------- 测试列表 ---------- */
  function viewQuizList() {
    const s = attitudeState();
    const attDesc = !s.pre ? t("attitudeDescPre") : !s.post ? t("attitudeDescPost") : t("attitudeDescDone");
    app.innerHTML = `
      <div class="wrap page narrow">
        <header class="page-head">
          <h1>${esc(t("quizTitle"))}</h1>
          <p class="lede">${esc(t("quizIntro"))}</p>
        </header>
        <div class="quiz-choices">
          <a class="quiz-choice" href="#/quiz/driver">
            <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="4"/><path d="M7.5 21c5.5 1.2 11 1.8 16.5 1.8S35 22.2 40.5 21M24 28v13"/></svg>
            <h2>${esc(t("driverTitle"))}</h2>
            <p>${esc(t("driverDesc"))}</p>
            <span class="btn">${esc(t("startBtn"))}${ARROW}</span>
          </a>
          <a class="quiz-choice" href="#/quiz/attitude">
            <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 14h20l8 10-8 10H10z"/><path d="M17 24h11"/></svg>
            <h2>${esc(t("attitudeTitle"))}</h2>
            <p>${esc(attDesc)}</p>
            <span class="btn">${esc(s.pre && s.post ? t("seeResultBtn") : t("startBtn"))}${ARROW}</span>
          </a>
        </div>
      </div>`;
  }

  /* ---------- 测试一：驾驶类型 ---------- */
  function scoreDriver(ans) {
    const qs = C.driverQuiz.questions;
    let exp = 0, strat = 0;
    qs.forEach((q, k) => {
      const a = ans[k + 1];
      let v;
      if (q.multi) { const n = a.length; v = n <= 1 ? 0 : n === 2 ? 1 : n <= 4 ? 2 : 3; }
      else v = a;
      if (q.dim === "exp") exp += v; else strat += v;
    });
    const type = (exp >= 6 ? "high" : "low") + "-" + (strat >= 6 ? "explore" : "plan");
    const self = ans[0];
    const habit = Math.max(1, Math.round(exp / 12 * 10));
    const gap = habit - self >= 2 ? "gapBetter" : self - habit >= 3 ? "gapConfident" : "gapAccurate";
    return { exp, strat, type, self, habit, gap };
  }

  function driverResultHTML(r) {
    const ty = C.driverQuiz.types[r.type];
    return `
      <article class="result">
        <p class="result-kicker">${esc(t("yourType"))}</p>
        <h2 class="result-name">${esc(L(ty.name))}</h2>
        <p class="result-tag">${esc(L(ty.tag))}</p>
        <p class="result-body">${esc(L(ty.body))}</p>
        <div class="result-gap">${esc(L(RT[r.gap], { self: r.self, habit: r.habit }))}</div>
        <div class="result-tip"><h3>${esc(t("growthTip"))}</h3><p>${esc(L(ty.tip))}</p></div>
        <p class="result-closing">${esc(L(RT.closing))}</p>
        <p class="result-respect">${esc(t("resultRespect"))}</p>
        <div class="result-actions">
          <a class="btn btn-ink" href="#/data">${esc(t("toData"))}${ARROW}</a>
          <button type="button" class="btn-text" data-act="retake">${esc(t("retakeBtn"))}</button>
        </div>
      </article>`;
  }

  function viewDriver() {
    app.innerHTML = `
      <div class="wrap page narrow">
        <a class="back" href="#/quiz">${esc(t("toQuizList"))}</a>
        <header class="page-head"><h1>${esc(t("driverTitle"))}</h1><p class="lede">${esc(t("driverDesc"))}</p></header>
        <div id="quiz-mount"></div>
      </div>`;
    const mount = document.getElementById("quiz-mount");
    const items = [{ kind: "rating", q: C.driverQuiz.selfRate }].concat(
      C.driverQuiz.questions.map(q => ({ kind: q.multi ? "multi" : "single", q: q.q, opts: q.opts })));

    function start() {
      runQuiz(mount, items, ans => {
        const r = scoreDriver(ans);
        Store.setMine("driver", r);
        Store.saveResult({ test: "driver", phase: "single", answers: ans, driver_type: r.type }).catch(() => {});
        showResult(r);
      });
    }
    function showResult(r) {
      mount.innerHTML = driverResultHTML(r);
      mount.querySelector('[data-act="retake"]').addEventListener("click", start);
      mount.querySelector(".result-name").setAttribute("tabindex", "-1");
      mount.querySelector(".result-name").focus();
    }
    const prev = Store.getMine("driver");
    if (prev && C.driverQuiz.types[prev.type]) showResult(prev); else start();
  }

  /* ---------- 测试二：态度前后测 ---------- */
  function attitudeItems(form) {
    const a = C.attitudeQuiz;
    return a.forms[form].map(q => ({ kind: "single", q: q.q, opts: q.opts }))
      .concat(a.scale.map(s => ({ kind: "scale", q: s.q, id: s.id })));
  }
  function scoreAttitude(form, ans) {
    const qs = C.attitudeQuiz.forms[form];
    const codes = qs.map((q, k) => q.opts[ans[k]].code);
    const n = qs.length;
    return {
      form, codes,
      g: codes.filter(c => c === "G").length,
      p: codes.filter(c => c === "P").length,
      s7: ans[n], s8: ans[n + 1], s9: ans[n + 2]
    };
  }
  function compareLines(pre, post) {
    const lines = [];
    if (post.g === 0) lines.push(L(RT.gZero));
    if (pre) {
      if (post.g < pre.g) lines.push(L(RT.gDown));
      if (post.p < pre.p) lines.push(L(RT.pDown));
      if (post.s8 > pre.s8) lines.push(L(RT.s8Up));
      if (post.s7 < pre.s7) lines.push(L(RT.s7Down));
      if (post.s9 < pre.s9) lines.push(L(RT.s9Down));
    }
    if (!lines.length) lines.push(L(RT.noChange));
    return lines;
  }

  function viewAttitude() {
    app.innerHTML = `
      <div class="wrap page narrow">
        <a class="back" href="#/quiz">${esc(t("toQuizList"))}</a>
        <header class="page-head"><h1>${esc(t("attitudeTitle"))}</h1></header>
        <div id="quiz-mount"></div>
      </div>`;
    const mount = document.getElementById("quiz-mount");
    const s = attitudeState();

    function save(phase, r) {
      Store.saveResult({
        test: "attitude", phase, form: r.form, answers: r.codes,
        g_count: r.g, p_count: r.p, s7: r.s7, s8: r.s8, s9: r.s9
      }).catch(() => {});
    }

    function consent(next) {
      mount.innerHTML = `
        <div class="quiz-card consent">
          <h2>${esc(t("consentTitle"))}</h2>
          <p>${esc(t("consentBody"))}</p>
          <button type="button" class="btn btn-ink" data-act="go">${esc(t("consentAgree"))}${ARROW}</button>
        </div>`;
      mount.querySelector('[data-act="go"]').addEventListener("click", next);
    }

    function runPre() {
      runQuiz(mount, attitudeItems("A"), ans => {
        const r = scoreAttitude("A", ans);
        Store.setMine("att_pre", r); save("pre", r);
        mount.innerHTML = `
          <div class="quiz-card">
            <h2 tabindex="-1">${esc(t("preThanksTitle"))}</h2>
            <p>${esc(t("preThanksBody"))}</p>
            <a class="btn btn-ink" href="#/">${esc(t("startJourney"))}${ARROW}</a>
          </div>`;
        mount.querySelector("h2").focus();
      });
    }
    function runPost() {
      runQuiz(mount, attitudeItems("B"), ans => {
        const r = scoreAttitude("B", ans);
        Store.setMine("att_post", r); save("post", r);
        showCompare();
      });
    }
    function showCompare() {
      const st = attitudeState();
      const lines = compareLines(st.pre, st.post);
      mount.innerHTML = `
        <article class="result">
          <h2 class="result-name" tabindex="-1">${esc(t("postResultTitle"))}</h2>
          ${st.pre ? "" : `<p class="result-body">${esc(t("noPreNote"))}</p>`}
          <ul class="change-list">${lines.map(l => `<li>${esc(l)}</li>`).join("")}</ul>
          <p class="result-respect">${esc(t("resultRespect"))}</p>
          <div class="result-actions">
            <a class="btn btn-ink" href="#/forum">${esc(t("enterForum"))}${ARROW}</a>
          </div>
        </article>`;
      mount.querySelector(".result-name").focus();
    }

    if (!s.pre) consent(runPre);
    else if (!s.post) {
      mount.innerHTML = `
        <div class="quiz-card consent">
          <h2>${esc(t("postBtn"))}</h2>
          <p>${esc(t("attitudeDescPost"))}</p>
          <button type="button" class="btn btn-ink" data-act="go">${esc(t("startBtn"))}${ARROW}</button>
        </div>`;
      mount.querySelector('[data-act="go"]').addEventListener("click", runPost);
    } else showCompare();
  }

  /* ---------- 数据 ---------- */
  function sourceCard(src) {
    return `
      <li class="source clay">
        <h3>${esc(L(src.name))}</h3>
        <p class="source-desc">${esc(L(src.desc))}</p>
        <dl class="stats">${(src.stats || []).map(s => `<div class="stat"><dd>${esc(L(s.value))}</dd><dt>${esc(L(s.label))}</dt></div>`).join("")}</dl>
        ${src.url ? `<a class="source-link" href="${esc(src.url)}" target="_blank" rel="noopener">${esc(t("viewSource"))}${EXT}</a>` : ""}
      </li>`;
  }

  function viewData() {
    const regions = [["regionChina", C.dataSources.china], ["regionKorea", C.dataSources.korea], ["regionGlobal", C.dataSources.global]];
    app.innerHTML = `
      <div class="wrap page">
        <header class="page-head">
          <h1 class="chalk">${esc(t("dataTitle"))}</h1>
          <p class="norm-quote">${esc(t("dataNorm"))}</p>
          <p class="lede">${esc(t("dataIntro"))}</p>
        </header>
        ${regions.map(([k, list]) => `
          <section class="region">
            <h2>${esc(t(k))}</h2>
            <ul class="source-list">${list.map(sourceCard).join("")}</ul>
          </section>`).join("")}
        ${postTestNudge()}
      </div>`;
  }

  /* ---------- 论坛：进入弹窗（每次进入都显示） ---------- */
  function showWelcomeModal() {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `
      <div class="modal clay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        ${NOTE_DOODLE}
        <h2 id="modal-title" class="chalk">${esc(t("popupTitle"))}</h2>
        <p>${esc(t("popupBody1"))}</p>
        <p class="modal-rule">${esc(t("popupBody2"))}</p>
        <button type="button" class="btn btn-ink" data-act="enter">${esc(t("popupAgree"))}${ARROW}</button>
      </div>`;
    document.body.appendChild(back);
    document.body.classList.add("modal-open");
    const btn = back.querySelector('[data-act="enter"]');
    btn.focus();
    function close() {
      document.body.classList.remove("modal-open");
      back.remove();
      const h = document.querySelector("#app h1"); if (h) h.focus();
    }
    btn.addEventListener("click", close);
    back.addEventListener("keydown", e => { if (e.key === "Tab") { e.preventDefault(); btn.focus(); } });
  }

  /* ---------- 论坛 ---------- */
  const CATS = [["all", "catAll"], ["help", "catHelp"], ["story", "catStory"], ["road", "catRoad"]];
  const sep = () => (lang === "zh" ? "，" : ", ");
  const catName = c => t((CATS.find(x => x[0] === c) || [, "catAll"])[1]);
  let forumCat = "all";

  function hasBlocked(text) {
    const s = text.toLowerCase();
    return C.blockedWords.some(w => {
      const word = w.toLowerCase();
      if (/^[a-z]+$/.test(word)) return new RegExp("\\b" + word + "\\b").test(s);
      return s.includes(word);
    });
  }

  function forumAside() {
    return `
      <aside class="rules">
        <h2>${esc(t("rulesTitle"))}</h2>
        <ul><li>${esc(t("rule1"))}</li><li>${esc(t("rule2"))}</li><li>${esc(t("rule3"))}</li></ul>
      </aside>`;
  }

  function viewForum() {
    app.innerHTML = `
      <div class="wrap page">
        <header class="page-head">
          <h1 tabindex="-1">${esc(t("forumTitle"))}</h1>
          <p class="lede">${esc(t("forumIntro"))}</p>
        </header>
        ${Store.remote ? "" : `<p class="demo-note">${esc(t("demoNotice"))}</p>`}
        <div class="forum-layout">
          <div>
            <div class="forum-bar">
              <div class="tabs" role="tablist">
                ${CATS.map(([c, k]) => `<button type="button" role="tab" data-cat="${c}" aria-selected="${c === forumCat}">${esc(t(k))}</button>`).join("")}
              </div>
              <button type="button" class="btn" data-act="new">${esc(t("newPost"))}${ARROW}</button>
            </div>
            <p class="forum-norm">${esc(t("forumNorm"))}</p>
            <form class="post-form clay" hidden novalidate>
              <label>${esc(t("category"))}
                <select name="category">${CATS.slice(1).map(([c, k]) => `<option value="${c}" ${c === forumCat ? "selected" : ""}>${esc(t(k))}</option>`).join("")}</select>
              </label>
              <label>${esc(t("nickname"))}<input name="nickname" maxlength="20" autocomplete="off"></label>
              <label>${esc(t("postTitle"))}<input name="title" maxlength="80" required></label>
              <label>${esc(t("postBody"))}<textarea name="body" rows="6" maxlength="3000" required></textarea></label>
              <p class="form-msg" role="status"></p>
              <div class="form-actions">
                <button type="button" class="btn-text" data-act="cancel">${esc(t("cancel"))}</button>
                <button type="submit" class="btn btn-ink">${esc(t("publish"))}${ARROW}</button>
              </div>
            </form>
            <ul class="post-list" aria-live="polite"></ul>
          </div>
          ${forumAside()}
        </div>
      </div>`;

    const list = app.querySelector(".post-list");
    const form = app.querySelector(".post-form");
    const msg = form.querySelector(".form-msg");

    async function load() {
      try {
        const posts = await Store.listPosts(forumCat);
        list.innerHTML = posts.length ? posts.map(p => `
          <li><a class="post-row" href="#/forum/post/${encodeURIComponent(p.id)}">
            <span class="post-cat">${esc(catName(p.category))}</span>
            <h3>${esc(p.title)}</h3>
            <span class="post-meta">${esc(p.nickname || t("anonymous"))}${sep()}${esc(fmtDate(p.created_at))}</span>
          </a></li>`).join("") : `<li class="empty">${esc(t("emptyPosts"))}</li>`;
      } catch (e) { list.innerHTML = `<li class="empty">${esc(t("loadError"))}</li>`; }
    }

    app.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => {
      forumCat = b.dataset.cat;
      app.querySelectorAll("[data-cat]").forEach(x => x.setAttribute("aria-selected", x.dataset.cat === forumCat));
      load();
    }));
    app.querySelector('[data-act="new"]').addEventListener("click", () => {
      form.hidden = false; form.querySelector('[name="title"]').focus();
    });
    form.querySelector('[data-act="cancel"]').addEventListener("click", () => { form.hidden = true; form.reset(); msg.textContent = ""; });
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = String(fd.get("title") || "").trim(), body = String(fd.get("body") || "").trim();
      const nickname = String(fd.get("nickname") || "").trim();
      if (!title || !body) { msg.textContent = t("tooShort"); return; }
      if (hasBlocked(title + " " + body + " " + nickname)) { msg.textContent = t("blocked"); return; }
      try {
        await Store.createPost({ category: fd.get("category"), title, body, nickname });
        form.reset(); form.hidden = true; msg.textContent = "";
        load();
      } catch (err) { msg.textContent = t("saveError"); }
    });

    load();
    showWelcomeModal();
  }

  function reportBtn(type, id) {
    const done = Store.hasReported(type, id);
    return `<button type="button" class="btn-report" data-report="${type}:${esc(id)}" ${done ? "disabled" : ""}>${esc(done ? t("reported") : t("report"))}</button>`;
  }

  async function viewPost(id) {
    app.innerHTML = `<div class="wrap page narrow"><a class="back" href="#/forum">${esc(t("backToForum"))}</a><div id="post-mount"></div></div>`;
    const mount = document.getElementById("post-mount");
    let post, replies;
    try { post = await Store.getPost(id); replies = post ? await Store.listReplies(id) : []; }
    catch (e) { mount.innerHTML = `<p class="empty">${esc(t("loadError"))}</p>`; return; }
    if (!post) { location.hash = "#/forum"; return; }

    mount.innerHTML = `
      <article class="post-full">
        <span class="post-cat">${esc(catName(post.category))}</span>
        <h1 tabindex="-1">${esc(post.title)}</h1>
        <p class="post-meta">${esc(post.nickname || t("anonymous"))}${sep()}${esc(fmtDate(post.created_at))}</p>
        <div class="post-body">${esc(post.body)}</div>
        ${reportBtn("post", post.id)}
      </article>
      <section class="replies">
        <h2>${esc(t("replies"))}</h2>
        <ul class="reply-list">
          ${replies.length ? replies.map(r => `
            <li>
              <p class="post-meta">${esc(r.nickname || t("anonymous"))}${sep()}${esc(fmtDate(r.created_at))}</p>
              <div class="post-body">${esc(r.body)}</div>
              ${reportBtn("reply", r.id)}
            </li>`).join("") : `<li class="empty">${esc(t("noReplies"))}</li>`}
        </ul>
        <form class="reply-form clay" novalidate>
          <label>${esc(t("nickname"))}<input name="nickname" maxlength="20" autocomplete="off"></label>
          <label>${esc(t("writeReply"))}<textarea name="body" rows="4" maxlength="1500" required></textarea></label>
          <p class="form-msg" role="status"></p>
          <div class="form-actions"><button type="submit" class="btn btn-ink">${esc(t("sendReply"))}${ARROW}</button></div>
        </form>
      </section>`;

    mount.querySelectorAll("[data-report]").forEach(b => b.addEventListener("click", async () => {
      const [type, tid] = b.dataset.report.split(":");
      try { await Store.report(type, tid); Store.markReported(type, tid); b.textContent = t("reported"); b.disabled = true; }
      catch (e) { b.textContent = t("saveError"); }
    }));
    const form = mount.querySelector(".reply-form"), msg = form.querySelector(".form-msg");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const body = String(fd.get("body") || "").trim(), nickname = String(fd.get("nickname") || "").trim();
      if (!body) { msg.textContent = t("tooShort"); return; }
      if (hasBlocked(body + " " + nickname)) { msg.textContent = t("blocked"); return; }
      try { await Store.createReply({ postId: id, body, nickname }); viewPost(id); }
      catch (err) { msg.textContent = t("saveError"); }
    });
  }

  /* ---------- 路由 ---------- */
  function render() {
    if (stopScene) { stopScene(); stopScene = null; }
    document.documentElement.lang = HTML_LANG[lang];
    const route = (location.hash || "#/").replace(/^#\/?/, "");
    renderHeader(route);
    renderFooter();
    const parts = route.split("/");
    const titleKey = { videos: "navVideos", quiz: "navQuiz", data: "navData", forum: "navForum" }[parts[0]];
    document.title = titleKey ? t(titleKey) + "｜" + t("siteName") : t("siteName");

    if (parts[0] === "videos") viewVideos();
    else if (parts[0] === "quiz" && parts[1] === "driver") viewDriver();
    else if (parts[0] === "quiz" && parts[1] === "attitude") viewAttitude();
    else if (parts[0] === "quiz") viewQuizList();
    else if (parts[0] === "data") viewData();
    else if (parts[0] === "forum" && parts[1] === "post" && parts[2]) viewPost(decodeURIComponent(parts[2]));
    else if (parts[0] === "forum") viewForum();
    else viewHome();

    window.scrollTo(0, 0);
  }

  /* ---------- 方向盘光标 ---------- */
  function initWheelCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = document.createElement("div");
    el.className = "wheel-cursor is-hidden";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<svg viewBox="0 0 40 40"><g filter="url(#rough)"><circle cx="20" cy="20" r="15.5" class="w-ring"/><circle cx="20" cy="20" r="4.2" class="w-hub"/><path d="M5.5 17.5c4.5 1 9 1.6 14.5 1.6s10-.6 14.5-1.6M20 24.5v11" class="w-spoke"/></g></svg>`;
    document.body.appendChild(el);
    document.documentElement.classList.add("has-wheel");
    let x = -100, y = -100, rot = 0, target = 0;
    window.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const dx = e.clientX - x;
      x = e.clientX; y = e.clientY;
      if (!reduceMotion && Math.abs(dx) < 80) target = Math.max(-100, Math.min(100, target + dx * 1.6));
      const tEl = e.target instanceof Element ? e.target : null;
      el.classList.toggle("is-link", !!(tEl && tEl.closest("a, button, select, canvas, .print, .deck-card, [role=tab]")));
      el.classList.toggle("is-hidden", !!(tEl && tEl.closest("input, textarea")));
    });
    document.addEventListener("pointerleave", () => el.classList.add("is-hidden"));
    document.addEventListener("pointerover", e => { if (e.pointerType === "mouse" && !(e.target.closest && e.target.closest("input, textarea"))) el.classList.remove("is-hidden"); });
    (function loop() {
      target *= 0.9;
      rot += (target - rot) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot.toFixed(1)}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  window.addEventListener("hashchange", render);
  initWheelCursor();
  render();
})();
