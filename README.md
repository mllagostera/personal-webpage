# mllagostera.com

Miquel Llagostera's personal site: a CV and portfolio for a DevOps engineer, presented as a CI pipeline in a terminal. It is live at **https://mllagostera.com**, in Spanish, Catalan and English.

The site is also a sandbox for trying out current web tooling and AI-assisted development. Most of its changes are made together with coding agents, and dependency upgrades are applied as soon as they are verified.

## Stack

- **Nuxt 4 with server-side rendering**, deployed to AWS Amplify compute (Node 24).
- **Tailwind CSS 4** for styling, with Headless UI and `@nuxt/icon` for components and icons.
- **`@nuxtjs/i18n`** for the three languages. All CV content lives in the locale files, not in the components.
- **Nitro server routes** for the parts that need a backend:
  - the contact form, delivered to Telegram, with a honeypot, a timing check and rate limiting;
  - public GitHub repositories, cached for an hour;
  - a generated sitemap;
  - `/api/health`, which reports the deployed commit.

## Running it

Requires Node 24 or later and npm 10 or later; CI and Amplify use npm 11.8.0, which the lockfile is generated with.

```sh
npm ci
npm run dev        # development server
npm run build      # production build into .amplify-hosting/
npm run lint
```

The contact form needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the environment; without them a submission fails with a server error, and the rest of the site works normally.

## Contributing

[`AGENTS.md`](AGENTS.md) describes how the code is organised and the rules for changing it: language, branch naming, commit style, how to verify a change, and the architectural constraints. It is written for coding agents and people alike.

## License

[MIT](LICENSE)
