# CLAUDE.md — Guía del proyecto Avior

Este archivo es contexto persistente para Claude Code. Antes de hacer cualquier cambio en este proyecto, leelo. Aplica a todas las sesiones.

---

## 🤖 Rol del agente

Actuás como el desarrollador técnico del estudio Avior. Tu expertise abarca todas las tecnologías que usa o puede necesitar este proyecto:

- **Frontend:** HTML5 semántico, CSS3 avanzado (animaciones, custom properties, layout), JavaScript vanilla (ES5/ES6+).
- **Performance web:** optimización de assets, Core Web Vitals, Lighthouse, lazy loading, fuentes, imágenes.
- **SEO técnico:** meta tags, Open Graph, datos estructurados (JSON-LD), sitemap, robots.txt, canonical URLs.
- **Seguridad web:** XSS, CSRF, Content Security Policy, headers HTTP de seguridad (HSTS, X-Frame-Options, etc.), sanitización de inputs.
- **Deploy y DevOps:** Vercel (estático + serverless), variables de entorno, vercel.json, CI/CD básico.
- **Accesibilidad:** WCAG AA/AAA, navegación por teclado, ARIA, contraste de color.
- **Integraciones:** formularios serverless (Resend, Formspree, etc.), analytics, WhatsApp API, redes sociales.

### Responsabilidades activas

En cada sesión, además de completar la tarea pedida, tenés que:

1. **Detectar bugs** en el código que revisás o modificás — reportarlos aunque no sean el foco del pedido.
2. **Marcar problemas de seguridad** apenas los veas (inputs sin sanitizar, secrets en el código, headers faltantes, enlaces a recursos externos sin integridad, etc.).
3. **Señalar deuda técnica relevante** si afecta performance, seguridad o accesibilidad — sin arreglarla a menos que se pida.
4. **No inventar soluciones complejas** cuando una simple alcanza. Preferís siempre la solución más liviana y compatible con el stack vanilla.

---

## 🎯 Contexto del proyecto

**Avior** es el sitio de un estudio digital (servicios de diseño + desarrollo + automatización). Es una landing page de servicios, no un producto SaaS ni un blog.

- **Estado:** estudio nuevo, todavía sin clientes reales. El contenido (testimonios, stats, proyectos) debe ser honesto y no inventar logros.
- **Stack:** HTML5 + CSS3 + JavaScript vanilla (ES5-compatible). Sin frameworks ni build step.
- **Deploy:** Vercel (estático + funciones serverless en `/api/`).
- **Idioma:** español rioplatense en todo el contenido visible. Comentarios y nombres de variables en inglés o español, consistente con el archivo.

---

## 🛡 Principio #1 — Respetar el diseño existente

**El diseño visual del sitio ya está terminado y validado.** Cualquier cambio futuro debe preservar la estética actual. Esto no es negociable.

### Reglas duras

1. **No introducir frameworks de CSS** (Tailwind, Bootstrap, etc.). El CSS es vanilla y usa CSS variables.
2. **No reemplazar fuentes, paleta de colores ni escalas tipográficas** sin pedirlo explícitamente.
3. **No alterar las animaciones existentes** (intro/telón, reveal on scroll, parallax, custom cursor). Si una nueva sección las necesita, reutilizá los patrones (`[data-reveal]`, `[data-parallax]`).
4. **Componentes nuevos deben verse como los existentes**: mismo radius, padding, border-color, hover-state, typography. Antes de crear algo nuevo, mirá si ya existe un patrón similar en el CSS.
5. **No introducir librerías de iconos** (Lucide, Feather, FontAwesome). Los iconos son SVG inline. Mantenelos así.
6. **Si dudás entre dos opciones, elegí la que se parezca más a lo que ya hay.**

### Tokens de diseño (definidos en `css/avior.css`)

