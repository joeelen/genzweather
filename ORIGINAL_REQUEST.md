# Original User Request

## Initial Request — 2026-09-11T06:58:07Z

A Gen-Z styled weather web application that cuts through complex meteorological charts and dials by translating daily weather forecasts directly into intuitive, aesthetic day-by-day clothing recommendations ("OOTD"), vibe checks, and curated activity suggestions.

Working directory: c:\Users\joels\GEMINI PROJECTS (mine egne)\genzweather
Integrity mode: development

## Requirements

### R1. Gen-Z Vibe & Simplified Visual Presentation
The UI must deliver a fresh, bold, contemporary Gen-Z aesthetic (expressive typography, vibrant or mood-based color palettes, emoji badges, card/bento layouts, and smooth micro-interactions). It must prioritize plain-language, relatable summaries over dense graphs, isobars, or geometric dials.

### R2. Multi-Day Forecast with Live API & Quick Presets
Provide a day-by-day forecast view supporting both:
1. Live weather data fetching (e.g., via a free open API such as Open-Meteo requiring no API key) with city search and/or geolocation.
2. Quick interactive preset weather scenarios (e.g., "Crisp Autumn Sweater Weather", "Scorching Heatwave", "Gloomy Rainy Day", "Subzero Blizzard") for instant exploration.

### R3. Contextual Clothing ("OOTD") Recommendation Engine
Automatically translate each day's temperature, precipitation risk, wind, and conditions into concrete, stylish clothing recommendations (e.g., outerwear, base layers, footwear, sunglasses/umbrella accessories).

### R4. Vibe Check & Activity Planner
Generate a bite-sized "Vibe Check" headline for each day alongside curated activity recommendations tailored to the conditions (e.g., indoor cafe crawl / thrifting vs. golden hour park hangout / beach day).

### R5. Verification & Code Quality
Include automated tests verifying the recommendation logic across diverse weather thresholds (extreme cold, rainy, hot, transitional) and ensure the application builds cleanly with zero errors.

## Acceptance Criteria

### Functionality & Experience
- [ ] The web app builds and launches locally without errors.
- [ ] Users can view a multi-day forecast with intuitive day-by-day cards.
- [ ] Users can search for cities to fetch real weather and switch between pre-configured weather scenario presets.
- [ ] Each day clearly presents a "Vibe Check" headline, temperature, and condition summary without complex charts.
- [ ] Each day presents specific clothing recommendations ("OOTD") matched to the weather conditions.
- [ ] Each day presents curated indoor or outdoor activity suggestions appropriate for the conditions.
- [ ] Visual styling follows a cohesive, modern Gen-Z visual identity with responsive layout across desktop and mobile.

### Verification
- [ ] Automated test suite verifies clothing and activity recommendation logic for multiple weather edge cases (subzero freezing, heavy rain/storm, high heat, mild breeze).
- [ ] Production build command completes with exit code 0 and zero lint/type errors.
