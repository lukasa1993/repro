# React Route v7 running on Vite v6 fails to resolve Prisma Client

Install dependencies and set up the database:

```
npm run setup
```

Run the development server:

```
npm run dev
```

You should see an error with React Router failing to resolve `@prisma/client`.

Also happens on build:

```
npm run build
```

This doesn't happen on Vite v5.
