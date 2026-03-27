#!/bin/bash
# GHL-TOOLKIT Sync
# Sincroniza skills y agents de GHL-TOOLKIT a ~/.claude/

TOOLKIT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"

# Crear directorios si no existen
mkdir -p "$SKILLS_DIR"
mkdir -p "$AGENTS_DIR"

# --- Skills ---
echo "Sincronizando skills desde $TOOLKIT_DIR/skills/ → $SKILLS_DIR/"
echo ""

for skill_dir in "$TOOLKIT_DIR"/skills/*/; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  target="$SKILLS_DIR/$skill_name"

  ln -sfn "$skill_dir" "$target"
  echo "  ✓ $skill_name → $target"
done

echo ""

# --- Agents ---
echo "Sincronizando agents desde $TOOLKIT_DIR/agents/ → $AGENTS_DIR/"
echo ""

for agent_file in "$TOOLKIT_DIR"/agents/*.md; do
  [ -f "$agent_file" ] || continue
  filename=$(basename "$agent_file")
  target="$AGENTS_DIR/$filename"

  ln -sf "$agent_file" "$target"
  echo "  ✓ $filename → $target"
done

echo ""
echo "Skills disponibles en Claude Code:"
for skill_dir in "$TOOLKIT_DIR"/skills/*/; do
  [ -d "$skill_dir" ] || continue
  echo "  /$(basename "$skill_dir")"
done

echo ""
echo "Agents disponibles en Claude Code:"
for agent_file in "$TOOLKIT_DIR"/agents/*.md; do
  [ -f "$agent_file" ] || continue
  filename=$(basename "$agent_file" .md)
  echo "  $filename"
done

echo ""

# --- Templates ---
TEMPLATES_DIR="$TOOLKIT_DIR/templates"
if [ -d "$TEMPLATES_DIR" ]; then
  echo "Templates disponibles:"
  for template_file in "$TEMPLATES_DIR"/*.yaml; do
    [ -f "$template_file" ] || continue
    name=$(basename "$template_file" .yaml)
    [ "$name" = "_base" ] && continue
    echo "  $name"
  done
fi
