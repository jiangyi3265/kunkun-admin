# kunkun-admin · 困困运营管理后台

供平台运营人员审核玩家交易、管理店铺资料和维护活动内容的 Web 后台。

## 项目简介

基于若依 Vue 3 管理端扩展，通过 `kunkun-backend` 统一读取和处理 `kunkun-app` 的业务数据。业务页面位于 `src/views/boost`：玩家管理、出售/求购审核、店铺认证与材料留档、订单/售后查询、会员成长调整、免费积分发放、兑换履约、首页图片文案以及可关联转盘的图文活动管理。

菜单、按钮和 API 操作按服务端权限校验；店铺敏感材料仅向有权限的审核人员开放。后台不会自动给予全部业务权限。支付及保证金缴退暂未开放，保证金当前仅用户钱包展示，不能将管理界面存在等同于真实资金渠道可用。

## 技术栈

- Vue 3.5、JavaScript、Vite 6.4、Pinia、Vue Router 4。
- Element Plus 2.13、Axios、ECharts、Quill 富文本组件。
- ESLint、eslint-plugin-vue；固定安装以 `package-lock.json` 为准。

## 关联仓库

| 项目 | 说明 | GitHub |
| --- | --- | --- |
| kunkun-backend | 后端服务 | [kunkun-backend](https://github.com/jiangyi3265/kunkun-backend) |
| kunkun-admin | 管理后台 | [kunkun-admin](https://github.com/jiangyi3265/kunkun-admin) |
| kunkun-app | 用户端 | [kunkun-app](https://github.com/jiangyi3265/kunkun-app) |

## 快速启动

准备 Node.js 24/npm，并先按后端仓库说明启动 API。

```powershell
npm ci
Copy-Item .env.development.example .env.development.local
$env:BOOST_API_URL='http://127.0.0.1:8080'
$env:BOOST_NO_OPEN='1'
npm run dev -- --host 127.0.0.1 --port 5175
```

访问 `http://127.0.0.1:5175`。开发请求 `/dev-api` 由 Vite 代理到后端。使用自己初始化的管理员账号登录；业务菜单需要后端菜单 SQL 与相应角色权限。

生产构建：

```powershell
Copy-Item .env.production.example .env.production.local
# 按实际反向代理路径修改 VITE_APP_BASE_API；VITE变量会公开进入浏览器。
npm run lint
npm run build:prod
```

输出为 `dist/`。部署时保证反向代理将配置的 API 前缀转发到后端；不能把数据库密码、Token或服务端密钥放进 `VITE_*` 变量。`.env*` 实际配置不会提交，仅提交 `.example` 模板；若本地已有配置不要重复覆盖。

## 项目结构

```text
src/views/boost/      玩家交易、内容、积分活动管理页面
src/api/             后台业务及若依系统接口
src/router/          基础路由
src/store/modules/   登录、动态权限菜单、标签页状态
src/layout/          后台导航与布局
src/utils/           HTTP请求、权限与媒体地址处理
vite/plugins/        构建插件及SVG图标处理
public/              公共静态文件
```

## 开发说明

业务数据应通过关联后端修改，不在页面写固定成功结果。`npm run lint` 当前覆盖现有脚本指定的业务目录和安全相关工具，并非全库所有历史代码。构建通过不等于后台角色和资金流程全部验收完成。

原工作区未使用的 `src/utils/jsencrypt.js` 含旧固定密钥对，已从公开代码中排除并保留在原工作区；当前登录与业务代码没有引用它。不要在前端代码或 `VITE_*` 变量中放置私钥。

## 简历描述示例

参与玩家道具交易平台运营后台开发，完成发布审核、店铺资料更正与版本留档、会员成长调整及积分兑换履约页面。基于服务端角色权限构建动态菜单和操作入口，并实现图文活动、首页大图及跳转配置管理。

## 来源

基于若依 Vue 3 管理端，保留原有 [MIT 许可证](LICENSE)。
