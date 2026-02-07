# TypeScript Configuration for Vercel Deployment

This tsconfig.json is optimized for Vercel's serverless environment while maintaining full type safety.

## Key Settings for Vercel Compatibility:

### Path Aliases
- `@/*` → `./client/src/*` - Client-side components
- `@shared/*` → `./shared/*` - Shared types and schemas

### Module System
- `module: "ESNext"` - Use modern JavaScript modules
- `moduleResolution: "bundler"` - Vercel's recommended resolution strategy

### Compiler Options
- `strict: true` - Full type checking enabled
- `esModuleInterop: true` - Better CommonJS compatibility
- `skipLibCheck: true` - Faster builds on Vercel

## Adding New Path Aliases

If you add new modules, update the `paths` object:

```json
"@utils/*": ["./src/utils/*"],
"@hooks/*": ["./src/hooks/*"]
```

Update both `tsconfig.json` and `vite.config.ts` to keep them in sync.
