# TEST_INFRA.md — Gen-Z Weather Web Application Test Infrastructure & Strategy

**Author**: E2E Test Writer Agent (	est_writer_e2e_1)  
**Target Application**: Gen-Z Weather Web Application  
**Framework**: Vitest 3.x + TypeScript 5.x + jsdom  
**Test Suite Directory**: 	ests/e2e/  
**Status**: ACTIVE / TEST_READY  

---

## 1. Executive Summary & Verification Goals

The Gen-Z Weather Web Application eliminates meteorological cognitive overload by translating raw meteorological metrics into aesthetically curated, culturally fluent daily Outfit Of The Day (OOTD) recommendations, punchy Vibe Checks, and condition-tailored activity suggestions.

The goal of this End-to-End (E2E) test infrastructure is to provide an uncompromising, opaque-box verification harness that validates the complete system against user requirements **R1–R5** (from ORIGINAL_REQUEST.md) and the architectural interface contracts established in PROJECT.md.

All test suites execute hermetically via standard command line tooling:
`ash
npm test
`
The test harness requires zero active network connectivity, enforces strict deterministic execution, and tests deep edge cases, multi-condition combinations, and full real-world scenarios.

---

## 2. Test Philosophy & Core Principles

### 2.1 Opaque-Box Requirements Verification
Tests are strictly derived from observable user requirements and formal interface contracts rather than private implementation details. We test:
1. What the user receives: vibe check headlines, mood colors, outfit layers (outerwear, top, bottom, footwear, accessories), style tips, and curated activities.
2. What data models guarantee: adherence to the NormalizedForecastDay, WeatherDataset, and PresetScenario schemas.
3. What edge conditions mandate: proper safety overrides (e.g. umbrella inversion warnings during high gale winds, disqualification of suede/canvas in torrential rain, mandatory puffer/parka in subzero blizzards).

### 2.2 Progressive Testability & Milestones
The test architecture is designed for progressive evaluation:
- **Milestone 1 (M1)**: Scaffolding, Data & API Layer (Types, Preset scenarios, Open-Meteo & Geocoding normalization, safe null fallbacks).
- **Milestone 2 (M2)**: Domain Recommendation Engines (OOTD matrix across 6 temperature bands, Vibe score/headline generation, Activity filtering & outdoor disqualification).
- **Milestone 3 (M3)**: Gen-Z UI & Visual Presentation (Hero Bento cards, OOTD cards, Preset selector pills, Multi-day forecast list, Unit toggling °C/°F).
- **Milestone 4 (M4)**: Full App State Integration & Build Pipeline (Zero type errors, error-free production build).
- **Milestone 5 (M5)**: 100% E2E Pass & Hardening (Complete test suite pass with zero failures or skips).

### 2.3 Hermetic Isolation & Determinism
- No live external HTTP requests during automated test execution. Geocoding and Open-Meteo API clients are tested using mock network handlers (i.stubGlobal('fetch', ...)) and pre-configured fixtures.
- Every test is self-contained: no shared mutable state, no order-dependent tests, and automatic cleanup after each test execution.
- Explicit derivation of expected values from authoritative sources (ORIGINAL_REQUEST.md, PROJECT.md, domain_logic_report.md, and spec_report.md).

### 2.4 Cultural & Semantic Fidelity
Testing a Gen-Z application requires validating linguistic and visual semantics:
- Verifying the presence of relatable, non-meteorological slang (e.g., *Sweater weather*, *Immaculate*, *Melting*, *Arctic*, *No cap*).
- Verifying anti-jargon formatting: plain-language headlines, emoji badges, and bento-friendly summaries instead of barometric graphs or isobar dials.

---

## 3. Feature Inventory & Multi-Tier Verification Matrix

