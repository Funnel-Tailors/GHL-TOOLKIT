#!/bin/bash
# GHL-TOOLKIT Skill Sync
# Sincroniza skills de GHL-TOOLKIT a ~/.claude/skills/

TOOLKIT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"

# Crear directorio de skills si no existe
mkdir -p "$SKILLS_DIR"

echo "Sincronizando skills desde $TOOLKIT_DIR/skills/ → $SKILLS_DIR/"
echo ""

for skill_dir in "$TOOLKIT_DIR"/skills/*/; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  target="$SKILLS_DIR/$skill_name"

  # Crear symlink (force para actualizar si ya existe)
  ln -sf "$skill_dir" "$target"
  echo "  ✓ $skill_name → $target"
done

echo ""
echo "Skills sincronizados. Disponibles en Claude Code como:"
for skill_dir in "$TOOLKIT_DIR"/skills/*/; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  echo "  /$skill_name"
done