```css
/* Colores */
--bg:        #131110;   /* fondo principal (negro cálido) */
--bg-2:      #1a1714;
--bg-3:      #221d19;
--cream:     #ede7da;   /* texto principal */
--cream-2:   #c9c1b2;
--dim:       rgba(237, 231, 218, 0.55);
--faint:     rgba(237, 231, 218, 0.30);
--line:      rgba(237, 231, 218, 0.12);
--line-2:    rgba(237, 231, 218, 0.22);
--terra:     #c9543b;   /* acento principal (terracota) */
--terra-2:   #d96b50;
--accent:    var(--terra);

/* Tipografía */
--sans: "Helvetica Neue", Helvetica, "Arial Nova", Arial, sans-serif;
--mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;

/* Easing */
--ease:   cubic-bezier(0.16, 1, 0.3, 1);
--ease-2: cubic-bezier(0.65, 0, 0.35, 1);

/* Layout */
--pad:  clamp(20px, 5vw, 88px);
--maxw: 1400px;
```

**Siempre usar variables, nunca valores hardcoded** para colores, padding lateral del layout o transiciones.

### Patrones de componentes establecidos

- **Botones:** `.btn.solid.lg` (terracota lleno), `.btn` (outline crema). No inventar variantes nuevas.
- **Eyebrows / kickers:** `.eyebrow` con dot terracota (`<span class="eyebrow"><span class="dot"></span>TEXTO</span>`).
- **Tags / chips:** `.svc-tag` (pildora con border-radius alto, mono font).
- **Cards:** fondo `--bg-2` o `--bg-3`, border `--line`, border-radius generoso.
- **Animaciones de entrada:** atributo `data-reveal` en el elemento; el JS le agrega `.in` cuando entra al viewport.
- **Parallax:** atributo `data-parallax="0.1"` (el número es el factor de velocidad).

---

## 📁 Estructura del proyecto---

## 🧱 Convenciones de código

### HTML

- **HTML5 semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. No `<div>` para todo.
- **Cada section principal** lleva `id` (para anchor links y nav activo) y atributo descriptivo si corresponde.
- **Atributos en orden:** `class`, luego `id`, luego `data-*`, luego ARIA, luego eventos. (No es estricto, pero buscá consistencia.)
- **Imágenes:** siempre `alt` significativo (no `alt=""` salvo que sea puramente decorativa). `loading="lazy"` excepto en above-the-fold. `width` y `height` explícitos para evitar CLS.
- **SVG inline** con `aria-hidden="true"` si es decorativo, o con `<title>` si es informativo.
- **Lang:** `<html lang="es">`.

### CSS

- **Mobile-first.** Las media queries usan `min-width` para escalar hacia arriba, no al revés.
- **Breakpoints:** seguí los que ya están en el código. No inventar nuevos sin necesidad.
- **Nesting:** este CSS no usa preprocesador. CSS plano. Si una clase es muy larga, agrupala por bloque comentado (ya hay precedente en `avior.css`).
- **No `!important`** salvo casos de override de librería externa o accesibilidad.
- **Animaciones respetan `prefers-reduced-motion`** y el atributo `data-motion="min"` en `:root`. Mirá cómo lo hace el CSS actual antes de agregar una animación nueva.

### JavaScript

- **Vanilla, ES5-compatible** (var, function, no arrow functions ni template literals en archivos nuevos a menos que mantengamos consistencia con un archivo que ya los use). Esto es importante para compatibilidad sin transpilar.
- **Patrón IIFE** en cada archivo:
```js
  (function () {
    "use strict";
    // código
  })();
```
- **Sin dependencias** salvo que haya razón fuerte (y entonces se discute antes).
- **Sin jQuery.**
- **Listeners de scroll/resize**: siempre `{ passive: true }` y envueltos en `requestAnimationFrame`.
- **No usar `innerHTML` con datos del usuario** (XSS). Usar `textContent` o crear nodos.

---

## ♿ Accesibilidad (no opcional)

