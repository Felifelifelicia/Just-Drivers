/* =========================================================
   配置：连接 Supabase 后，把下面两项填上即可（见 README 第 3 步）。
   两项都留空时，网站以“演示模式”运行，数据只保存在本人浏览器里。
   anon key 是公开密钥，可以放在网页里；service_role key 绝对不要放进来。
   ========================================================= */
window.HW_CONFIG = {
  SUPABASE_URL: "xilohvrrmqtjzbjucbvq",        // 例如 "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbG9odnJybXF0anpianVjYnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NTQwNjIsImV4cCI6MjEwNjQzMDA2Mn0.0ui7FvC_CS5CTBMJGObo64lUWO-EC32VG1TsU1mlKLk",   // Project Settings → API → anon public

  // 论坛弹窗：完成第二次测试的人数达到这个数之前，显示“越来越多的同行者……”，
  // 达到之后才显示具体人数和百分比，避免样本太小时数字误导人。
  NORM_MIN_N: 30,

  // 比例低于这个值时也改用“越来越多”的说法（少数规范可能产生反效果）
  NORM_MIN_PCT: 50
};
