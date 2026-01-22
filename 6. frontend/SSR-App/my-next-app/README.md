
2️⃣ Directory Structure (App Router)

my-next-app/
├─ app/
│  ├─ layout.tsx       # Root layout for all pages
│  ├─ page.tsx         # SSR page (like index)
│  ├─ about/
│  │  └─ page.tsx      # Nested route
│  └─ api/
│     └─ hello/route.ts # API route
├─ public/             # Static assets
├─ styles/
├─ next.config.js


app/layout.tsx wraps all pages.
app/page.tsx replaces pages/index.tsx.
Every page.tsx is server-side rendered by default.


3️⃣ Example Layout

```tsx
// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'My SSR App',
  description: 'Next.js App Router SSR setup',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>My Next.js App</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

4️⃣ Example SSR Page

```tsx
// app/page.tsx
export default async function Home() {
  // Server-side fetch
  const res = await fetch('https://api.example.com/data', { cache: 'no-store' });
  const data = await res.json();

  return (
    <div>
      <h2>Server-Side Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

By default, this runs on the server.
Use { cache: 'no-store' } for SSR on every request, { cache: 'force-cache' } for static caching.

### 5️⃣ API Routes in App Router
```ts
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from API Route' });
}
```

### 7️⃣ Run & Build

npm run dev     # Development SSR
npm run build   # Production build
npm run start   # Run SSR server


8️⃣ Key App Router Features
React Server Components by default → SSR without client bundle.
Streaming SSR → pages render progressively.
Nested layouts → reusable layouts per route.
Colocation of routes and components → simpler structure.
Improved caching → fetch() supports per-request caching control.







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
