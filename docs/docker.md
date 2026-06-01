# MetriK em Docker (modo LOCAL)

Roda o dashboard em um container lendo uma pasta `metrics/` do host em modo
**LOCAL** (leitura server-side). Usa a saída `standalone` do Next.js
(`output: 'standalone'` em [`next.config.ts`](../next.config.ts)).

## Pré-requisitos

- Docker + Docker Compose
- Uma pasta `metrics/` com os JSONs gerados por um produtor KaiserInc-Utils

## Início rápido (docker compose)

```bash
# METRICS_HOST_DIR = caminho ABSOLUTO no host para a pasta metrics/
METRICS_HOST_DIR=/abs/path/para/projeto/metrics docker compose up --build
```

Acesse `http://localhost:3000`.

O compose monta `METRICS_HOST_DIR` em `/metrics:ro` e define
`METRICS_DIR=/metrics` dentro do container. Porta configurável via
`METRIK_PORT` (padrão `3000`).

```bash
METRIK_PORT=8080 METRICS_HOST_DIR=/abs/path/metrics docker compose up --build
```

## Sem compose (docker puro)

```bash
docker build -t metrik .
docker run --rm -p 3000:3000 \
  -e METRICS_DIR=/metrics \
  -v /abs/path/para/projeto/metrics:/metrics:ro \
  metrik
```

## Health check

```bash
curl http://localhost:3000/api/health
# { "ok": true, "mode": "local", "metricsDir": "/metrics",
#   "reportCount": 4, "invalidCount": 1 }
```

`invalidCount > 0` indica relatórios que falharam na validação — a home exibe um
banner nomeando o arquivo e a chave faltante/ inválida.

## Notas

- O container roda como o usuário não-root `node`.
- O mount é **read-only** (`:ro`) — o dashboard nunca escreve na pasta.
- `scripts/postinstall.mjs` é tolerante a falhas (não quebra o `pnpm install`
  dentro do container).
