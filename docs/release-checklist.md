# Release checklist

1. Update `package.json` repository URL.
2. Run `npm run lint`.
3. Test on NodeBB 4.10.x with Harmony theme.
4. Push to GitHub.
5. Install with `npm install <github-url>`.
6. Run `./nodebb build && ./nodebb restart`.
