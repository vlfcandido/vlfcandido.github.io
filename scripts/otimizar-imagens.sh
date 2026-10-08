#!/usr/bin/env bash
# Gera AVIF, WebP e JPEG (capas) a partir das telas recriadas em vitrine-portfolio/prints-v2.
# Uso: scripts/otimizar-imagens.sh   (precisa de ffmpeg com libaom e libwebp; sem efeito ao ser importado)
set -euo pipefail
ORIGEM="${ORIGEM:-$HOME/PycharmProjects/vitrine-portfolio/prints-v2}"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
# Capas e telas principais aprovadas em 08/10/2026 (tela principal de cada projeto, 1200x750 e 1440x900).
CAPTURAS="${CAPTURAS:-$HOME/PycharmProjects/vitrine-portfolio/tela/capturas}"
SLUGS="${SLUGS:-aprovaos nexus-quant varredura-voos app-score engenharia-de-agentes revisor-ia ia-local benchmark-litellm}"

# redimensiona (Lanczos) e grava no formato pedido; $1 origem, $2 largura, $3 destino, $4 qualidade
gerar() {
  local src="$1" w="$2" dst="$3" q="$4"
  case "$dst" in
    *.avif) ffmpeg -v error -y -i "$src" -vf "scale=$w:-2:flags=lanczos" -c:v libaom-av1 -crf "$q" -b:v 0 -cpu-used 6 -still-picture 1 "$dst" ;;
    *.webp) ffmpeg -v error -y -i "$src" -vf "scale=$w:-2:flags=lanczos" -c:v libwebp -quality 80 "$dst" ;;
    *.jpg)  ffmpeg -v error -y -i "$src" -vf "scale=$w:-2:flags=lanczos" -q:v 4 "$dst"
            # mantém o JPEG em até 150 KB: sobe a compressão até caber
            for qv in 5 6 7 8; do
              [ "$(stat -f%z "$dst")" -le 153600 ] && break
              ffmpeg -v error -y -i "$src" -vf "scale=$w:-2:flags=lanczos" -q:v "$qv" "$dst"
            done ;;
  esac
}

# Capas: 640, 1040 e 1200 de largura, nos três formatos (public/img, regra de 150 KB por arquivo).
for s in $SLUGS; do
  for w in 640 1040 1200; do
    src="$CAPTURAS/$s-capa-1200x750.png"
    for e in avif webp jpg; do gerar "$src" "$w" "$RAIZ/public/img/capa-$s-$w.$e" 34; done
  done
done

# Tela principal de cada caso: desktop 960 e 1440 (celular do app-score em 390 e 780).
for s in $SLUGS; do
  if [ "$s" = app-score ]; then ws="390 780"; src="$CAPTURAS/app-score-celular-390.png"; b="app-score-principal-m"
  else ws="960 1440"; src="$CAPTURAS/$s-tela-1440x900.png"; b="$s-principal-d"; fi
  for w in $ws; do for e in avif webp; do gerar "$src" "$w" "$RAIZ/public/prints/$b-$w.$e" 36; done; done
done

# Telas internas: desktop 960 e 1600; celular 390 e 780 (AVIF e WebP, em public/prints).
for f in "$ORIGEM"/*.png; do
  case "$f" in *bot-pedidos*) continue ;; esac
  b="$(basename "$f" .png)"
  case "$b" in *-d) ws="960 1600" ;; *-m) ws="390 780" ;; *) continue ;; esac
  for w in $ws; do for e in avif webp; do gerar "$f" "$w" "$RAIZ/public/prints/$b-$w.$e" 36; done; done
done
