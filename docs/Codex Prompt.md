Codex Prompt：按蓝图实现「Epic 5: 测试与文档」（强约束）

你将基于以下「Agent Marketplace 开发执行蓝图」、「设计稿」在仓库中实现功能并提交 PR。规则：
 • 严格遵循：目录结构、命名、API 契约、验收标准
 • 每个 PR 控制在：一个 Epic 下的 1个 Story（可运行、可验收）
 • 必须提供：
 • 代码实现
 • 关键单测（或 e2e）+ mock
 • README 更新：本地运行、环境变量、接口示例
 • 在/docs/README/** 增加开发文档：区分模块、前端、后端、数据库
 • 自检结果：lint/test/build 通过
 • 需要决策或发现蓝图冲突：不要自己改契约，先在 PR 描述里列出“阻塞/疑问/建议”，并给出两个可选方案及影响。
输入：<https://github.com/janebingley94/agent-marketplace-app/blob/main/docs/Agent%20Marketplace%20%E5%BC%80%E5%8F%91%E6%89%A7%E8%A1%8C%E8%93%9D%E5%9B%BE.md>、<https://github.com/janebingley94/agent-marketplace-app/tree/main/docs/%E8%AE%BE%E8%AE%A1%E7%A8%BF>
输出：

 1. 本 PR 计划（包含改动文件列表）
 2. 实现后 PR 描述（含截图/录屏占位说明、测试方式）
 3. 若无法完成：列出阻塞点与替代实现

--------------

任务清单如下：

A. API 文档不完整（T1）

为 Auth/Agents/Dashboard 所有 Controller 增加 Swagger 注解
细项：summary/response/bearerAuth/query params
目标：所有已实现端点在 /api/docs 可见
为所有 DTO 增加 ApiProperty/ApiPropertyOptional
细项：example、required/optional 字段说明
统一错误响应文档
细项：400/401/403/404/422/500，补齐响应结构说明
文档验证
细项：启动 API → 打开 /api/docs → 对照蓝图契约检查路径/参数/响应
B. 单测（T2）

服务层单测补齐（mock Prisma/Redis/Siwe）
AuthService（nonce/verify/me）
AgentsService（list/filter, create, update, delete, leaderboard）
DashboardService（overview/earnings/agents）
Controller 基础单测
校验路由映射、guard 生效、参数/DTO 校验（mock service）
覆盖率门槛
在 Jest 配置中设定覆盖率阈值（>=40%）并输出报告
回归执行
pnpm --filter @agent-marketplace/api test
记录覆盖率结果并整理到 PR 描述里

----------------
