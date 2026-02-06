## Parser Enhancements
- [ ] Add microdata parsing (for sites like Smitten Kitchen)
- [ ] HTML scraping fallback for sites without schema.org
- [ ] Use AI to read/extract recipes from any webpage

## Edge Cases Discovered
- Some sites use `@type: ["Recipe"]` (array) instead of string - FIXED
- Some sites have unquoted type attributes - FIXED
- Smitten Kitchen uses microdata format, not JSON-LD

## Notes
- Board cover images come from first recipe (dynamic, not stored)
- Parser returns camelCase to match API expectations