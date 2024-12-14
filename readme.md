# Avoiding FOUC in Vite: updating CSS imports

```
npm install
npm run dev
```

If you update the CSS file, the page will update upon file save.

However, if you update the CSS dependency, `ripples.svg`, not only will the page not update,
but the update will not be reflected even after a hard refresh.

This is a development-only issue.

> [!NOTE]
> Vite doesn't offer a recommended path towards implementing CSS for SSR (vitejs/vite#16515).
> Frameworks are solving this problem in different ways, usually by collecting all CSS imports
> and injecting them into the HTML template, but in my app I have a single CSS entry point so I don't need this.
> Considering that HMR already works out of the box when I'm editing my CSS file
> I feel like I'm missing one small piece of the puzzle, so I'd like to try to make my approach work entirely.
