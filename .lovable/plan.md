## 1. Résumé du problème

La preview Lovable (`https://id-preview--…lovable.app/`) affiche un écran blanc sur `/` (et toutes les routes), alors que le serveur Vite répond correctement (`HTTP 200`, HTML servi, hot reload actif). Le bundle JavaScript se charge mais React ne monte rien dans `#root`.

## 2. Fonctionnement de la preview Lovable dans ce projet

- Vite dev server tourne dans la sandbox sur le port `8080` (`vite.config.ts`).
- L'iframe de preview Lovable proxy ce port et sert `index.html`, qui charge `/src/main.tsx`.
- `main.tsx` monte `<App />` enveloppé dans `DomainProvider` + `BrowserRouter`.
- `App.tsx` importe **statiquement** ~25 composants au top-level, dont `Admin`, `Dashboard`, `Profile`, etc.
- Les variables `VITE_*` sont injectées au build/dev par Vite via `import.meta.env`. Sur Lovable, elles viennent des **Build Secrets** (Workspace Settings).

## 3. Investigation réalisée

| Vérification | Résultat |
|---|---|
| `tailwind.config.ts` présent | OK (réparé précédemment, ré-export de `tailwind.config.js`) |
| Dev server logs (`/tmp/sandbox-state.db`) | Vite démarre proprement, aucune erreur de build |
| `curl http://localhost:8080/` | HTTP 200, HTML correct avec `<div id="root">` vide |
| `vite.config.ts` | Standard, port 8080, alias `@`, plugin React |
| `src/main.tsx` | Monte bien `<App/>`, providers OK |
| `src/App.tsx` ligne 50 | `import { Admin } from './components/Admin';` (import statique, top-level) |
| `src/components/Admin.tsx` lignes 58-75 | **`throw new Error('VITE_ADMIN_PASSWORD is required…')` exécuté au chargement du module** si la variable est absente ou < 8 caractères |
| Console logs preview | Aucun log capturé (cohérent avec un crash très précoce) |
| Runtime errors capturés | Aucun dans le snapshot courant — mais l'historique a confirmé `Error: VITE_ADMIN_PASSWORD is required and must be at least 8 characters long` à `Admin.tsx:53` |
| Build Secret `VITE_ADMIN_PASSWORD` | **Pas (encore) défini côté workspace** — les outils Lovable ne peuvent pas définir des Build Secrets, seul l'utilisateur peut |

## 4. Hypothèses testées

| # | Hypothèse | Statut | Preuve |
|---|---|---|---|
| H1 | Vite ne démarre pas | **Écartée** | Logs montrent `VITE v5.4.8 ready`, port 8080, HTTP 200 |
| H2 | `tailwind.config.ts` manquant | **Écartée** | Fichier présent, plus d'erreur dans les logs |
| H3 | Erreur de routing / `BrowserRouter` mal monté | **Écartée** | `main.tsx` correct |
| H4 | Variables `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` absentes | **Écartée** | Le client Supabase est utilisé partout sans crash auparavant ; `Admin.tsx` les valide aussi mais l'erreur reportée est spécifiquement sur `VITE_ADMIN_PASSWORD` |
| H5 | `throw` au top-level de `Admin.tsx` casse tout le bundle car importé statiquement par `App.tsx` | **CONFIRMÉE** | Voir code lignes 58-75 + import ligne 50 de `App.tsx` ; un throw à l'évaluation de module fait échouer tout le graphe d'import qui transite par `App.tsx` → React ne monte jamais → écran blanc |
| H6 | Problème CDN/cache iframe Lovable | Improbable | HTTP 200 servi par le dev server, problème reproductible |

## 5. Cause racine

`src/components/Admin.tsx` exécute des validations d'env vars **à l'évaluation du module** (top-level `throw`). Comme `App.tsx` importe `Admin` de manière statique (ligne 50), l'absence de `VITE_ADMIN_PASSWORD` (≥ 8 caractères) fait crasher l'import → `App` n'est jamais défini → `createRoot().render(<App/>)` échoue → `#root` reste vide → écran blanc sur **toutes** les routes, pas seulement `/admin`.

C'est un anti-pattern : la validation d'une variable réservée à une seule page bloque toute l'application.

## 6. Preuves techniques

- `src/App.tsx:50` → `import { Admin } from './components/Admin';`
- `src/components/Admin.tsx:73-75` →
  ```ts
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error('VITE_ADMIN_PASSWORD is required and must be at least 8 characters long');
  }
  ```
- Erreur runtime déjà observée précédemment dans cette session : `Error: VITE_ADMIN_PASSWORD is required and must be at least 8 characters long` à `Admin.tsx:53` (numéro de ligne d'une version antérieure, même throw).
- HTTP 200 + `#root` vide → cohérent avec une erreur JS pendant l'évaluation du bundle, pas pendant le rendu d'une route.

## 7. Plan de correction recommandé

Deux options, **non exclusives**. Je recommande **A + B** ensemble.

### Option A — Définir le Build Secret (action utilisateur, non-codante)
1. Ouvrir **Workspace Settings → Build Secrets**.
2. Ajouter `VITE_ADMIN_PASSWORD` avec ≥ 8 caractères.
3. Idem, vérifier que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont présents (si la preview repart sans, tant mieux ; sinon les ajouter aussi).
4. Relancer la preview.

> Limite : je ne peux PAS définir un Build Secret depuis mes outils. Cette étape doit être faite manuellement.

### Option B — Rendre `Admin.tsx` résilient (modification code, ~5 lignes)
Transformer les `throw` top-level en **vérifications paresseuses** au moment où la page Admin est réellement utilisée :

- Supprimer les 3 `throw` lignes ~65-75.
- Soit afficher un message d'erreur dans le composant (`if (!ADMIN_PASSWORD) return <ConfigError/>`),
- Soit lever l'erreur uniquement dans le handler de login.

Bénéfice : le reste de l'app (landing, blog, vidéos, témoignages, free trial, etc.) ne dépend plus d'une variable réservée à `/admin`. Une absence de secret ne casse plus la preview entière.

### Option C — Lazy-load `Admin` dans `App.tsx` (alternative à B)
Remplacer `import { Admin }` statique par `const Admin = lazy(() => import('./components/Admin'))` + `<Suspense>`. Le module Admin n'est évalué que si on visite `/admin`. Plus invasif mais aussi efficace.

## 8. Risques

- **Option A seule** : si la variable est un jour retirée ou si une autre page introduit le même anti-pattern, la preview recassera. Ne corrige pas la cause racine architecturale.
- **Option B** : risque très faible. Aucun changement de logique métier ni de sécurité (le mot de passe Admin reste requis pour se connecter, on rend juste l'erreur localisée).
- **Option C** : changement de pattern d'import, peut introduire un flash de Suspense sur `/admin`. Peu de risque mais touche `App.tsx`.

## 9. Validations nécessaires avant implémentation

1. Confirmes-tu que je dois appliquer **Option B** (rendre `Admin.tsx` résilient) ?
2. Veux-tu que j'applique aussi **Option C** (lazy-load) ou seulement B ?
3. Souhaites-tu que je fasse la même opération sur les autres validations env de `Admin.tsx` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) ou seulement sur `VITE_ADMIN_PASSWORD` ?
4. Dois-je toucher uniquement `Admin.tsx` / `App.tsx` (front-end pur) — confirmé pas de changement back-end.

Une fois ta réponse reçue, j'implémente strictement le scope validé.
