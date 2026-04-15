# Spotify Money Flow — Data Story

## Overview

An interactive data story built with React + Vite that explores the economics of Spotify and the music streaming industry. Faithfully recreates a Spotify-style dark UI with a 5-chapter narrative structure.

## Artifact

- **spotify-money-flow** (`artifacts/spotify-money-flow/`) — React + Vite SPA at `/`

## Features

- Full Spotify-style dark UI shell (sidebar, now-playing bar, chapter navigation)
- 5 interactive chapters with real data from RIAA, Spotify IR, MIDiA Research, Loud & Clear 2024
- Recharts interactive visualizations (area charts, bar charts, line charts, pie charts)
- Chapter 1: RIAA U.S. Revenue by Format (1980–2024)
- Chapter 2: Spotify's Two-Tier Economy (premium vs free user revenue)
- Chapter 3: Where Your $9.99 Goes (interactive dollar bar + money flow)
- Chapter 4: The Ad Problem (dual-axis chart, donut charts)
- Chapter 5: Artist Earnings Pyramid + Streams vs Real-World Cost

## Data Sources

All data is client-side in `src/data/`:
- `riaa.ts` — RIAA U.S. Sales Database 1973–2024
- `spotify.ts` — Spotify Investor Relations 2018–2024, MIDiA Research, Loud & Clear 2024

---

# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
