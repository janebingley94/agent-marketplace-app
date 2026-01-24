#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:?TASK_ID required}"
TITLE="${2:?TITLE required}"

echo "== Codex Task Runner =="
echo "TASK_ID=$TASK_ID"
echo "TITLE=$TITLE"

# 你可以在 Issue 里写更完整的任务描述，Action 会把它拼进 prompt（见 workflow）
PROMPT_FILE=".codex_prompt.txt"

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Missing $PROMPT_FILE"
  exit 1
fi

echo "== Prompt =="
sed -n '1,120p' "$PROMPT_FILE"

# Codex CLI: install via npm i -g @openai/codex
# Run: codex "<prompt>"
# （不同版本可能提供更多 flags；这里用最通用写法）
codex "$(cat "$PROMPT_FILE")"

echo "== Done =="