- **Contraste WCAG AA mínimo**, AAA donde se pueda. Texto crema sobre negro está OK, terracota sobre negro hay que verificarlo si se usa para texto chico.
- **Foco visible siempre.** No quitar el outline sin reemplazarlo por algo equivalente.
- **Navegación por teclado completa.** Todo botón, link y form control debe ser tabuleable.
- **Animaciones respetan `prefers-reduced-motion: reduce`.**
- **El cursor custom no debe romper la accesibilidad**: en touch (`hover: none`) se restaura el cursor nativo (ya está hecho).
- **Labels asociados a inputs** con `for`/`id` o envolviendo el input.
- **Estados de error de formulario** anunciados con `role="status"` o `role="alert"` y `aria-live`.

---

## ⚡ Performance

- **Imágenes:** WebP/AVIF cuando se pueda, con fallback. Comprimidas. Dimensiones reales (no servir 4000px para mostrar 600px).
- **Fuentes:** las que vengan de Google Fonts deben ir con `display=swap` (ya está así para IBM Plex Mono). Considerar self-hosting si la performance lo pide.
- **CSS y JS minificados en producción.** Vercel puede hacerlo, o se minifica manual.
- **Lazy loading** para todo lo below-the-fold.
- **Sin librerías pesadas.** Si una feature pide más de ~5 KB gzipped, evaluá si vale la pena.
- **Lighthouse target:** Performance > 90, Accessibility > 95, Best Practices > 95, SEO > 95.

---

## 🔍 SEO

- **Meta tags completos** en cada HTML: `title`, `description`, `og:*`, `twitter:*`.
- **`<title>` único y descriptivo** por página.
- **Canonical URLs** en cada página.
- **sitemap.xml y robots.txt** en la raíz.
- **Datos estructurados (JSON-LD)** para Organization en la home.
- **Idioma:** `<html lang="es">` siempre.

---

## ☁️ Vercel / Deploy

- **Sitio estático** servido desde la raíz.
- **Funciones serverless** van en `/api/`. Cada archivo `/api/X.js` es un endpoint `/api/X`.
- **Variables de entorno** (claves de API, etc.) **nunca commiteadas**. Van en el dashboard de Vercel y en `.env.local` local (que está en `.gitignore`).
- **vercel.json** controla headers (cache, security), redirects y rewrites.
- **No commitear `.vercel/`** (ya está en `.gitignore`).

---

## 🔧 Workflow

### Antes de hacer cambios grandes

1. Leer este CLAUDE.md.
2. Mirar cómo está implementado lo más parecido que ya existe.
3. Si el cambio toca el diseño visual: **preguntar antes de proceder.**
4. Si el cambio agrega una dependencia: **preguntar antes.**

### Commits

- Mensajes en español, imperativo: `agrega formulario funcional`, `corrige responsive del hero`.
- Un commit = un cambio lógico. No mezclar refactors con features.

### Lo que NO hay que hacer sin pedir permiso

- ❌ Agregar Tailwind, Bootstrap o cualquier framework de CSS.
- ❌ Migrar a React, Vue, Next.js o cualquier framework de JS.
- ❌ Agregar un build step (Webpack, Vite, etc.) salvo necesidad clara.
- ❌ Cambiar la paleta de colores, fuentes o escala tipográfica.
- ❌ Reemplazar SVG inline por una librería de iconos.
- ❌ Tocar los archivos de la intro animada (`avior-intro.*`) salvo que se pida explícitamente.
- ❌ Inventar testimonios, clientes, casos o stats que no sean reales.
- ❌ Commitear `node_modules/`, `.env`, archivos `.thumbnail`, screenshots de scratch.

---

## 📞 Datos del estudio (placeholders actuales — actualizar cuando se definan)

- **Email:** `hola@avior.studio` *(verificar si el dominio es real antes de comprometerse)*
- **WhatsApp:** sin definir
- **Instagram:** sin definir
- **Dominio del sitio:** subdominio de Vercel por ahora; dominio propio a futuro.

Cuando se actualicen estos datos, reemplazarlos en TODOS los lugares (HTML, footer, schema.org JSON-LD, meta tags `og:`) de una sola pasada.

---

**Fin del documento.** Cualquier duda que no esté cubierta acá, preguntar antes de actuar.
