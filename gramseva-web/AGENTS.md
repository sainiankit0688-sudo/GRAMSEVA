<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Session Summary

## Phase 3 — Emergency Module Final Production Audit (Complete)

### Objective
Deliver production-ready Emergency Module through comprehensive audit (dead code, performance, accessibility, security, SEO, TypeScript, ESLint, build), then freeze all files.

### Outcome — **ALL CHECKS PASSED — EMERGENCY MODULE FROZEN ✅**

### Audit Results

| Check | Status | Notes |
|-------|--------|-------|
| **Dead Code** | ✅ PASS | Removed unused `useMemo` (contacts), unused `useState` (dashboard), unused `useEffect`+`labelHindi` (NotificationButton) |
| **Performance** | ✅ PASS | `useCallback` on all handlers, `useMemo` on filter results, lazy `useState` init for localStorage, 300ms debounce, 5min staleTime |
| **ESLint** | ✅ PASS | 0 errors across all 22 emergency files |
| **TypeScript** | ✅ PASS | 0 errors, 44 routes, all 8 emergency pages `○ (Static)` |
| **Build** | ✅ PASS | `npm run build` compiles cleanly |
| **Accessibility** | ✅ PASS | ARIA roles (dialog, progressbar, list, listitem, article, alert, region), aria-modal/expanded/pressed/label/controls/live/valuenow, focus rings on all interactive elements, semantic headings |
| **Security** | ✅ PASS | No XSS vectors, no hardcoded secrets, all external links use `rel="noopener noreferrer"`, `encodeURIComponent` on user values, try/catch on all localStorage, only trusted JSON-LD uses `dangerouslySetInnerHTML` |
| **SEO** | ✅ PASS | Metadata (title, description, OG, Twitter), JSON-LD structured data (CollectionPage + 7 mainEntity), canonical URL, og:image, breadcrumbs on all sub-pages, proper heading hierarchy |

### Frozen Files (22 files)

**Pages (9):** `app/emergency/layout.tsx`, `page.tsx`, `emergency-contacts/page.tsx`, `hospitals/page.tsx`, `ambulance/page.tsx`, `police/page.tsx`, `fire/page.tsx`, `disaster/page.tsx`, `helplines/page.tsx`

**Components (12):** `components/emergency/SOSButton.tsx`, `EmergencyShell.tsx`, `DisasterChecklist.tsx`, `FamilyEmergencyPlan.tsx`, `OfflineCards.tsx`, `NearbyUpgrade.tsx`, `BookmarkButton.tsx`, `useBookmarks.ts`, `SmartBadges.tsx`, `ShareActions.tsx`, `NotificationButton.tsx`, `useAdvancedSearch.ts`

**Service (1):** `lib/services/emergencyService.ts`
