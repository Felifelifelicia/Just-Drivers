-- =========================================================
-- 她的方向盘 / Her Wheel — Supabase 数据库结构
-- 用法：Supabase 控制台 → SQL Editor → New query → 粘贴全部 → Run
-- =========================================================

create extension if not exists pgcrypto;

-- 论坛帖子
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  anon_id text not null,
  nickname text check (nickname is null or char_length(nickname) <= 20),
  category text not null check (category in ('help', 'story', 'road')),
  title text not null check (char_length(title) between 1 and 80),
  body text not null check (char_length(body) between 1 and 3000),
  hidden boolean not null default false
);

-- 回复
create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references posts(id) on delete cascade,
  anon_id text not null,
  nickname text check (nickname is null or char_length(nickname) <= 20),
  body text not null check (char_length(body) between 1 and 1500),
  hidden boolean not null default false
);

-- 举报（同一个人对同一条内容只算一次）
create table if not exists reports (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  target_type text not null check (target_type in ('post', 'reply')),
  target_id uuid not null,
  anon_id text not null,
  unique (target_type, target_id, anon_id)
);

-- 测试结果（匿名，用 anon_id 配对前后测）
create table if not exists test_results (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  anon_id text not null,
  test text not null check (test in ('driver', 'attitude')),
  phase text not null check (phase in ('pre', 'post', 'single')),
  form text,
  answers jsonb,
  g_count int,
  p_count int,
  s7 int, s8 int, s9 int,
  driver_type text
);

-- ---------- 行级安全：访客只能做规定的事 ----------
alter table posts enable row level security;
alter table replies enable row level security;
alter table reports enable row level security;
alter table test_results enable row level security;

-- 帖子和回复：所有人可读未隐藏的内容，可新建；不能修改或删除
create policy "read visible posts" on posts for select using (hidden = false);
create policy "create posts" on posts for insert with check (hidden = false);
create policy "read visible replies" on replies for select using (hidden = false);
create policy "create replies" on replies for insert with check (hidden = false);

-- 举报和测试结果：只能写入，不能读取（保护匿名数据）
create policy "create reports" on reports for insert with check (true);
create policy "create results" on test_results for insert with check (true);

-- ---------- 被 3 人举报的内容自动隐藏 ----------
create or replace function hide_reported() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from reports
      where target_type = new.target_type and target_id = new.target_id) >= 3 then
    if new.target_type = 'post' then
      update posts set hidden = true where id = new.target_id;
    else
      update replies set hidden = true where id = new.target_id;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_hide_reported on reports;
create trigger trg_hide_reported after insert on reports
  for each row execute function hide_reported();

-- ---------- 论坛弹窗用的统计（只返回汇总数字，不暴露个人回答） ----------
-- n：完成第二次测试的人数（每人只算最近一次）
-- free：其中情境题没有一次选择性别归因、且不认同“男性更适合开车”（≤3 分）的人数
create or replace function norm_stats() returns json
language sql security definer set search_path = public stable as $$
  select json_build_object(
    'n', count(*),
    'free', count(*) filter (where g_count = 0 and s9 <= 3)
  )
  from (
    select distinct on (anon_id) *
    from test_results
    where test = 'attitude' and phase = 'post'
    order by anon_id, created_at desc
  ) latest;
$$;

grant execute on function norm_stats() to anon;