| Feature ID | Feature Name | Requirement Ref | Tier 1 (Features) | Tier 2 (Boundaries) | Tier 3 (Combinations) | Tier 4 (Real-World) |
|---|---|---|---|---|---|---|
| **F1** | Toolchain & Configuration | R1, R5 | Config validity, TS strictness | Module resolution | Bundle integration | Production build pass |
| **F2** | Unified Data Schema | R2, R5 | Schema completeness, types | Nullable/optional fields | Schema conversions | 5-day dataset validity |
| **F3** | Open-Meteo Live API Client | R2 | 7-day query parsing, WMO codes | Malformed JSON, 429 errors | Retry & fallback to preset | Realistic city forecast fetch |
| **F4** | Geocoding City Search | R2 | Autocomplete, coordinate lookup | 0-match results, empty query | Accented & multi-word cities | Search -> Forecast flow |
| **F5** | Weather Scenario Presets | R2 | All 4 required presets exist | Extreme preset metrics | Preset switching transitions | Preset exploration workflows |
| **F6** | OOTD Recommendation Engine | R3 | 6 temperature bands, all layers | Freezing <0°C, Scorching >35°C | Rain + Gale wind overrides | 5 City-specific outfits |
| **F7** | Vibe Check Engine | R1, R4 | Headlines, 0-100 score, palettes | Edge scores (0, 100, disaster) | Rain + Mist, Heat + UV | Vibe evolution over 5 days |
| **F8** | Activity Planner Engine | R4 | 3 curated activities, tags | Hazardous weather disqualification | Indoor routing on storms | City-specific itinerary |
| **F9** | Engine Unit Logic | R5 | Pure function execution | Boundary temps (0, 11, 18, 25, 32°C)| Wind chill + UV index | Multi-day consistency |
| **F10** | Neo-Brutalist Pop Styling | R1 | Borders, shadows, palettes | High contrast accessibility | Palette shifts on conditions | Theme responsiveness |
| **F11** | Preset Selector Pills | R2 | Pill count, active indicator | Rapid switching | State persistence | Preset workflow validation |
| **F12** | Hero Today Bento Card | R1, R4 | Headline, temp, emoji badge | Subzero & heat temp display | Dynamic mood color binding | Hero rendering in 5 cities |
| **F13** | OOTD Display Cards | R3 | Outerwear, top, bottom, shoes | Footwear swap on precipitation | Suede banned on rain | Outfit display across week |
| **F14** | Activities Display Cards | R4 | Tags, indoor/outdoor badges | Indoor lock on rain/blizzard | Energy & social tag matching | Curated weekend activities |
| **F15** | Multi-Day Forecast Grid | R2 | Day pills, 5-7 day display | Month rollover, leap year | Day selection updates Hero | Full 7-day strip navigation |
| **F16** | City Search & Geo Header | R2 | Input field, geo button, °C/°F | Geolocation denial fallback | Unit toggle recalculation | Search London/Tokyo/NYC |
| **F17** | Full App State Integration | R1-R5 | Central state flow | Network offline recovery | Preset vs Live state toggle | Complete user session |
| **F18** | Production Build Verification | R5 | Zero compiler/linter errors | Edge-case tree shaking | Asset integrity | Clean distribution build |

---

## 4. Test Suite Architecture & Directory Layout

The E2E test harness resides in 	ests/e2e/ and comprises four tiered test files executing via Vitest:

`
genzweather/
├── TEST_INFRA.md                          # Comprehensive test infrastructure specification
├── TEST_READY.md                          # Execution summary & runner readiness report
├── vite.config.ts                         # Vitest runner configuration
├── package.json                           # npm test script (vitest run)
└── tests/
    └── e2e/
        ├── testHelpers.ts                 # Shared mock factories, assertions & engine adapters
        ├── tier1_features.test.ts         # Tier 1: Core Feature Verification (F1–F16)
        ├── tier2_boundaries.test.ts       # Tier 2: Boundary & Corner Case Verification
        ├── tier3_combinations.test.ts     # Tier 3: Cross-Feature Combinations & Pairwise
        └── tier4_realworld.test.ts        # Tier 4: Real-World Workloads & City Scenarios
`

### 4.1 Mocking Strategy
- **Open-Meteo API**: Mocked via deterministic JSON responses matching official Open-Meteo CC-BY-4.0 schemas.
- **Geocoding API**: Mocked with realistic coordinate payloads for major cities (Tokyo, London, New York, Reykjavik, Miami) and zero-match empty responses ({ generationtime_ms: 0.1 }).
- **Geolocation API**: Mocked 
avigator.geolocation testing success and PERMISSION_DENIED fallback.
- **Clock / Dates**: Fixed ISO date anchors (2026-09-11) to ensure deterministic day-of-week strings.

