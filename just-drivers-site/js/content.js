/* =========================================================
   网站内容：视频、电影、测试题、数据来源
   改文案只需要改这个文件。每段文字的格式是 { zh, en, ko }，
   缺少 ko 时会自动显示 en。
   ========================================================= */

window.HW_CONTENT = {

  /* ---------- 视频 ----------
     url：抖音分享链接；cover：封面图（img/covers/）
     embedId（可选）：抖音视频 ID，填上后点击会在站内播放，留空则跳转抖音。 */
  videos: {
    talk: [
      { creator: "路易大姐姐", cover: "img/covers/louis.jpg", url: "https://v.douyin.com/mSxDoSqKUxg/", embedId: "",
        title: { zh: "好一些了，但还远远不够", en: "Better, but nowhere near enough", ko: "나아졌지만, 아직 멀었다" } },
      { creator: "圈有光", cover: "img/covers/quanyouguang.jpg", url: "https://v.douyin.com/LgeW6fFs63Q/", embedId: "",
        title: { zh: "我真求你了", en: "I'm begging you", ko: "제발 부탁이야" } },
      { creator: "粥蛋蛋蛋蛋", cover: "img/covers/zhoudan.jpg", url: "https://v.douyin.com/7H-1fnSK3hs/", embedId: "",
        title: { zh: "我们在重新定义一些词，也在重新定义世界", en: "Redefining words, and redefining the world", ko: "단어를 새로 정의하고, 세상을 새로 정의한다" } },
      { creator: "王立定", cover: "img/covers/wanglid.jpg", url: "https://v.douyin.com/t-tByoVAYiI/", embedId: "",
        title: { zh: "为什么“女司机”要被单独标出？", en: "Why are “women drivers” singled out?", ko: "왜 ‘여성 운전자’만 따로 표시할까?" } },
      { creator: "koko啊", cover: "img/covers/koko.jpg", url: "https://v.douyin.com/ni5Vd2RkYZM/", embedId: "",
        title: { zh: "被放大的马路女杀手，被忽略的真实数据", en: "The amplified “road menace” and the overlooked data", ko: "부풀려진 ‘도로 위 살인마’, 외면된 진짜 데이터" } }
    ],
    drive: [
      { creator: "小紫微", cover: "img/covers/xiaoziwei.jpg", url: "https://v.douyin.com/MH9Jlf9T-ps/", embedId: "",
        title: { zh: "因为有目标，所以一切皆有可能", en: "With a goal, anything is possible", ko: "목표가 있으니, 뭐든 할 수 있다" } },
      { creator: "小咸鱼不闲", cover: "img/covers/xianyu.jpg", url: "https://v.douyin.com/_NrdEyF9BtA/", embedId: "",
        title: { zh: "金华趴窝两天，接单去上海", en: "Two days waiting in Jinhua, then a run to Shanghai", ko: "진화에서 이틀 대기, 상하이로 출발" } },
      { creator: "胖虎Yvette", cover: "img/covers/yvette.jpg", url: "https://v.douyin.com/OoL6FANhU6I/", embedId: "",
        title: { zh: "卡车司机 5 天的工作和生活", en: "Five days in the life of a truck driver", ko: "트럭 운전사의 5일" } },
      { creator: "美丽浙江", cover: "img/covers/zhejiang.jpg", url: "https://v.douyin.com/cwbdvOwc7JI/", embedId: "",
        title: { zh: "暴雨天高速打滑，女司机“教科书式”自救", en: "Skidding on a highway in a storm: a textbook recovery", ko: "폭우 속 고속도로 미끄러짐, ‘교과서 같은’ 대처" } }
    ]
  },

  /* ---------- 首页：银幕上握住方向盘的她们（仅展示）
     顺序即排版顺序：第一排两张，中间一张大图，第三排两张。 ---------- */
  films: [
    { img: "img/films/letty.jpg", year: "2001",
      title: { zh: "速度与激情", en: "The Fast and the Furious", ko: "분노의 질주" },
      hook: { zh: "摘下墨镜，换挡，出发。", en: "Sunglasses off. Shift. Go.", ko: "선글라스를 벗고, 기어를 넣고, 출발." },
      note: { zh: "莱蒂（米歇尔·罗德里格兹饰）是这个系列中最具代表性的女车手。在第一部的“赛车大战”（Race Wars）段落里，她自信地摘下墨镜，熟练地换挡、踩下油门，在引擎轰鸣中冲了出去。",
              en: "Letty (Michelle Rodriguez) is the series' most iconic woman racer. At Race Wars in the first film, she slips off her sunglasses, shifts with ease, hits the accelerator and launches off the line to the roar of the engine." } },
    { img: "img/films/drivemycar.jpg", year: "2021",
      title: { zh: "驾驶我的车", en: "Drive My Car", ko: "드라이브 마이 카" },
      hook: { zh: "最平稳的驾驶，也最能让人放下心防。", en: "The smoothest driving lets people lower their guard.", ko: "가장 부드러운 운전이 마음의 벽도 허문다." },
      note: { zh: "司机渡利美咲的驾驶极其平稳顺畅，平稳到坐在后座的人几乎忘了自己在车里。电影里有大量她驾驶红色萨博 900 的远景与车内特写。随着车轮向前，两个孤独的人慢慢卸下心防，完成了各自的救赎与和解。",
              en: "Misaki Watari drives so smoothly that her passenger almost forgets he is in a car. The film lingers on her red Saab 900, in wide shots and close-ups. As the wheels roll on, two lonely people slowly let their guard down and find their own kind of reconciliation." } },
    { img: "img/films/thelma.jpg", year: "1991", feature: true,
      title: { zh: "末路狂花", en: "Thelma & Louise", ko: "델마와 루이스" },
      hook: { zh: "她们把油门踩到底，也把自由握在手里。", en: "Foot to the floor, freedom in their hands.", ko: "가속페달을 끝까지 밟고, 자유를 손에 쥐었다." },
      note: { zh: "苏珊·萨兰登与吉娜·戴维斯驾驶一辆 1966 年款福特雷鸟敞篷车，在美国西部的荒漠中疾驰。影片最后，面对层层包围的警车，两人紧握双手，把油门踩到底，冲向大峡谷。这一幕成为影史上关于女性追求自由与反叛最震撼的定格之一。",
              en: "Susan Sarandon and Geena Davis race a 1966 Ford Thunderbird convertible across the American West. In the final scene, surrounded by police cars, they hold hands, floor the accelerator and drive toward the Grand Canyon, one of cinema's most powerful images of women claiming freedom." } },
    { img: "img/films/furiosa.jpg", year: "2024",
      title: { zh: "疯狂的麦克斯：狂暴女神", en: "Furiosa: A Mad Max Saga", ko: "퓨리오사: 매드맥스 사가" },
      hook: { zh: "她握紧方向盘，从荒漠里开出一条自己的路。", en: "Hands on the wheel, she cuts her own road through the wasteland.", ko: "운전대를 꽉 쥐고, 황무지에 자신만의 길을 낸다." },
      note: { zh: "年轻的芙莉欧莎（安雅·泰勒-乔伊饰）幼年被掳离家园，在末日荒漠中长大。她学会驾驶战车，在一次次公路追逐中突围，一步步走上回家的路。",
              en: "Taken from her home as a child, young Furiosa (Anya Taylor-Joy) grows up in a post-apocalyptic wasteland. She learns to drive the war machines and fights her way through chase after chase, step by step, toward home." } },
    { img: "img/films/chuzou.jpg", year: "2024",
      title: { zh: "出走的决心", en: "Like a Rolling Stone" },
      hook: { zh: "五十岁，她第一次握住属于自己的方向盘。", en: "At fifty, she takes a wheel of her own for the first time.", ko: "쉰 살, 처음으로 자신의 운전대를 잡다." },
      note: { zh: "拿到驾照后，五十岁的李红独自开着一辆小车，驶出了困住她半生的家。她一路开向远方，在旅途中第一次学会为自己做决定。电影改编自“自驾游阿姨”苏敏的真实经历。",
              en: "After getting her licence, fifty-year-old Li Hong drives away alone from the home that confined her for half her life. On the road she learns, for the first time, to make her own decisions. The film is based on the real story of Su Min, the woman known in China as the “road-trip auntie”." } }
  ],

  /* ---------- 测试一：你是哪种司机？ ---------- */
  driverQuiz: {
    selfRate: { zh: "开始之前：如果满分 10 分，你会给自己的驾驶水平打几分？",
                en: "Before we start: out of 10, how would you rate your own driving?" },
    questions: [
      { dim: "exp", q: { zh: "过去一年，你大概多久开一次车？", en: "Over the past year, how often have you driven?" },
        opts: [
          { zh: "几乎没开过", en: "Hardly ever" },
          { zh: "每月一两次", en: "Once or twice a month" },
          { zh: "每周几次", en: "A few times a week" },
          { zh: "几乎每天", en: "Almost every day" } ] },
      { dim: "exp", q: { zh: "变道前，你通常会做哪些事？", en: "Before changing lanes, what do you usually do?" },
        opts: [
          { zh: "还不太确定该怎么做", en: "I'm not sure what to do yet" },
          { zh: "打灯就变", en: "Signal and go" },
          { zh: "看后视镜、打灯再变", en: "Check my mirrors, signal, then move" },
          { zh: "看后视镜、打灯，再回头确认盲区", en: "Check my mirrors, signal, and look over my shoulder for the blind spot" } ] },
      { dim: "exp", q: { zh: "你独立开过最远的一次是？", en: "What's the longest trip you've driven on your own?" },
        opts: [
          { zh: "还没独立上过路", en: "I haven't driven solo yet" },
          { zh: "市区几公里内", en: "A few kilometres around town" },
          { zh: "跨区或去城郊", en: "Across the city or out to the suburbs" },
          { zh: "高速长途或跨城", en: "A long highway trip or to another city" } ] },
      { dim: "exp", multi: true,
        q: { zh: "下面这些路况，你独立开过哪些？", en: "Which of these have you driven in on your own?" },
        opts: [
          { zh: "高速", en: "Highways" },
          { zh: "夜间", en: "At night" },
          { zh: "雨天", en: "In the rain" },
          { zh: "山路或盘山路", en: "Mountain or winding roads" },
          { zh: "陌生城市", en: "An unfamiliar city" } ] },
      { dim: "strat", q: { zh: "要去一个没去过的地方，你会？", en: "Heading somewhere new, you…" },
        opts: [
          { zh: "前一天把路线和停车场都查好", en: "Look up the route and parking the day before" },
          { zh: "出发前看一遍导航路线", en: "Check the route once before leaving" },
          { zh: "开着导航边走边看", en: "Follow the navigation as I go" },
          { zh: "知道大概方向就出发", en: "Set off once I know the general direction" } ] },
      { dim: "strat", q: { zh: "导航提示前方拥堵，有一条不熟悉的小路可以绕行，你会？",
                           en: "Navigation warns of traffic ahead and suggests an unfamiliar side road. You…" },
        opts: [
          { zh: "还是走熟悉的原路", en: "Stay on the road I know" },
          { zh: "先查一下小路的情况再决定", en: "Check the side road first, then decide" },
          { zh: "跟着导航试试", en: "Follow the navigation" },
          { zh: "正好去探索一下新路线", en: "Take the chance to explore a new route" } ] },
      { dim: "strat", q: { zh: "停车时，你通常会？", en: "When parking, you usually…" },
        opts: [
          { zh: "提前选好停车场", en: "Pick a car park in advance" },
          { zh: "去常去的地方停", en: "Go to a spot I know" },
          { zh: "到了附近再找", en: "Look around once I'm nearby" },
          { zh: "哪里有位就试试，侧方停车也不怕", en: "Take whatever space is free, parallel parking included" } ] },
      { dim: "strat", q: { zh: "遇到前车急刹或施工改道这类突发情况，过后你会？",
                           en: "After something unexpected, like sudden braking ahead or a detour, you…" },
        opts: [
          { zh: "回去想想下次怎么提前避开", en: "Think it over and plan how to avoid it next time" },
          { zh: "记住这个路段，下次多注意", en: "Remember that stretch and take more care there" },
          { zh: "当时调整好，过去就过去了", en: "Adjust in the moment and move on" },
          { zh: "觉得这种临场应对挺有意思", en: "Find handling it on the spot kind of fun" } ] }
    ],
    types: {
      "low-plan": {
        name: { zh: "细水长流型", en: "The Slow & Steady" },
        tag: { zh: "潜力股", en: "a rising talent" },
        body: { zh: "你习惯提前规划，不打无准备的仗。这是很多资深司机花了好几年才养成的习惯，而你已经有了。现在需要的只是更多开车的时间，熟练是一公里一公里积累出来的。",
                en: "You plan ahead and never go in unprepared. Many experienced drivers take years to build that habit, and you already have it. What you need now is simply more time behind the wheel; fluency builds one kilometre at a time." },
        tip: { zh: "选一条熟悉的路线，每周固定开一两次，让熟悉感慢慢变成底气。",
               en: "Pick a familiar route and drive it once or twice a week. Familiarity slowly turns into confidence." } },
      "low-explore": {
        name: { zh: "试错成长型", en: "The Brave Learner" },
        tag: { zh: "边怕边试", en: "nervous, but going anyway" },
        body: { zh: "会紧张，却还是愿意出发，这本身就是勇气。你敢尝试新路线，也能在过程中调整自己，学得会比想象中快。",
                en: "You feel nervous and you still set off, and that is courage. You're willing to try new routes and adjust as you go, so you'll learn faster than you think." },
        tip: { zh: "每次尝试新路况时，先给自己设一个小目标，比如“这次只练高速汇入”。一次攻克一个，进步会看得见。",
               en: "Each time you try something new, set one small goal, like “today I'll only practise merging onto the highway”. One thing at a time, and the progress will show." } },
      "high-plan": {
        name: { zh: "稳健规划型", en: "The Steady Planner" },
        tag: { zh: "安全架构师", en: "a safety architect" },
        body: { zh: "你经验扎实，又习惯提前规划，是路上最让人安心的那类司机。你的谨慎不是胆小，而是专业。",
                en: "Solid experience plus careful planning: you're the kind of driver people feel safe with. Your caution isn't timidity; it's professionalism." },
        tip: { zh: "偶尔留出一点弹性。计划被打乱时，相信自己的经验足够应对。",
               en: "Leave a little room for the unplanned. When plans change, trust that your experience is enough to handle it." } },
      "high-explore": {
        name: { zh: "路况游侠型", en: "The Road Ranger" },
        tag: { zh: "从容预判家", en: "calm and one step ahead" },
        body: { zh: "你经验丰富，应变灵活，复杂路况也能读得懂、接得住。这种从容是大量驾驶经验沉淀下来的判断力。",
                en: "Experienced and adaptable, you can read complex traffic and handle it smoothly. That calm is judgment built over many kilometres." },
        tip: { zh: "熟练的时候最容易松懈。长途和夜间驾驶时，记得给自己留足休息和安全距离。",
               en: "Skill is when it's easiest to relax too much. On long or night drives, give yourself plenty of rest and following distance." } }
    }
  },

  /* ---------- 测试二：你如何看待“女司机”这个标签？ ----------
     code 只用于计分，不会显示给用户：
     S 情境归因 / L 成长思维 / P 自我贬低 / G 基于性别的归因 */
  attitudeQuiz: {
    forms: {
      A: [
        { q: { zh: "你倒车入库连续三次没停好，后面的车按了喇叭。你心里最先冒出来的想法是？",
               en: "You've tried three times to reverse into a parking space, and the car behind honks. What's your first thought?" },
          opts: [
            { code: "S", zh: "这个车位确实太窄了", en: "This space really is tight" },
            { code: "P", zh: "我果然不太适合开车", en: "I'm just not cut out for driving" },
            { code: "G", zh: "女生开车就是容易这样", en: "Women just tend to struggle with this" },
            { code: "L", zh: "换个角度再试一次", en: "Let me try a different angle" } ] },
        { q: { zh: "你在路口起步慢了一点，旁边车里有人喊：“女司机会不会开车啊！”你的第一反应是？",
               en: "You're a little slow pulling away at an intersection, and someone in the next car shouts, “Women drivers! Can't you drive?” Your first reaction?" },
          opts: [
            { code: "S", zh: "他太急躁了，跟我没关系", en: "He's impatient; that's not about me" },
            { code: "P", zh: "我是不是真的拖后腿了", en: "Am I really holding everyone up?" },
            { code: "G", zh: "被这么说也挺正常的，谁让我是女司机", en: "Fair enough, I'm a woman driver after all" },
            { code: "L", zh: "起步稳一点没有错", en: "Pulling away steadily isn't wrong" } ] },
        { q: { zh: "一位刚拿到驾照的朋友不敢上路，她说：“我们女生是不是天生方向感就差？”你会怎么回应？",
               en: "A friend who just got her licence is too scared to drive. She asks, “Maybe women just have a worse sense of direction?” How do you reply?" },
          opts: [
            { code: "L", zh: "方向感是练出来的，多开就好", en: "Sense of direction comes with practice; you'll get there" },
            { code: "S", zh: "每个人都不一样，跟性别没关系", en: "Everyone's different; it's not about gender" },
            { code: "P", zh: "可能吧，我也不太行", en: "Maybe. I'm not great either" },
            { code: "G", zh: "确实，女生大多这样", en: "True, most women are like that" } ] },
        { q: { zh: "你刷到一条新闻，标题是《女司机操作失误引发事故》。你的第一想法是？",
               en: "You see a headline: “Woman driver's error causes crash”. Your first thought?" },
          opts: [
            { code: "S", zh: "想看看事故具体是什么原因", en: "I want to know what actually caused it" },
            { code: "L", zh: "为什么标题要特意强调性别", en: "Why does the headline point out her gender?" },
            { code: "P", zh: "我开车也要小心，别成为这种新闻", en: "I'd better be careful not to end up in news like that" },
            { code: "G", zh: "又是女司机……", en: "Another woman driver…" } ] },
        { q: { zh: "家庭长途出行时，关于谁来开车，你通常会？", en: "On a long family road trip, who usually drives?" },
          opts: [
            { code: "L", zh: "主动和家人轮流开", en: "I offer to take turns with my family" },
            { code: "S", zh: "看情况，谁状态好谁开", en: "Whoever is less tired" },
            { code: "P", zh: "更愿意坐副驾，我开自己也不放心", en: "I'd rather be the passenger; I don't trust myself" },
            { code: "G", zh: "一般交给男性家人，我开他们会担心", en: "Usually a male relative; they'd worry if I drove" } ] },
        { q: { zh: "你和别人的车发生轻微剐蹭，责任各半。你最担心的是？",
               en: "You have a minor scrape with another car, and fault is shared. What worries you most?" },
          opts: [
            { code: "S", zh: "处理流程该怎么走", en: "How to handle the paperwork" },
            { code: "S", zh: "保险能不能赔", en: "Whether insurance will cover it" },
            { code: "P", zh: "我是不是本来就不该开车", en: "Maybe I shouldn't be driving at all" },
            { code: "G", zh: "对方会不会说“果然是女司机”", en: "That they'll say “typical woman driver”" } ] }
      ],
      B: [
        { q: { zh: "侧方停车第一次没对准，路边有人在看。你心里最先冒出来的想法是？",
               en: "Your first try at parallel parking doesn't line up, and people on the footpath are watching. Your first thought?" },
          opts: [
            { code: "S", zh: "这里空间确实太紧了", en: "There really isn't much room here" },
            { code: "P", zh: "我就是停不好车", en: "I just can't park" },
            { code: "G", zh: "女生停车本来就难", en: "Parking is just harder for women" },
            { code: "L", zh: "调整一下再来一次", en: "I'll adjust and go again" } ] },
        { q: { zh: "你在高速上按限速行驶，后车闪灯催促，超车时司机看了你一眼，说了句“难怪”。你的反应是？",
               en: "You're doing the speed limit on the highway. The car behind flashes its lights, and as it overtakes, the driver glances at you and mutters “figures”. Your reaction?" },
          opts: [
            { code: "S", zh: "超速是他的问题", en: "Speeding is his problem" },
            { code: "P", zh: "我是不是开太慢，挡别人路了", en: "Was I too slow and in the way?" },
            { code: "G", zh: "没办法，谁让我是女司机", en: "Nothing I can do; I'm a woman driver" },
            { code: "L", zh: "按限速开没有错", en: "Driving at the limit is the right thing to do" } ] },
        { q: { zh: "妹妹科目二没考过，哭着问：“是不是女生学车就是比男生慢？”你会怎么说？",
               en: "Your younger sister just failed her driving test and asks in tears, “Are girls just slower at learning to drive?” What do you say?" },
          opts: [
            { code: "L", zh: "多练几次就好，很多人都要考两次", en: "Practise a bit more; lots of people need two tries" },
            { code: "S", zh: "每个人进度不同，和性别没关系", en: "Everyone learns at their own pace; it's not about gender" },
            { code: "P", zh: "可能吧，我当年也学得慢", en: "Maybe. I was slow to learn too" },
            { code: "G", zh: "是的，女生学车普遍慢一些", en: "Yes, girls are generally a bit slower" } ] },
        { q: { zh: "群里有人转发了一条视频，标题是《女司机把油门当刹车》。你的第一想法是？",
               en: "Someone in a group chat shares a video titled “Woman driver mistakes accelerator for brake”. Your first thought?" },
          opts: [
            { code: "S", zh: "想知道到底发生了什么", en: "I want to know what really happened" },
            { code: "L", zh: "为什么要特意说是女司机", en: "Why do they need to say it's a woman?" },
            { code: "P", zh: "我会不会也犯这种错", en: "Could I make that mistake too?" },
            { code: "G", zh: "又是女司机……", en: "Another woman driver…" } ] },
        { q: { zh: "和朋友自驾游，晚上需要有人开夜路。你会？", en: "On a road trip with friends, someone needs to drive at night. You…" },
          opts: [
            { code: "L", zh: "提议大家轮流开", en: "Suggest we take turns" },
            { code: "S", zh: "谁精神好谁开", en: "Let whoever's most alert drive" },
            { code: "P", zh: "让别人开吧，我不太敢", en: "Let someone else; I don't dare" },
            { code: "G", zh: "交给男生开更稳妥", en: "Leave it to one of the guys; it's safer" } ] },
        { q: { zh: "在停车场倒车时，你轻轻碰到了柱子。你最先想到的是？",
               en: "While reversing in a car park, you gently bump a pillar. Your first thought?" },
          opts: [
            { code: "L", zh: "下次要把盲区看清楚", en: "Next time I'll check that blind spot" },
            { code: "S", zh: "车要不要去修", en: "Does the car need repairs?" },
            { code: "P", zh: "我怎么连这都做不好", en: "How can I not even manage this?" },
            { code: "G", zh: "幸好没人看见，不然又要被说女司机了", en: "Good thing no one saw, or they'd say “woman driver” again" } ] }
      ]
    },
    /* 量表题：前后测相同。reverse 只用于说明，计分时单独处理 */
    scale: [
      { id: "s7", q: { zh: "开车出错时，我会担心别人把原因归到我的性别上。",
                       en: "When I make a mistake while driving, I worry people will blame it on my gender." } },
      { id: "s8", q: { zh: "我相信只要持续练习，我可以成为一个很好的司机。",
                       en: "I believe that with practice, I can become a very good driver." } },
      { id: "s9", q: { zh: "总体来说，男性比女性更适合开车。",
                       en: "Overall, men are better suited to driving than women." } }
    ]
  },

  /* ---------- 数据 ----------
     每个来源：name 名称，desc 国家与内容，stats 数字，url 原始出处。
     数字均已对照原文核实（2026 年 10 月）。 */
  dataSources: {
    china: [
      { name: { zh: "最高人民法院《交通肇事罪特点和趋势》司法大数据专题报告", en: "Supreme People's Court of China: Judicial big-data report on traffic offences", ko: "중국 최고인민법원: 교통사고 범죄 사법 빅데이터 보고서" },
        desc: { zh: "中国｜2020 年发布。2016–2019 年全国法院交通肇事罪刑事一审案件，按驾驶人数计算。", en: "China | Published 2020. First-instance criminal traffic offence cases nationwide, 2016–2019, calculated per licensed driver.", ko: "중국 | 2020년 발표. 2016–2019년 전국 교통사고 형사 1심 사건, 운전자 수 기준." },
        url: "https://www.court.gov.cn/zixun/xiangqing/246401.html",
        stats: [
          { label: { zh: "女性驾驶人万人发案率", en: "Cases per 10,000 women drivers", ko: "여성 운전자 1만 명당 사건 수" }, value: "0.25" },
          { label: { zh: "男性驾驶人万人发案率", en: "Cases per 10,000 men drivers", ko: "남성 운전자 1만 명당 사건 수" }, value: "2.20" },
          { label: { zh: "被告人中女性占比", en: "Women among defendants", ko: "피고인 중 여성 비율" }, value: "5.40%" },
          { label: { zh: "被告人中男性占比", en: "Men among defendants", ko: "피고인 중 남성 비율" }, value: "94.60%" } ] },
      { name: { zh: "上观新闻：女司机真的等于“马路杀手”？", en: "Shanghai Observer: Are women drivers really “road killers”?", ko: "상관신문: 여성 운전자는 정말 ‘도로 위 살인마’일까?" },
        desc: { zh: "中国｜2018 年数据新闻。杭州、南京、济南 2016 年事故数据（按驾驶人数计算），上海保监局 2018 年《道路风险地图》，以及新闻标题统计。", en: "China | 2018 data journalism. 2016 crash data from Hangzhou, Nanjing and Jinan (per licensed driver), Shanghai insurance regulator's 2018 Road Risk Map, and a count of news headlines.", ko: "중국 | 2018년 데이터 저널리즘. 항저우·난징·지난 2016년 사고 데이터(운전자 수 기준), 상하이 보험감독국 2018년 ‘도로 위험 지도’, 뉴스 제목 통계." },
        url: "https://www.shobserver.cn/wx/detail.do?id=112499",
        stats: [
          { label: { zh: "杭州：男司机事故概率是女司机的", en: "Hangzhou: men's crash probability vs women's", ko: "항저우: 남성 사고 확률 (여성 대비)" }, value: { zh: "6 倍", en: "6×", ko: "6배" } },
          { label: { zh: "南京：男司机事故概率是女司机的", en: "Nanjing: men's crash probability vs women's", ko: "난징: 남성 사고 확률 (여성 대비)" }, value: { zh: "2.4 倍", en: "2.4×", ko: "2.4배" } },
          { label: { zh: "济南：男司机事故概率是女司机的", en: "Jinan: men's crash probability vs women's", ko: "지난: 남성 사고 확률 (여성 대비)" }, value: { zh: "3.71 倍", en: "3.71×", ko: "3.71배" } },
          { label: { zh: "标题同时含“女司机”和“马路杀手”的新闻（2016 年以来）", en: "Headlines with both “woman driver” and “road killer” (since 2016)", ko: "‘여성 운전자’와 ‘도로 위 살인마’가 함께 들어간 기사 제목 (2016년 이후)" }, value: { zh: "1395 篇", en: "1,395", ko: "1,395건" } },
          { label: { zh: "标题同时含“男司机”和“马路杀手”的新闻（2016 年以来）", en: "Headlines with both “man driver” and “road killer” (since 2016)", ko: "‘남성 운전자’와 ‘도로 위 살인마’가 함께 들어간 기사 제목 (2016년 이후)" }, value: { zh: "38 篇", en: "38", ko: "38건" } },
          { label: { zh: "上海早晚高峰：女性驾驶员事故概率", en: "Shanghai, rush hours: women's crash probability", ko: "상하이 출퇴근 시간: 여성 운전자 사고 확률" }, value: { zh: "高于男性", en: "Higher than men's", ko: "남성보다 높음" } },
          { label: { zh: "上海非高峰时段：女性驾驶员事故概率", en: "Shanghai, off-peak: women's crash probability", ko: "상하이 비혼잡 시간: 여성 운전자 사고 확률" }, value: { zh: "低于男性", en: "Lower than men's", ko: "남성보다 낮음" } } ] }
    ],
    korea: [
      { name: { zh: "韩国道路交通公团 2021 年交通事故统计", en: "Korea Road Traffic Authority: 2021 crash statistics", ko: "도로교통공단 2021년 교통사고 통계" },
        desc: { zh: "韩国｜经韩国女性经济新闻 2023 年报道。肇事驾驶人性别、登记车辆所有人性别与事故致死率。", en: "South Korea | As reported by Woman Economy News, 2023. Sex of at-fault drivers, sex of registered vehicle owners, and crash fatality rates.", ko: "한국 | 여성경제신문 2023년 보도. 가해 운전자 성별, 등록 차량 소유자 성별, 사고 치사율." },
        url: "https://www.womaneconomy.co.kr/news/articleView.html?idxno=215131",
        stats: [
          { label: { zh: "肇事驾驶人中男性占比", en: "Men among at-fault drivers", ko: "가해 운전자 중 남성" }, value: "75.8%" },
          { label: { zh: "肇事驾驶人中女性占比", en: "Women among at-fault drivers", ko: "가해 운전자 중 여성" }, value: "22.8%" },
          { label: { zh: "登记车辆中男性名下占比", en: "Registered vehicles owned by men", ko: "남성 명의 등록 차량" }, value: "73.8%" },
          { label: { zh: "登记车辆中女性名下占比", en: "Registered vehicles owned by women", ko: "여성 명의 등록 차량" }, value: "26.1%" },
          { label: { zh: "事故致死率：男性", en: "Crash fatality rate: men", ko: "사고 치사율: 남성" }, value: "1.7%" },
          { label: { zh: "事故致死率：女性", en: "Crash fatality rate: women", ko: "사고 치사율: 여성" }, value: "0.8%" } ] }
    ],
    global: [
      { name: { zh: "美国公路安全保险协会（IIHS）：男性与女性", en: "IIHS (US) Fatality Facts: Males and females", ko: "미국 고속도로안전보험협회(IIHS): 남성과 여성" },
        desc: { zh: "美国｜2022 年数据，按行驶里程计算：每 1 亿英里的乘用车致命事故涉入次数。", en: "United States | 2022 data, per distance driven: passenger vehicle fatal crash involvements per 100 million miles.", ko: "미국 | 2022년 데이터, 주행거리 기준: 1억 마일당 승용차 치명 사고 관여 건수." },
        url: "https://www.iihs.org/research-areas/fatality-statistics/detail/males-and-females",
        stats: [
          { label: { zh: "男性驾驶人", en: "Men drivers", ko: "남성 운전자" }, value: "2.8" },
          { label: { zh: "女性驾驶人", en: "Women drivers", ko: "여성 운전자" }, value: "1.9" } ] },
      { name: { zh: "世界卫生组织：道路安全行动十年", en: "World Health Organization: Decade of Action for Road Safety", ko: "세계보건기구: 도로 안전을 위한 행동 10년" },
        desc: { zh: "全球｜道路交通死亡者的性别构成，包括行人、骑行者等所有道路使用者。", en: "Global | Sex of people killed on the roads, including pedestrians, cyclists and all other road users.", ko: "전 세계 | 보행자·자전거 이용자 등 모든 도로 이용자를 포함한 교통사고 사망자의 성별." },
        url: "https://www.who.int/southeastasia/activities/saving-millions-of-lives-decade-of-action-road-safety",
        stats: [
          { label: { zh: "道路交通死亡者中男性占比", en: "Men among road traffic deaths", ko: "교통사고 사망자 중 남성" }, value: { zh: "超过 77%", en: "Over 77%", ko: "77% 이상" } } ] }
    ]
  },

  /* 论坛屏蔽词（命中时不允许发布）。可自行增删。 */
  blockedWords: ["傻逼", "煞笔", "sb", "贱人", "婊", "去死", "fuck", "bitch", "병신", "씨발"]
};
