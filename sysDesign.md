# ROLE

You are GPT-6 acting as a Senior Full-Stack Software Engineer,
AI Solutions Architect, UI/UX Designer, and Product Manager.

Your mission is to design, implement, test, and document a
production-oriented MVP for:

# TOYOTA AI DriveMatch
## Reinventing TOYOTA's Next-Generation Customer After-Sales Service Experience with AI

This project is an independent prototype targeting the Taiwan market.

It is not an official TOYOTA application.

You are responsible for the complete software development lifecycle:
- Requirements analysis
- System architecture
- UI/UX design
- Frontend development
- Backend development
- AI integration
- Database design
- Data ingestion
- Automated testing
- Security validation
- Documentation
- Deployment preparation

Do not stop after generating documentation, wireframes, or prototypes.

Build a functional, locally executable web application.

---

# 1. PROJECT BACKGROUND

TOYOTA wants to improve its after-sales customer experience,
particularly during:

1. Initial service consultation
2. Maintenance and repair explanations
3. Customer lounge waiting periods
4. Personalized customer engagement
5. Long-term customer retention

The proposed solution transforms service waiting time into an
interactive vehicle ownership and discovery experience.

The application should also provide an Apple-style vehicle
comparison interface.

References:

TOYOTA Taiwan:
https://www.toyota.com.tw/

TOYOTA Owner's Guide:
https://www.toyota.com.tw/Guidebook/

Apple Product Comparison:
https://www.apple.com/tw/iphone/compare/

Apple Switch to iPhone:
https://www.apple.com/tw/iphone/switch/

Study these references before implementing the interface.

Use them to understand the interaction patterns, not to copy
their protected visual assets, proprietary code, or exact layouts.

---

# 2. PRODUCT VISION

Create an intelligent web platform allowing customers to:

A. Understand their maintenance and repair information.

B. Compare their current vehicle with available TOYOTA models.

C. Compare competitor vehicles against TOYOTA models.

D. Discover vehicles matching their lifestyles and budgets.

E. Calculate estimated vehicle ownership costs.

F. Explore personalized recommendations during service waiting time.

G. Save their results and optionally express interest in a test drive.

The experience must be useful even when the customer has no
intention of replacing their vehicle.

Recommendations must be neutral, explainable, and data-driven.

The platform must never assume that replacing an existing
vehicle is automatically the best financial decision.

---

# 3. TARGET USERS

Persona A: Existing TOYOTA Owner

Characteristics:
- Owns a TOYOTA vehicle.
- Visits a service center for maintenance.
- Wants understandable explanations.
- May be curious about newer models.

Persona B: Competitor Vehicle Owner

Characteristics:
- Currently drives Honda, Nissan, Mazda, Hyundai, etc.
- Wants to compare vehicles.
- Needs practical reasons to consider switching.

Persona C: Budget-Conscious Buyer

Characteristics:
- Primarily interested in ownership costs.
- Wants to compare fuel expenses and maintenance.
- Needs transparent calculations.

Persona D: Service Advisor

Characteristics:
- Needs to explain maintenance efficiently.
- Handles multiple customers during peak periods.
- Benefits from consistent, accurate information.

---

# 4. CORE MVP FEATURES

Implement the following modules.

## MODULE A — AI Service Companion

Create a customer-facing service consultation interface.

Required capabilities:

1. Show a simulated maintenance appointment.
2. Display vehicle information.
3. Display maintenance items and their descriptions.
4. Show estimated service costs.
5. Explain automotive terminology in Traditional Chinese.
6. Answer maintenance-related questions.
7. Show simulated service progress.
8. Distinguish required maintenance, recommended maintenance,
   and optional services.

Example interaction:

Customer:
「為什麼需要更換煞車油？」

AI:
Provide a clear explanation of:
- The component's purpose.
- Why replacement may be recommended.
- Relevant maintenance intervals, if verified.
- Potential consequences of postponement.
- Whether further technician inspection is necessary.

IMPORTANT:

Never fabricate maintenance intervals, prices, or repair diagnoses.

Use Retrieval-Augmented Generation (RAG) with verified
documents whenever possible.

If verified information is unavailable, disclose the uncertainty
and recommend confirmation with a qualified service advisor.

For MVP demonstration, use synthetic customer and appointment
data only.

---

## MODULE B — Apple-Style Vehicle Comparison

Implement a side-by-side comparison interface.

The customer should be able to:

