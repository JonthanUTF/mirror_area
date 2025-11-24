
# Web Front-end Benchmark
## Benchmark Objective

Select the optimal front-end stack for building the Web Client that stick with:

- Interacts with the Application Server via REST Api
- Manages OAuth2 identification flows
- Delivers accessibility, maintainability, and scalability
- Runs inside Docker

This benchmark will compare the most relevant front-end stacks for this project.

## Front-End Requirements Summary
Functional requirements:

- User registration & login (password + OAuth2)
- AREA creation UI (Action → REAction linking)
- Display available services
- Trigger REST calls to server

Non-functional requirements:

- Accessibility (WCAG compliance)
- Easy integration with OAuth2 flows
- Separation from business logic
- Fast development with low risk of technical issues
- Good documentation
- High ecosystem maturity
- Compatibility with Docker

## Simple benchark table
| Stack            | Maturity | Performance | Learning Curve | OAuth2 Support | Notes                  |
| ---------------- | -------- | ----------- | -------------- | -------------- | ---------------------- |
| **React + Vite** | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐        | ⭐⭐⭐            | Excellent      | Most popular           |
| **Vue 3 + Vite** | ⭐⭐⭐⭐     | ⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐          | Excellent      | Easier for beginners   |
| **Angular 17**   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐         | ⭐              | Excellent      | Enterprise-level       |
| **SvelteKit**    | ⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐       | ⭐⭐⭐            | Good           | Very fast, less common |

## Detailed benchmark
### 1. React + Vite
**Pros:**

- Largest ecosystem and community
- Thousands of integrations (OAuth2, forms, routing…)
- Perfect for modular UI-driven projects
- Vite offers extremely fast dev environment
- Easy to dockerize
- Plenty of UI libraries (MUI, Tailwind, Chakra…)
- Perfect for beginners or mixed-experience groups
- Native TypeScript support

**Cons:**

- Not a full framework, requires assembling libraries
- Routing and architecture conventions depend on the team

**Fit for this project:**

Excellent. Entire project matches React's SPA patterns:

- Simple REST calls
- Dynamic forms for user/service/AREA creation
- OAuth2 workflows
- Component-driven UI
- Fast iteration

**Docker Image Size:**
About 40-60 MB


### 2. Vue 3 + Vite
**Pros:**

- Easiest to learn (excellent documentation)
- Reactive template syntax feels natural
- Extremely fast with Vite
- Very clean state management (Pinia)
- Great for small-to-medium projects

**Cons:**

- Ecosystem smaller than React
- Fewer enterprise-grade components
- Some OAuth2 integrations require manual tuning

**Fit for this project:**
Perfect if the team prefers simplicity and developer experience.

**Docker Image Size:**
About 35-55 MB


### 3. Angular 7
**Pros:**

- Complete all-in-one framework
- Enforces architecture → great for large teams
- Built-in TypeScript & Dependency Injection
- Official form handling and HTTP modules
- Great for large enterprise projects

**Cons:**

- Very steep learning curve
- Heavy framework (bundle size + initial dev cost)
- Overkill for a UI-only app with no business logic

**Fit for this project:**

Medium, too complex for this project.

**Docker Image Size:**

About 80-120 MB