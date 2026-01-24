下面给你一套**“用 Claude 下发任务 → 监督 Codex 执行 → 自动检测结果 → 关口验收”**的可落地方案（偏工程化、可直接照做）。我默认你的开发载体是 GitHub + CI（GitHub Actions）+ PR 流程，Claude 负责“项目经理/审稿人”，Codex 负责“执行改代码”。

⸻

0) 总体思路（最重要）

把“监督/检测”从人肉盯梢，变成可机器判定的交付契约：
	•	Claude 下发的每个任务 = 一份 Contract（交付契约）
	•	目标 / 范围 / 不做什么
	•	验收标准（可测试、可 lint、可静态检查）
	•	变更边界（哪些文件允许动）
	•	风险点与回滚方式
	•	Codex 执行 = 按 Contract 产出 PR
	•	必须自证：跑过哪些命令、哪些测试、截图/日志
	•	监督 = PR 级别的“门禁”
	•	CI 必须绿（lint/typecheck/unit/e2e）
	•	变更必须符合边界（路径、文件数、diff 大小）
	•	必须包含测试与说明
	•	检测 = 自动化 + Claude 复核
	•	自动化负责“硬指标”
	•	Claude 负责“软指标”（架构一致性、可维护性、PRD 对齐）

这样你不需要盯着 Codex 做没做，而是看它交付的 PR 是否通过门禁。

⸻

1) Claude 如何“下发任务”（标准化任务包）

建议你在 repo 里固定一个目录：/tasks/ 或用 GitHub Issue 模板。

1.1 任务包结构（Claude 输出必须包含）

