# SEO — pasos manuales

Lo que el código ya no puede hacer por sí solo. En orden.

## 1. Refrescar la caché social de `thumbnail.png`

La imagen ya está en `public/thumbnail.png` (1734 × 907, ratio 1.91:1) y `og:image` /
`twitter:image` apuntan a ella con URL absoluta. No hay nada que subir.

Lo único pendiente es forzar el refresco de caché **después de desplegar**, porque las
plataformas cachearon el 404 anterior durante días:

- https://www.linkedin.com/post-inspector/ → pegar `https://mllagostera.com` → *Inspect*
  (esto además invalida su caché).
- https://cards-dev.twitter.com/validator para X.
- WhatsApp/Telegram cachean por su cuenta; se refrescan solos en 24-48 h.

## 2. Verificar la propiedad en Google Search Console

El token ya está cableado: si la variable existe, se renderiza
`<meta name="google-site-verification">`; si no, no se renderiza nada.

- En AWS Amplify → *Hosting* → *Environment variables*, añadir
  `NUXT_PUBLIC_GSC_TOKEN` con el token que da Search Console.
  (De momento funciona el `GG_SEARCH_CONSOLE` que ya está en `.env`, que se usa como valor por
  defecto en build; `NUXT_PUBLIC_GSC_TOKEN` tiene prioridad y es la vía recomendada.)
- Redesplegar y comprobar que el meta aparece en el HTML servido:
  `curl -s https://mllagostera.com | grep google-site-verification`
- En https://search.google.com/search-console → *Añadir propiedad* → **Prefijo de URL** →
  `https://mllagostera.com` → método **Etiqueta HTML** → *Verificar*.

## 3. Enviar el sitemap

- Search Console → *Sitemaps* → introducir `sitemap.xml` → *Enviar*.
- Verificar antes que responde bien: `curl -s https://mllagostera.com/sitemap.xml`
  (debe devolver XML con `content-type: application/xml`).
- `robots.txt` ya apunta al sitemap: `curl -s https://mllagostera.com/robots.txt`

## 4. Solicitar indexación

- Search Console → *Inspección de URLs* → pegar `https://mllagostera.com/` →
  *Solicitar indexación*.
- Repetir para cada ruta nueva cuando se haga la migración a rutas reales
  (`/experiencia`, `/proyectos`, `/contacto`).

## 5. Comprobar los datos estructurados

- https://validator.schema.org/ y
  https://search.google.com/test/rich-results con la URL de producción.
- Debe detectar un `ProfilePage` con un `Person` dentro, y los cuatro perfiles de `sameAs`
  (LinkedIn, GitHub, X, StackShare).

## 6. Higiene pendiente (no es SEO, pero conviene)

- **`.env` está commiteado en git** (`.gitignore` tiene la línea `# .env` comentada). El token de
  Search Console es público por diseño, así que no hay filtración real, pero el fichero no debería
  estar versionado: descomentar `.env` en `.gitignore` y hacer `git rm --cached .env`.
- La bandera del idioma inglés en los tres locales es `flag:sh-4x3` (Santa Elena). Probablemente
  debería ser `flag:gb-4x3`.

## 7. Después de desplegar, comprobación rápida

```sh
curl -s https://mllagostera.com/robots.txt
curl -s https://mllagostera.com/sitemap.xml
curl -s https://mllagostera.com | grep -o '<title>[^<]*</title>'
curl -s https://mllagostera.com | grep -c 'application/ld+json'
curl -s https://mllagostera.com | grep -c 'github-collaborations'   # 1 = la sección se sirve en HTML
```