---

## 5. Detailed Tier Specifications

### Tier 1: Feature Coverage (	ests/e2e/tier1_features.test.ts)
Validates that every individual feature meets its primary contract (minimum 5 assertions/tests per feature):
- **F1–F5 Data Layer & Presets**:
  1. All 4 required presets exist: *Crisp Autumn Sweater Weather*, *Scorching Heatwave*, *Gloomy Rainy Day*, *Subzero Blizzard*.
  2. Each preset contains a valid 5-day NormalizedForecastDay[] array with valid ISO dates and temperatures.
  3. Geocoding service returns parsed city results with latitude, longitude, and country.
  4. Geocoding service gracefully returns empty array for queries < 2 characters or non-existent cities.
  5. Open-Meteo service parses 7-day raw responses into normalized structures with condition category and emoji.
- **F6–F8 Domain Engines**:
  6. OOTD Engine correctly classifies temperature bands (SUBZERO, CHILLY, MILD_CRISP, WARM, HOT, SCORCHING).
  7. OOTD Engine recommends appropriate layers (outerwear, top, bottom, footwear, accessories) for each band.
  8. Vibe Check Engine generates punchy headlines, aesthetic badges, and 0–100 vibe scores.
  9. Vibe Check assigns dynamic mood color tokens (sunny, ain, snow, heat, storm, mild_cloudy).
  10. Activity Planner Engine recommends 3 curated activities with indoor/outdoor flags and time-of-day tags.
- **F10–F16 UI Contracts**:
  11. Neo-brutalist pop styling tokens (borders, shadows, mood colors) are consistently specified.
  12. Hero bento card exposes headline, temperature, vibe pill, and condition summary without complex dials.
  13. OOTD cards display footwear, accessories, and style tips.
  14. Activity planner renders tags (chill/high energy, solo/besties/date).
  15. Forecast strip displays multi-day sequence allowing interactive day selection.
  16. Temperature unit conversion function accurately converts °C to °F (	oDisplayTemp).

### Tier 2: Boundary & Corner Cases (	ests/e2e/tier2_boundaries.test.ts)
Validates system behavior at the edges of meteorological and input parameters (minimum 5 tests per category):
1. **Subzero Freezing (< 0°C)**:
   - Temperatures from -1°C down to -25°C.
   - Mandatory heavyweight outerwear (down puffer, arctic parka).
   - Mandatory thermal accessories (beanie, fleece-lined balaclava, mittens).
   - Disqualification of shorts, slides, sandals, and canvas shoes.
2. **Heavy Blizzard & Snowfall**:
   - Heavy snow WMO codes (71, 73, 75, 85, 86).
   - Lug-sole snow boots or insulated thermal boots.
   - Outdoor strolls completely disqualified; warm indoor haven suggested.
3. **Torrential Rain & Storm (Precipitation >= 20mm, Wind >= 35 km/h)**:
   - Thunderstorm WMO codes (95, 96, 99) and heavy rain (63, 65).
   - Suede and canvas footwear strictly forbidden.
   - High wind warning: umbrella inversion alert recommending hooded rain shells.
   - Outdoor activities (picnics, skateparks) banned; indoor activities promoted.
4. **Extreme Heatwave (> 35°C, UV Index >= 9)**:
   - Outerwear strictly 
ull (no jackets or coats).
   - Mandatory sun protection: sunglasses, SPF 50, hydration reminder.
   - Breathable garments (linen, open-weave, airy shorts).
   - Strenuous midday outdoor activities banned; indoor AC haven recommended.
5. **High Gale Wind (> 35 km/h up to 75 km/h)**:
   - Umbrella hazard warning injected into pro tips.
   - Windbreaker or storm shell outerwear recommended.
   - Caps/hats warned against blowing away.
