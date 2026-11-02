# Blue Dot Intake Form: Setup Plan (about 30 minutes)

Stack: static HTML form on GitHub Pages -> Google Apps Script -> Google Sheet. Free, no server, and the Sheet feeds your calculation engine exactly as before.

## Step 1. Create the Google Sheet and receiver
1. Create a new Google Sheet named "Blue Dot Client Intake".
2. Extensions > Apps Script. Delete the sample code and paste in `Code.gs`.
3. Change `SHARED_TOKEN` to a long random string. Optionally set `NOTIFY_EMAIL`.
4. Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone. Authorise when asked.
5. Copy the Web app URL (ends in `/exec`).

## Step 2. Configure the form
In `index.html`, find `CONFIG` near the bottom and set:
- `endpoint`: the Web app URL from Step 1
- `token`: the same string as `SHARED_TOKEN`

## Step 3. Publish on GitHub Pages
1. Create a GitHub repo (for example `bluedot-intake`). Add `index.html`.
2. Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Your form goes live at `https://<username>.github.io/bluedot-intake/`.
4. Optional: add a custom domain such as `plan.yourdomain.com` under Pages settings and enforce HTTPS.

## Step 4. Test all three paths
Submit one test for each: Insurance only, Investment only, Both. Confirm in the Sheet:
- Hidden sections are blank, visible ones are filled
- `risk_score`, `risk_category` and `monthly_surplus` are populated
- Row 1 headers are created from the first test. Delete the test rows (keep row 1 once you are happy), then never edit headers.

## Step 5. Feed the calculation engine
Share the Sheet or export it as before. Column map for the engine:
- Cash flow and emergency fund: `gross_income_monthly`, `spouse_income_monthly`, `living_expenses`, `total_emis`, `liquid_savings`, `employment_type`, `earners`
- Term (HLV): `age`, `retirement_age`, `personal_expenses`, `outstanding_loans`, `term_existing_cover`, `liquid_savings`, goals or `insurance_goal_cost`
- Health: `health_members`, `health_eldest_age`, `health_personal_cover`, `health_supertopup` (employer cover is recorded but ignored)
- Goals: `g_<slot>_on`, `g_<slot>_cost`, `g_<slot>_years`, `g_<slot>_priority` for slots car, edu, wed, home, ret, o1, o2
- Risk: `risk_score` (8 to 40), `risk_category`

## Before going live
- Replace the test data and set a strong token.
- Add your AMFI ARN / IRDAI registration and a privacy notice link in the form footer or consent text.
- Confirm your MFD vs SEBI RIA position, since the wording of "plan" and "advice" depends on it.
- The form deliberately never asks for PAN, Aadhaar or bank details. Keep it that way; collect KYC through your onboarding process.
- Be aware the token is visible in page source. It deters casual spam only. A honeypot field is also included.
