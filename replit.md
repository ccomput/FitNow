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

## Artifacts

### FitNow - Personal Trainer (`artifacts/trainer-app`)
- **Type**: Expo mobile app
- **Preview path**: `/`
- **Description**: Navigable prototype for an on-demand personal trainer booking app
- **Key features**:
  - Animated splash screen
  - Filters screen (date, time, modality, training type)
  - Map view with gym markers showing available trainer count (web: visual fallback, native: react-native-maps 1.18.0)
  - Bottom sheet on gym tap with trainer previews
  - Trainer list per gym
  - Trainer profile with slot selection
  - Booking confirmation flow
  - Mocked payment screen (PIX/credit/debit)
  - Booking success screen
  - My bookings screen with history
  - Profile screen
- **Data**: All mock data in `data/mockData.ts` (5 gyms, 15 trainers, 3 initial bookings)
- **State**: React Context (`context/AppContext.tsx`) with AsyncStorage persistence
- **Navigation**: Bottom tab bar (Map, Bookings, Profile) + Stack for detail screens
- **Colors**: Orange primary (`#FF5A1F`) on light background, dark navy (`#1A1A2E`) for splash/hero

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
