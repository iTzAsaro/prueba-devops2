#!/usr/bin/env bash
# ============================================================
# Git Hook: Sincronización automática de Docker con el código local
# ============================================================

# Verificar que docker esté instalado y el daemon esté activo
if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  exit 0
fi

# Asegurarse de operar en la raíz del repositorio
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Verificar si los contenedores del proyecto están activos
RUNNING_CONTAINERS=$(docker compose ps -q 2>/dev/null)

if [ -n "$RUNNING_CONTAINERS" ]; then
  COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "HEAD")
  echo ""
  echo "🔄 [Git Hook] Cambio detectado en local ($COMMIT_SHA). Sincronizando stack Docker..."
  
  if [ -f "docker-compose.dev.yml" ]; then
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
  else
    docker compose up --build -d
  fi

  echo "✅ [Git Hook] Contenedores locales actualizados y sincronizados con el commit $COMMIT_SHA."
  echo "   • Backend:  http://localhost:3000/api/health"
  echo "   • Frontend: http://localhost:5000"
  echo ""
else
  echo ""
  echo "ℹ️  [Git Hook] Contenedores Docker locales inactivos. Ejecuta 'npm run dev:up' cuando desees levantarlos."
  echo ""
fi
