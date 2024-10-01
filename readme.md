# Repro: Vite Environment API data loss

```
npm run dev
```

Update SSR files like `src/data.ts` and `src/entry-server.tsx`, even `src/root.tsx`. The data value in the `Data` class is being lost.