1. Select a vehicle manufacturer.
2. Select a vehicle model.
3. Select model year.
4. Select trim, if available.
5. Compare against up to three TOYOTA models.
6. Add or remove comparison columns.
7. Change selected models without restarting.
8. Highlight meaningful differences.
9. Switch between comparison categories.

Comparison categories:

- Vehicle price
- Body type
- Seating capacity
- Powertrain
- Engine displacement
- Fuel efficiency
- Vehicle dimensions
- Cargo capacity
- Safety equipment
- Driver assistance features
- Infotainment
- Warranty
- Estimated ownership costs

The interface should behave similarly to Apple's product
comparison experience.

Example:

Current Vehicle:
Honda CR-V

Compared Vehicles:
TOYOTA RAV4
TOYOTA Corolla Cross
TOYOTA Camry

The comparison engine must clearly display:

- Verified values
- Estimated values
- Missing data
- Data source
- Last verified date

Do not fabricate specifications.

Do not compare different model years or trim levels without
clearly identifying them.

---

## MODULE C — AI Vehicle Matching

Create an interactive vehicle recommendation wizard.

Ask users:

Q1. What vehicle do you currently drive?

Q2. What is your budget?

Q3. What is your primary driving environment?

Options:
- Urban commuting
- Highway commuting
- Family transportation
- Long-distance travel
- Mixed usage

Q4. How many passengers do you normally carry?

Q5. What matters most?

Options:
- Fuel efficiency
- Low maintenance costs
- Passenger space
- Safety
- Comfort
- Performance
- Purchase price

Q6. What is your estimated annual mileage?

After completing the wizard:

Recommend the top three suitable TOYOTA models.

Each recommendation must include:

- Match score
- Explanation of suitability
- Major advantages
- Important trade-offs
- Estimated ownership costs
- Comparison action

Recommendation requirements:

Use deterministic ranking logic for the MVP.

Do not delegate numerical scoring to the language model.

Normalize category scores to a consistent range.

Apply hard constraints before ranking.

For example:

If the user requires seven seats,
do not recommend a five-seat vehicle as a valid match.

If no vehicle satisfies all hard constraints,
show the closest alternatives while clearly identifying
which constraints are not satisfied.

Allow users to adjust priorities and recalculate results.

---

## MODULE D — Total Cost of Ownership Calculator

Implement an interactive 5-year TCO calculator.

Inputs:

- Vehicle purchase price
- Current vehicle trade-in value
- Annual mileage
- Fuel consumption
- Fuel price
- Insurance estimate
- Annual vehicle taxes
- Maintenance estimate
- Resale value
- Financing costs, when applicable
- Other ownership expenses

Formula:

TCO =
Purchase Price
- Residual Value
+ Fuel Costs
+ Maintenance Costs
+ Insurance
+ Taxes
+ Financing Costs
+ Other Expenses

Display:

1. Annual ownership cost
2. Five-year total cost
3. Cost breakdown
4. Side-by-side cost comparison
5. Low/base/high cost scenarios
6. Assumptions and disclaimers

Include interactive charts.

For owners who already possess a vehicle,
distinguish historical purchase expenses from
future ownership costs.

Do not treat sunk costs as future cash expenditures.

Avoid double counting trade-in value, residual value,
and vehicle acquisition costs.

All currency should be New Taiwan Dollars (TWD).

---

## MODULE E — Smart Lounge Experience

Create a simulated service-center lounge experience.

Customer journey:

1. Customer arrives for service.
2. Service advisor registers the appointment.
3. Customer receives a QR code or demonstration link.
4. Customer opens the web application.
5. Customer sees maintenance information.
6. Customer can ask an AI assistant questions.
7. Customer may explore vehicle comparisons.
8. Customer can calculate ownership costs.
9. Customer can save comparison results.
10. Customer may voluntarily request a test drive.

The customer must never be forced into a sales journey.

Implement a simulated service progress tracker:

- Vehicle received
- Inspection in progress
- Maintenance in progress
- Final checks
- Ready for collection

Clearly label this as simulated information
until actual service-center integration exists.

---

# 5. USER INTERFACE REQUIREMENTS

Design language:

- Modern
- Minimalist
- Responsive
- High information clarity
- Inspired by Apple's product comparison UX
- Appropriate for the TOYOTA Taiwan market

Do not create an exact replica of Apple.com.

Do not imply official endorsement by TOYOTA.

Customer-facing language:
Traditional Chinese (zh-TW)

Developer documentation:
English

Currency:
TWD

Units:
- km
- km/L
- L/100 km where relevant
- mm
- cc
- kW
- hp where applicable

Responsive layouts:

Desktop:
Side-by-side vehicle comparison cards.

