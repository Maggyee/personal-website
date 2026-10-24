# Nishiki

Nishiki 的个人主页，线上地址 <https://nishikicn.com>。一条会随时间变换昼夜的雪街，锦明日海站在街上；往下是博客文章、贝斯区、做过的小东西和自我介绍。

Next.js 16（App Router）+ Tailwind CSS 4，部署为 Docker 容器，通过 Cloudflare Tunnel 对外提供服务。

## 改内容去哪里

| 想改的东西 | 文件 |
| --- | --- |
| 名字、首页口号、自我介绍、标签、联系方式 | `src/content/profile.ts` |
| 明日海点击时说的台词、滚动台词 | `src/content/profile.ts`（`greetings`、`scrollLines`） |
| 作品卡片 | `src/content/works.ts` |
| 贝斯视频（B 站 BV 号或 `public/` 下的视频文件） | `src/content/music.ts` |
| 首页不显示的博客文章 | `src/lib/blog.ts` 里的 `HIDDEN_POSTS` |
| 自动主题的昼 / 黄昏 / 夜分界时间 | `src/lib/theme.ts` |
| 网站图标、分享卡片图片 | 运行 `scripts/generate-share-assets.py`（用法见脚本开头） |

「最近在写」由博客的 WordPress REST API 生成，每小时刷新一次，不需要重新部署。博客超过 45 天没有新文章时，这一栏会改成每天轮换几篇旧文章。

## 本地开发

```bash
npm ci
npm run dev
```

这台服务器上 `next dev` 有时不能察觉文件改动，`.next/dev` 缓存也会过期，表现是改了样式页面却没变。遇到时停掉 dev 服务器，执行 `rm -rf .next/dev` 再重新启动。生产构建（`npm run build`）不受影响。

提交前跑一下：

```bash
npx eslint src && npx tsc --noEmit && npm run build
```

## 部署

```bash
docker compose build website
docker compose up -d website
```

`cloudflared` 隧道连接的是服务名 `website`，重建网站容器时不用动它。部署前可以先给当前镜像打个标签，出问题时用它回滚：

```bash
docker tag nishiki-website:security-20261022 nishiki-website:backup
# 回滚
docker tag nishiki-website:backup nishiki-website:security-20261022 && docker compose up -d website
```

## 素材与版权

- 角色立绘：《ハミダシクリエイティブ》《ハミダシクリエイティブ凸》© まどそふと，同人用途展示并注明出处。
- 雪街背景：[みんちりえ](https://min-chi.material.jp/)「冬の街中」。可商用、可加工，署名非必需（页脚已注明），不可作为素材再分发。
- 字体：Geist、Fraunces、Noto Serif SC（均为 SIL OFL）。正文中文使用访客系统自带字体。
- `assets/` 存放不直接上线的原始素材（logo 各版本、头像等），`public/` 里只放网站用到的文件。