每个任务由 Claude 生成一份“可执行任务包”，例如：
	•	Task ID：T-20260122-001
	•	Context：相关 PRD/接口/页面/设计稿链接
	•	Scope（做/不做）
	•	Acceptance（验收标准）：必须能用命令验证
	•	Constraints（约束）
	•	只允许改哪些目录：apps/web/**, packages/ui/**
	•	禁止改：contracts/**, infra/**
	•	禁止引入新依赖（或允许但需说明）
	•	Deliverables（交付物）
	•	PR + 说明
	•	测试用例
	•	截图 / 录屏（如果是 UI）
	•	Verification Commands（必须跑的命令）
	•	pnpm lint
	•	pnpm typecheck
	•	pnpm test
	•	pnpm e2e（可选）
	•	Definition of Done（DoD）
	•	CI 全绿
	•	覆盖率不下降（可选）
	•	无高危安全告警（可选）

关键：验收标准必须能被 CI 自动判断，否则就很难监督。

1.2 Claude 给 Codex 的“执行指令 Prompt”（可直接复制）

你可以让 Claude 每次都生成一段固定格式的指令给 Codex：
	•	“先读文件/搜索关键代码 → 给执行计划 → 小步提交 → PR 自检清单 → 最终总结”
	•	强制 Codex 把“做了什么”写清楚：哪些文件改了，为什么。

你可以把以下模板当“系统指令风格”来用（直接粘给 Codex）：

你是执行工程师。目标：完成 Task Contract（见下文）。工作方式：
1) 先扫描代码：找到相关入口、现有模式、约束点，给出执行计划（分 3~6 步）。
2) 严格按约束修改：只改允许目录；若必须突破约束，先在 PR 描述里说明理由与替代方案。
3) 每一步都要可验证：新增/更新测试；确保 lint/typecheck/test 通过。
4) 最后输出：PR 描述（变更摘要/风险/回滚/验证命令结果/截图）。

Task Contract:
- Task ID: ...
- Scope: ...
- Acceptance: ...
- Constraints: ...
- Verification Commands: ...


⸻

2) Codex 如何“接单执行”（产出可审计 PR）

让 Codex 的交付只走一种路径：分支 → PR → CI → Review → Merge。

2.1 强制 PR 模板（监督的核心抓手）

在 .github/pull_request_template.md 写死你要的字段：
	•	关联 Task ID
	•	变更摘要
	•	影响范围
	•	验收项勾选（lint/typecheck/test/e2e）
	•	UI 截图
	•	风险与回滚
	•	未完成项

Codex 不按模板写，PR 就直接退回。

2.2 Codex 的“自检清单”

让 Codex 在 PR 描述里必须贴上这类 checklist（可复制到模板里）：
	•	pnpm lint ✅
	•	pnpm typecheck ✅
	•	pnpm test ✅
	•	新增/更新测试：xxx
	•	仅修改允许目录：xxx
	•	UI 截图/录屏：xxx
	•	回滚方案：xxx

⸻

3) 监督：让“门禁”替你盯人（CI + 规则）

监督的本质是：不通过门禁就不能合并。

3.1 GitHub 分支保护（必须）

开启以下规则：
	•	Require PR reviews（至少 1-2 个）
	•	Require status checks to pass（CI 必须全绿）
	•	Require conversation resolution（所有 review comment 必须解决）
	•	Restrict who can push to main（禁止直接推 main）

3.2 CI 必跑项（检测的“硬指标”）

建议最少这几个 Job：
	1.	Lint + Format
	2.	Typecheck
	3.	Unit tests
	4.	Build
	5.	（如果是前端）E2E/Playwright 或最少 smoke test
	6.	Danger/PR 检查（见下）

3.3 PR 自动检查（把“监督”做成规则）

用“规则脚本”检查这些东西：
	•	PR 描述必须包含 Task ID
	•	改动文件不能触碰黑名单目录（如 contracts/**）
	•	Diff 行数超阈值（比如 > 800 行）要提示拆分
	•	新增文件必须有测试（可做启发式，比如改 src/** 同时要求改 __tests__/** 或 *.spec.ts）

这类规则可以用 Danger.js / 自定义 Action 来实现（你不一定要上很复杂，先从“检查 Task ID/目录黑名单/PR 模板完整性”开始，立竿见影）。

⸻

4) 检测：从“看起来对”变成“可证明对”

检测分三层：静态 → 动态 → 业务验收。

4.1 静态检测（零成本高收益）
	•	ESLint / Prettier
	•	TypeScript typecheck
	•	依赖安全扫描（npm audit / Snyk / GitHub Dependabot）

4.2 动态检测（最少要有）
	•	单测（Jest/Vitest）
	•	关键路径 smoke test（启动、核心 API 调用、页面渲染）
	•	E2E（对 P0 流程：登录、下单/创建、列表筛选分页）

4.3 业务验收检测（PRD 对齐）

这里 Claude 很适合做“验收官”，但你要给它可核对证据：
	•	Playwright trace / video
	•	截图对比（视觉回归）
	•	API contract test（Schema 校验）
	•	数据库迁移检查（如有）

⸻

5) “Claude 监督 Codex”的三种实操模式（选一个就能跑）

模式 A：Issue 驱动（最清晰）

流程：
	1.	Claude 生成 Issue（含 Contract）
	2.	Codex 领取 Issue → 开分支 → PR
	3.	CI 检测 + Claude review
	4.	合并后自动关闭 Issue

适合：多人协作、任务多、需要追踪进度。

模式 B：PRD 切片（适合你现在做 Marketplace）

把 PRD 功能点切成 F1/F2/F3...，每个功能点一个 Issue + Contract + 验收脚本。
Codex 一次只做一个功能点，避免大 PR。

模式 C：Sprint 看板（适合长期）
	•	Backlog / In Progress / In Review / Done
	•	Claude 每天做一次“站会式监督”：检查 in progress 的 PR 是否卡在 CI、卡在 review、卡在不明确验收

⸻

6) 你可以直接用的“监督节奏”（无需任何新工具）

每天一个固定节奏，Claude 负责输出“监督报告”：
	•	今日在做的 Task 列表（按优先级）
	•	每个 Task 当前状态
	•	PR 是否开了
	•	CI 是否绿
	•	卡住原因（lint/typecheck/test/需求不清/冲突）
	•	下一步行动（给 Codex 的下一条指令）

把监督变成可复制的“日报”。

⸻

7) 一套最小可运行（MVP）配置（强烈建议先这样落地）

如果你不想一次搞太多，先上这 6 个点就能稳定跑起来：
	1.	Claude 输出 Task Contract（固定模板）
	2.	PR 模板强制 Task ID + 自检清单
	3.	分支保护：必须 CI 绿 + 必须 review
	4.	CI：lint + typecheck + test + build
	5.	目录黑名单检查（防止乱改）
	6.	Claude 做 PR Review（按验收标准逐条勾）

这就是“下发/监督/检测”的闭环了。

⸻

8) 给你一份“Claude 作为总控”的监督清单（你照着用）

你让 Claude 每次 review PR 时，严格按这张表检查（也可贴到 PR review 模板）：
	•	合同一致性：Scope 有没有越界？
	•	验收项：每条 Acceptance 是否有证据（测试/截图/trace/log）？
	•	风险：有没有影响其他模块？有没有回滚方案？
	•	质量：命名/结构/可维护性/重复代码
	•	安全：敏感信息、签名流程、钱包连接、鉴权边界
	•	性能：列表分页、缓存、请求次数、渲染性能（前端）

⸻

如果你愿意，我可以把你上次那个 Agent Marketplace 的功能点表（F1~F10），直接切成一整套 Issue/Task Contract 包（每个功能点拆成 2~6 个子任务，附验收命令与 Playwright 测例建议），你就可以让 Codex 按包逐个产 PR。