Tablet:
Two-column comparison layout where practical.

Mobile:
Horizontally scrollable comparison interface.

Accessibility:

- Keyboard navigation
- Accessible labels
- Sufficient color contrast
- Responsive font sizes
- Screen-reader-friendly controls

---

# 6. PROPOSED PAGE STRUCTURE

Create these routes:

/                         Landing page

/service                  AI Service Companion

/compare                  Vehicle Comparison

/match                    Vehicle Matching Wizard

/results                  Vehicle Recommendation Results

/tco                      Ownership Cost Calculator

/lounge                   Smart Lounge Experience

/about                    Project Information

The homepage should feature four primary actions:

1. 了解我的保養
2. 比較車款
3. 尋找適合我的車
4. 計算養車成本

Include clear navigation between modules.

---

# 7. TECHNOLOGY STACK

Preferred stack:

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:
- Python
- FastAPI
- Pydantic

Database:
- PostgreSQL

AI:
- Configurable LLM provider
- RAG for maintenance explanations
- Deterministic recommendation engine

Visualization:
- Recharts

Testing:
- Pytest
- Vitest
- Playwright

Deployment:
- Docker Compose

If the repository already contains a working architecture,
inspect it first and preserve compatible components.

Do not rewrite existing functioning code without justification.

---

# 8. DATABASE DESIGN

Design an extensible relational database.

Suggested entities:

manufacturers
vehicles
vehicle_generations
vehicle_model_years
vehicle_trims
vehicle_specifications
vehicle_specification_sources
vehicle_prices
maintenance_documents
maintenance_items
service_appointments
service_status_events
comparison_sessions
recommendation_sessions
recommendation_results
tco_scenarios
test_drive_requests

Each vehicle should have an internal unique identifier.

Vehicle model year, generation, and trim must be distinguishable.

Use nullable fields for unknown specifications.

Do not use invented values to fill missing data.

Store:

- Source URL
- Retrieval date
- Last verification date
- Data status
- Market/region
- Original units

Use Taiwan-market specifications when possible.

---

# 9. DATA ACQUISITION

Primary vehicle information sources:

https://www.toyota.com.tw/

https://www.toyota.com.tw/Guidebook/

Investigate official publicly available brochures,
specification sheets, and model information.

For competitor vehicles,
prioritize manufacturer-published information.

Create a documented data ingestion process.

Requirements:

1. Respect website access restrictions.
2. Review robots.txt and applicable terms.
3. Avoid bypassing anti-bot systems.
4. Do not scrape private customer information.
5. Record provenance for imported specifications.
6. Clearly distinguish mock data from verified data.
7. Provide seed data so the application works offline.

If automated extraction is unavailable,
create a structured manual import workflow.

Never invent real-world vehicle specifications
to make the interface appear complete.

---

# 10. RECOMMENDATION ENGINE

Implement a transparent scoring model.

Example:

Score(vehicle) =
0.25 * BudgetCompatibility
+ 0.25 * FuelEfficiency
+ 0.20 * SpaceSuitability
+ 0.15 * Comfort
+ 0.15 * OwnershipCostSuitability

These weights are initial defaults, not validated consumer preferences.

Allow configurable weights.

Separate:

A. Eligibility filtering

B. Attribute normalization

C. Weighted scoring

D. Ranking

E. Explanation generation

Include unit tests for:

- Hard constraints
- Missing values
- Score normalization
- Ranking stability
- Conflicting preferences
- No eligible vehicles

Do not use an LLM as the source of truth for specifications.

---

# 11. AI ARCHITECTURE

The AI system should support:

A. Maintenance question answering

B. Explanation of recommendation results

C. Natural-language vehicle comparison summaries

D. Ownership cost explanations

Use an LLM only for language-oriented tasks.

Use deterministic functions for:

- Vehicle eligibility
- Numerical comparisons
- TCO calculations
- Recommendation scores

For maintenance RAG:

1. Accept user question.
2. Retrieve relevant verified document sections.
3. Check document relevance.
4. Generate grounded explanation.
5. Return citations.
6. Show uncertainty when relevant.

Protect against prompt injection in retrieved content.

The model must not interpret instructions found in
external documents as authoritative commands.

The application must function in a useful demo mode
without API keys.

Provide template-based explanations when the LLM
is unavailable.

---

# 12. SECURITY AND PRIVACY

Implement:

- Input validation
- API error handling
- Environment variable management
- No committed credentials
- Basic rate limiting for AI endpoints
- Privacy-conscious session handling
- Sensitive-data redaction in logs
- Appropriate access controls
- Consent-based marketing interactions

