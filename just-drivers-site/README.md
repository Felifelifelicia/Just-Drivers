# 就是司机 / Just Drivers / 그냥 운전자

消除“女司机”污名的社会倡导网站。纯静态网站（HTML + CSS + JavaScript），不需要任何构建工具。

## 文件说明

| 文件 | 用途 |
|---|---|
| `index.html` | 网站入口 |
| `css/style.css` | 全部样式（配色在文件最上方） |
| `js/content.js` | **内容**：视频、电影、两个测试的题目和结果、数据来源、论坛屏蔽词 |
| `js/i18n.js` | **界面文字**（中 / 英 / 韩） |
| `js/config.js` | 数据库连接设置 |
| `js/store.js` | 数据读写（一般不用改） |
| `js/app.js` | 页面逻辑（一般不用改） |
| `js/scene.js` | 首页蜡笔小车插画（颜色在文件开头的 `PAL`） |
| `img/covers/` | 视频封面 |
| `img/films/` | 首页电影剧照 |
| `supabase/schema.sql` | 数据库结构，复制到 Supabase 运行一次即可 |

## 1. 本地预览

直接双击 `index.html` 用浏览器打开即可。没有连接数据库时是“演示模式”：论坛帖子和测试结果只存在你自己的浏览器里。

## 2. 上传到 GitHub

1. 登录 github.com，右上角 **+** → **New repository**，名字随意（例如 `her-wheel`），选 Public，点 **Create repository**。
2. 在新仓库页面点 **uploading an existing file**，把整个文件夹里的所有文件和文件夹拖进去（保持 `css`、`js`、`supabase` 的文件夹结构），点 **Commit changes**。

## 3. 连接数据库（Supabase，免费）

1. 登录 supabase.com → **New project**，地区建议选离用户最近的（例如 Singapore 或 Sydney），设置一个数据库密码并记好。
2. 项目创建好后，左侧 **SQL Editor** → **New query**，把 `supabase/schema.sql` 的全部内容粘贴进去，点 **Run**。
3. 左侧 **Project Settings → API**，复制两项：
   - **Project URL**
   - **anon public** key（不是 service_role！）
4. 打开 `js/config.js`，把这两项分别填进 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`。在 GitHub 网页上可以直接点文件右上角的铅笔图标编辑，改完点 **Commit changes**。

填好后，论坛和测试数据就会存进数据库，所有访问者都能看到彼此的帖子。

## 4. 部署到 Netlify

1. 登录 netlify.com（可以直接用 GitHub 账号登录）→ **Add new site → Import an existing project → GitHub**，选择你的仓库。
2. **Build command 留空，Publish directory 填 `/` 或留空**，点 **Deploy**。
3. 一两分钟后会得到一个网址，例如 `xxx.netlify.app`。可以在 **Site configuration → Change site name** 改成好记的名字。

之后每次在 GitHub 上修改文件，Netlify 都会自动重新部署。

## 5. 修改内容

- **字体**：中文手写为小赖字体，英文为 Indie Flower，韩文为 Gaegu，都通过 jsDelivr 加载（`index.html` 顶部）。正文使用系统字体。
- **首页电影剧照**：`js/content.js` 里的 `films`，顺序即排版位置（第一排两张、中间一张大图、第三排两张）。换图时把新图放进 `img/films/`，改 `img` 路径即可。
- **视频封面**：放进 `img/covers/`，在 `videos` 里改 `cover` 路径。

- **视频**：`js/content.js` 里的 `videos`。如果想在网站里直接播放而不是跳转抖音，在电脑浏览器打开该视频，地址栏 `douyin.com/video/` 后面的一串数字就是视频 ID，填进对应的 `embedId`。填好后先自己测试能否正常播放，不行就留空，网站会显示跳转卡片。
- **测试题和结果文案**：`js/content.js` 里的 `driverQuiz`、`attitudeQuiz`。
- **数据**：`js/content.js` 里的 `dataSources`。核实一个来源后，把 `status` 改成 `"ready"`，并在 `stats` 里填数字，格式：
  ```js
  stats: [ { label: { zh: "每亿公里事故率（女性）", en: "Crashes per 100M km (women)" }, value: "0.00", note: { zh: "统计口径说明", en: "How it was measured" } } ]
  ```
- **界面文字和网站名称**：`js/i18n.js`（`siteName` 是网站名）。

## 6. 导出测试数据（写作业用）

Supabase 左侧 **Table Editor → test_results**，右上角 **Export → CSV**。

- `phase` 为 `pre` 是第一次测试（A 卷），`post` 是第二次测试（B 卷），同一个 `anon_id` 的两行就是同一个人的前后测。
- `g_count`：情境题中选择“基于性别的归因”的次数（0–6，越低越好）；`p_count`：选择“自我贬低”的次数。
- `s7` 刻板印象威胁，`s8` 驾驶自我效能（越高越好），`s9` 刻板印象认同（1–7）。

## 7. 论坛管理

**Table Editor → posts / replies**：把某条的 `hidden` 改成 `true` 即可隐藏，也可以直接删除整行。被 3 个不同用户举报的内容会自动隐藏。

## 8. 关于中国大陆访问

Netlify、Supabase 和 Google 字体的服务器都在海外，大陆访问可能较慢。字体加载失败时网站会自动使用系统自带的宋体和黑体，功能不受影响。上线后建议请大陆的朋友实测一次。
