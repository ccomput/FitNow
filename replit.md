# Workspace

## Overview

pnpm workspace monorepo usando TypeScript. Cada pacote gerencia suas próprias dependências.

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 24
- **Package manager**: pnpm
- **TypeScript**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (v4), drizzle-zod
- **API codegen**: Orval (OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### FitNow - Personal Trainer (`artifacts/trainer-app`)
- **Tipo**: Expo mobile app (React Native)
- **Preview path**: `/`
- **Descrição**: Protótipo navegável completo de agendamento de personal trainer sob demanda

#### Fluxo do ALUNO
1. Splash → Seleção de perfil (Aluno / Personal)
2. Onboarding em 5 passos (Boas-vindas → Dados pessoais → Objetivo → Dados físicos → Saúde → Conclusão)
3. Tabs: Mapa, Agendamentos, Treino, Perfil
4. Mapa com academias e marcadores de trainers disponíveis
5. Filtros de data/horário/modalidade/objetivo
6. Bottom sheet por academia → lista de trainers → perfil → reserva → pagamento → confirmação
7. Minha ficha (edição completa)
8. Evolução (gráfico de barras de peso/gordura/massa magra + medidas)
9. Meu treino (lista de exercícios com séries/reps, check-in)
10. Avaliação do personal (estrelas + comentário)
11. Notificações (lidas/não lidas por tipo)
12. Meus agendamentos (próximos + histórico)

#### Fluxo do PERSONAL
1. Tabs: Agenda, Reservas, Alunos, Perfil
2. Agenda semanal com slots confirmados/livres/bloqueados
3. Reservas com filtros e ações (ver ficha, marcar como realizado)
4. Lista de alunos com acesso à ficha completa e edição de treino
5. Perfil editável (bio, CREF, especialidades, modalidades, preço, academias)
6. Ficha do aluno (visão completa com saúde, evolução, treino ativo)
7. Criação/edição de treino (exercícios, séries, reps, observações)

#### Dados mockados
- 5 academias em São Paulo
- 15 trainers com perfis realistas
- 5 alunos mock para a área do personal
- Histórico de evolução de 4 meses
- 5 notificações de tipos variados

#### Estado global (`context/AppContext.tsx`)
- Filtros de busca
- Bookings (agendamentos)
- Tipo de usuário (aluno/personal)
- Perfil do aluno (editável)
- Treino ativo
- Histórico de evolução
- Notificações

#### Cores e design
- Primary orange: `#FF5A1F`
- Dark navy: `#1A1A2E`
- Background: `#F7F8FA`
- Success: `#10B981` (usado na área do personal)
- Fonte: Inter (400/500/600/700)

#### Regras de versão (não mudar)
- `react-native-maps@1.18.0` — fixo, não atualizar
- Não adicionar `react-native-maps` aos plugins do app.json
- Web usa `MapViewWrapper.web.tsx` como fallback

## Comandos principais

- `pnpm run typecheck` — typecheck geral
- `pnpm run build` — build completo
- `pnpm --filter @workspace/api-server run dev` — servidor API local