6. **Input Boundaries & Empty Results**:
   - Empty search string ("), whitespace-only (   ), single character (A).
 - Gibberish city search (zzxxqqww1122).
 - Missing optional fields in Geocoding result (dmin1 absent).
 - Exact temperature thresholds (0.0°C, 11.0°C, 18.0°C, 25.0°C, 32.0°C).

### Tier 3: Cross-Feature Combinations ( ests/e2e/tier3_combinations.test.ts)
Validates multi-variable pairwise interactions and state transitions:
1. **Rain + High Wind**: Heavy downpour combined with 45 km/h wind -> triggers waterproof platform boots, bans standard umbrellas, mandates hooded technical shell.
2. **Freezing + High Wind**: -5°C combined with 40 km/h wind -> severe windchill calculation, thermal windproof parka, balaclava, absolute ban on outdoor activities.
3. **Heatwave + High UV + Clear Sky**: 38°C + UV 11 -> ultra-high sun hazard, linen tank, SPF, indoor art museum haven, hydration alert.
4. **Warm Humid Rain (Muggy Monsoon)**: 24°C + 10mm rain -> MUST NOT recommend winter puffer jacket! Recommends lightweight packable shell/poncho and water-friendly footwear.
5. **Preset Switching & State Continuity**: Sequential switching across all 4 presets (Autumn -> Heatwave -> Blizzard -> Rain) verifying that all properties (vibe, ootd, activities) update cohesively without residual stale data.
6. **Temperature Unit Toggling (°C to °F)**: Verifies that toggling units recalculates all daily highs, lows, and feels-like values accurately while preserving weather logic bands.

### Tier 4: Real-World Scenarios ( ests/e2e/tier4_realworld.test.ts)
Validates complete end-to-end user workflows against 5 realistic multi-day real-world workloads:
1. **London Rainy Autumn Weekend**:
 - 3-day damp weekend: 12–14°C, 15–20mm rain, 25–35 km/h wind.
 - Trench coat, lug-sole boots, compact umbrella, indie record store crawl, warm cafe matcha run.
2. **Tokyo Spring Matcha Stroll**:
 - 5-day pleasant spring: 18–21°C, partly cloudy, 10 km/h breeze, UV 4–5.
 - Chore jacket, knit sweater, baggy denim, retro sneakers, Shibuya thrifting, Yoyogi park picnic.
3. **Reykjavik Subzero Blizzard Expedition**:
 - 4-day arctic freeze: -6°C to -12°C, 8–15mm snow, 48–60 km/h gale.
 - Down parka, thermal boots, balaclava, thermal mittens, geothermal lagoon, indoor bakery shelter.
4. **Miami Scorching Heatwave**:
 - 4-day tropical heatwave: 34–37°C, feels-like 42°C, UV 10–11, clear sky.
 - Linen crop top/shirt, swim shorts, slide sandals, polarized sunglasses, shaded smoothie bar, Wynwood gallery.
5. **NYC Mild Crisp Gallery Crawl**:
 - 5-day crisp autumn: 15–17°C, 0mm rain, 12 km/h breeze, UV 3.
 - Oversized blazer or leather jacket, wide-leg trousers, platform kicks, tote bag, Chelsea art walk, sunset rooftop cider.

---

## 6. Coverage Thresholds & Quality Verification

| Metric | Required Threshold | Verification Command |
|---|---|---|
| **E2E Test Suites** | 4 suites ( ier1, ier2, ier3, ier4) | 
pm test |
| **Total Test Cases** | >= 65 comprehensive tests | itest run tests/e2e/ |
| **Requirements Coverage** | 100% of R1–R5 | Traceability matrix in TEST_READY.md |
| **Edge Case Assertions** | 100% of defined boundaries | Tier 2 test pass |
| **TypeScript Compilation** | Zero type errors ( sc --noEmit) | 
pm run build |
| **Test Execution Time** | < 3.0 seconds total | Vitest test runner summary |

---

## 7. Execution Commands

Run all E2E test suites:
`ash
npm test
`

Run specific tiers:
`ash
npx vitest run tests/e2e/tier1_features.test.ts
npx vitest run tests/e2e/tier2_boundaries.test.ts
npx vitest run tests/e2e/tier3_combinations.test.ts
npx vitest run tests/e2e/tier4_realworld.test.ts
`

Verify production build:
`ash
npm run build
`
