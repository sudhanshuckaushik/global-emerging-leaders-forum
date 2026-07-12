# Typography Identity & Licensing Guidelines

This document details the brand fonts used by the Global Emerging Leaders Forum 2026, their layout constraints, and fallback plans.

## 1. Primary Font: Ruder Plakat Tall 900

Used for the main participant **NAME** and the **FORUM LOCKUP** placeholder.

- **Foundry / Source**: Lineto (https://lineto.com/typefaces/ruder-plakat)
- **Cut**: Tall 900 (bold, narrow, tall grotesque block style)
- **Licensing Notice**:
  - The repository utilizes a trial cut under a standard Lineto Trial License ("Ruder Plakat Trial VIP").
  - **Do NOT distribute the TTF font file directly** to third parties or host it publicly without a valid license.
  - The website/consumer must acquire their own license file from Lineto for production deployment.
- **Fallback Stack**:
  - In environments where Ruder Plakat is unavailable, fall back to:
    `"Ruder Plakat Tall 900", "Ruder Plakat Trial VIP", sans-serif`
  - Claude should use a heavy, ultra-condensed sans-serif stack to maintain visual weight and tall proportions.

## 2. Secondary Font: Plus Jakarta Sans

Used for the participant's **DESIGNATION** / title.

- **License**: SIL Open Font License (OFL) - free for commercial use.
- **Source**: Google Fonts (https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Weight**: 800 (Extra Bold)

## 3. Pinned Typography Geometry (777-Unit Figma Reference)

All layout dimensions must follow the relative proportion rules so that they scale lock-step at any target resolution:

| Attribute | Font / Style | Value / Ratio | Notes |
|---|---|---|---|
| **Name Size** | Ruder Plakat Tall 900 | Fitted ("As big as fits") | Scaled analytically; no ceiling; auto-wrapped up to 3 lines (or more if forced by manual newline) |
| **Name Line Height** | Ruder Plakat Tall 900 | `1.27` | Multiplier of font size |
| **Name Letter Spacing** | Ruder Plakat Tall 900 | `0.052` | Multiplier of font size |
| **Name Color** | Solid | `#C9CBFF` | Pale blue tint |
| **Designation Size** | Plus Jakarta Sans 800 | `20` ref units | Flat size |
| **Designation Line Height** | Plus Jakarta Sans 800 | `1.2` | Multiplier of font size |
| **Designation Letter Spacing**| Plus Jakarta Sans 800 | `0.04` | Multiplier of font size |
| **Designation Color** | Solid | `#00E5FF` | Bright cyan |
| **Forum Size** | Ruder Plakat Tall 900 | `19` ref units | Flat size |
| **Forum Line Height** | Ruder Plakat Tall 900 | `1.32` | Multiplier of font size |
| **Forum Letter Spacing** | Ruder Plakat Tall 900 | `0.1` | Multiplier of font size |
| **Forum Color** | Solid | `#F53733` | Bright red |

### Optical Size Compensation for Name
When the fitted name size is scaled below the reference optical size of `97.454` units, line-height and letter-spacing must scale up linearly to maintain readability:
- **Formula**: `ratio_multiplier = 1 + 0.02 * clamp(0, 1, (97.454 - refFontSize) / 97.454)`
- Multiplies both the base line height (`1.27`) and base letter spacing (`0.052`).