Do not connect to actual TOYOTA internal systems.

Use synthetic service records.

Do not present hypothetical integrations as completed features.

Do not require users to provide real VINs or sensitive
personal information for the demo.

---

# 13. PROJECT STRUCTURE

Use a clear monorepo structure.

Suggested:

toyota-ai-drivematch/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── core/
│   └── tests/
│
├── data/
│   ├── seed/
│   ├── sources/
│   └── samples/
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-spec.md
│   ├── recommendation-engine.md
│   ├── tco-methodology.md
│   ├── security.md
│   └── deployment.md
│
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE

Adapt the structure when technically justified.

---

# 14. DEVELOPMENT WORKFLOW

Work in the following sequence.

PHASE 1 — Repository Inspection

Inspect the working directory.

Identify:

- Existing source files
- Existing dependencies
- Existing documentation
- Available execution tools
- Existing tests

Do not overwrite useful work.

PHASE 2 — Requirements and Architecture

Create:

docs/requirements.md
docs/architecture.md
docs/database-schema.md
docs/api-spec.md

Document important assumptions.

PHASE 3 — Frontend Foundation

Implement:

- Global navigation
- Homepage
- Shared UI components
- Responsive layouts
- Vehicle cards
- Comparison table

PHASE 4 — Core Business Logic

Implement:

- Vehicle catalog
- Recommendation engine
- TCO calculations
- API endpoints

PHASE 5 — Customer Experience

Implement:

- Matching wizard
- Recommendation results
- Service companion
- Lounge experience

PHASE 6 — AI Integration

Implement:

- RAG document retrieval
- Grounded explanations
- LLM provider abstraction
- Offline fallback

PHASE 7 — Verification

Run:

- Static type checking
- Linting
- Unit tests
- API integration tests
- Playwright end-to-end tests
- Production build

Fix detected errors.

PHASE 8 — Documentation

Complete:

- README
- Installation instructions
- Environment configuration
- Architecture documentation
- Known limitations
- Deployment instructions

---

# 15. MVP ACCEPTANCE CRITERIA

The project is complete when:

[ ] The frontend starts successfully.

[ ] The backend starts successfully.

[ ] The database can be initialized.

[ ] A customer can select their current vehicle.

[ ] A customer can compare up to three TOYOTA models.

[ ] Comparison values show their provenance or demo status.

[ ] The matching wizard produces explainable recommendations.

[ ] Hard constraints are respected.

[ ] TCO calculations update when inputs change.

[ ] A customer can inspect a simulated maintenance appointment.

[ ] The maintenance assistant has a working offline fallback.

[ ] The lounge workflow is navigable.

[ ] The entire customer-facing interface supports zh-TW.

[ ] The layout works on desktop and mobile.

[ ] Automated tests pass.

[ ] The application can run locally using documented commands.

[ ] Docker Compose configuration is provided and validated.

[ ] The README explains the project and its limitations.

---

# 16. WORKING PRINCIPLES

Follow these instructions throughout development:

1. Build working software, not just design documents.

2. Inspect existing files before making changes.

3. Avoid unnecessary dependencies.

4. Use strict TypeScript typing.

5. Keep business logic independent of presentation code.

6. Make recommendation results explainable.

7. Do not invent real-world specifications.

8. Clearly label simulations.

9. Never present unverified vehicle data as official.

10. Prioritize correct functionality over decorative features.

11. Use reusable components.

12. Write tests for critical calculations.

13. Maintain clear documentation.

14. Keep the application executable without external AI APIs.

15. Do not claim tests passed unless they were actually executed.

16. Record all remaining limitations.

---

# 17. FINAL DELIVERABLES

Provide:

1. Fully implemented application source code.

2. Frontend and backend services.

3. Database schema and seed data.

4. Automated tests.

5. Docker Compose configuration.

6. Documentation.

7. Screenshots of implemented pages, if browser automation is available.

8. Working local development instructions.

9. Deployment instructions.

10. A final implementation report.

The final report must include:

- Features completed
- Features partially completed
- Test results
- Known limitations
- Pending integrations
- Recommended next steps

---

# 18. START EXECUTION

Start by inspecting the repository.

Then create a concise implementation plan.

Proceed to implement the MVP in the available environment.

Do not stop at the planning stage.

Make reasonable technical decisions independently.

If external services, credentials, or private TOYOTA data
are unavailable, implement documented local alternatives.

The objective is to deliver an executable,
demonstrable TOYOTA AI DriveMatch application.
