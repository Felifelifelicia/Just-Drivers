/* =========================================================
   数据层：已配置 Supabase 时用数据库，否则用浏览器本地存储（演示模式）。
   ========================================================= */
(function () {
  const cfg = window.HW_CONFIG || {};
  const remote = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

  function safeGet(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 存储不可用时忽略 */ }
  }
  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  /* 匿名 ID：每个浏览器一个，用于把前后测配对，不包含任何个人信息 */
  let anonId = safeGet("hw_anon_id", null);
  if (!anonId) { anonId = uid(); safeSet("hw_anon_id", anonId); }

  /* ---------- Supabase REST ---------- */
  async function api(path, opts = {}) {
    const res = await fetch(cfg.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/" + path, {
      method: opts.method || "GET",
      headers: {
        apikey: cfg.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + cfg.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        Prefer: opts.prefer || "return=representation"
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  /* ---------- 本地演示数据 ---------- */
  const L = {
    posts: () => safeGet("hw_demo_posts", []),
    replies: () => safeGet("hw_demo_replies", []),
    results: () => safeGet("hw_demo_results", []),
    reports: () => safeGet("hw_demo_reports", [])
  };

  const Store = {
    remote,
    anonId,

    /* 本人的测试记录（只存在本浏览器，用来显示前后变化） */
    getMine(key) { return safeGet("hw_mine_" + key, null); },
    setMine(key, value) { safeSet("hw_mine_" + key, value); },

    async saveResult(row) {
      const full = Object.assign({ anon_id: anonId }, row);
      if (remote) {
        await api("test_results", { method: "POST", body: full, prefer: "return=minimal" });
      } else {
        const all = L.results(); full.created_at = new Date().toISOString(); all.push(full);
        safeSet("hw_demo_results", all);
      }
    },

    /* 论坛弹窗用：完成第二次测试的人数，以及其中“不再用性别标签看待驾驶”的人数 */
    async normStats() {
      if (remote) {
        const r = await api("rpc/norm_stats", { method: "POST", body: {} });
        return { n: r.n || 0, free: r.free || 0 };
      }
      const latest = {};
      L.results().filter(r => r.test === "attitude" && r.phase === "post")
        .forEach(r => { latest[r.anon_id] = r; });
      const rows = Object.values(latest);
      return { n: rows.length, free: rows.filter(r => r.g_count === 0 && r.s9 <= 3).length };
    },

    async listPosts(category) {
      if (remote) {
        let q = "posts?select=*&hidden=eq.false&order=created_at.desc&limit=100";
        if (category && category !== "all") q += "&category=eq." + encodeURIComponent(category);
        return api(q);
      }
      return L.posts().filter(p => !p.hidden && (!category || category === "all" || p.category === category))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    async getPost(id) {
      if (remote) {
        const rows = await api("posts?select=*&hidden=eq.false&id=eq." + encodeURIComponent(id));
        return rows[0] || null;
      }
      return L.posts().find(p => p.id === id && !p.hidden) || null;
    },

    async createPost({ category, title, body, nickname }) {
      const row = { anon_id: anonId, category, title, body, nickname: nickname || null };
      if (remote) return (await api("posts", { method: "POST", body: row }))[0];
      const all = L.posts();
      Object.assign(row, { id: uid(), created_at: new Date().toISOString(), hidden: false });
      all.push(row); safeSet("hw_demo_posts", all); return row;
    },

    async listReplies(postId) {
      if (remote) return api("replies?select=*&hidden=eq.false&order=created_at.asc&post_id=eq." + encodeURIComponent(postId));
      return L.replies().filter(r => r.post_id === postId && !r.hidden)
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
    },

    async createReply({ postId, body, nickname }) {
      const row = { anon_id: anonId, post_id: postId, body, nickname: nickname || null };
      if (remote) return (await api("replies", { method: "POST", body: row }))[0];
      const all = L.replies();
      Object.assign(row, { id: uid(), created_at: new Date().toISOString(), hidden: false });
      all.push(row); safeSet("hw_demo_replies", all); return row;
    },

    async report(targetType, targetId) {
      const row = { target_type: targetType, target_id: targetId, anon_id: anonId };
      if (remote) {
        try { await api("reports", { method: "POST", body: row, prefer: "return=minimal" }); }
        catch (e) { if (!String(e.message).includes("409")) throw e; } // 重复举报忽略
        return;
      }
      const reps = L.reports();
      if (!reps.some(r => r.target_type === targetType && r.target_id === targetId && r.anon_id === anonId)) {
        reps.push(row); safeSet("hw_demo_reports", reps);
      }
    },

    hasReported(targetType, targetId) {
      return (safeGet("hw_my_reports", [])).includes(targetType + ":" + targetId);
    },
    markReported(targetType, targetId) {
      const mine = safeGet("hw_my_reports", []); mine.push(targetType + ":" + targetId);
      safeSet("hw_my_reports", mine);
    }
  };

  window.HW_STORE = Store;
})();
