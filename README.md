This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# INFO1111 Self-Learning Task 2 – Advanced: PHP and Real-Time Database Integration

This repository documents the self-learning activities undertaken as part of Task 2 (Advanced) for INFO1111, with a focus on enhancing a strata management web application through the integration of PHP and real-time database capabilities on Vercel.

---

## Project Context

The application is designed to support strata-titled apartment buildings, aligning with the requirements of the Strata Schemes Management Act 2015 (NSW). It enables self-managed committees to handle unit owner records, budget management, maintenance tracking, and levy generation.

---

## Objective

The primary aim of this self-learning task was to explore advanced backend integration using PHP (not natively supported on Vercel) and to connect this with a real-time PostgreSQL database for storing strata-related records. Additional goals included:
- Demonstrating cookie-based user session functionality
- Comparing PHP + serverless deployment against other web development options
- Creating practical, context-relevant application features using PHP

---

## Technologies Used

- **Vercel (with custom runtime support for PHP)**
- **PHP 8.1**
- **Neon.tech (PostgreSQL database)**
- **Supabase Client (for frontend interaction)**
- **HTML / CSS / JavaScript**

---

## Features Implemented

### 1. PHP on Vercel (Custom Runtime)
- Implemented a `vercel-php` runtime to allow PHP execution on Vercel.
- Created a `levy.php` endpoint to simulate dynamic generation of levy notices.
- Enabled dynamic routing and server-side processing within a static Vercel deployment.

### 2. Database Connectivity
- Connected the application to a PostgreSQL database hosted on Neon.tech.
- Integrated database queries into at least three application pages:
  - Unit owner dashboard
  - Maintenance request log
  - Financial reports viewer

### 3. Cookies for User Sessions
- Implemented cookies to identify the currently logged-in user across sessions.
- Used this mechanism to personalise page content (e.g., display logged-in unit number).

---

## Technical Demonstration

- PHP code is modular and structured for serverless environments.
- Screenshots and annotated demonstrations are included in the `/evidence` folder.
- `vercel.json` is used to define the custom runtime and route rewrites.

---

## Evaluation of Tool/Technology

### Strengths
- PHP is lightweight, easy to set up, and widely supported.
- Server-side processing on Vercel allows dynamic features in a static-first deployment.
- Integration with PostgreSQL enables robust, scalable data storage.

### Weaknesses
- PHP is not natively supported by Vercel, requiring extra configuration.
- Stateless environments limit persistent session management.
- Debugging PHP on serverless platforms is more complex than traditional servers.

### Usefulness
This approach is ideal for low-cost, quick-deploy admin dashboards where server-side logic is minimal but still required (e.g., levy calculation or form validation).

---

## Comparative Analysis

Compared to using server-side JavaScript (e.g. with Node.js), PHP requires more setup on Vercel but benefits from simplicity and mature ecosystem support. Traditional LAMP stacks provide persistent session storage and native PHP execution but require infrastructure management, unlike Vercel’s serverless model.

---

## Reflection

- This task helped reinforce backend fundamentals while exploring serverless deployment constraints.
- Cookie and session management presented practical challenges that were overcome through reading documentation and testing.
- Future improvements would include structured authentication and use of managed authentication platforms (e.g., Auth0 or Supabase Auth).

---

## Acknowledgements

This self-learning report was completed independently, with all source code and screenshots available in this repository. The features developed contribute directly to the broader strata management application initiated in Task 1.

