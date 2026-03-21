## Plan: Auditoría del sitio AFM

TL;DR - Realizaré una auditoría completa del sitio estático AFM enfocada en: 1) corrección de rutas y activos rotos, 2) accesibilidad (WCAG básica), 3) SEO y metadatos, 4) rendimiento y buenas prácticas (imágenes, carga), y 5) seguridad básica (exposición de claves, admin sin auth). Entrego un informe con hallazgos y parches propuestos/implementados.

### Steps
1. Discovery (completado): inventario de archivos y problemas detectados (rutas, imágenes faltantes, keys en cliente).
2. Fix básico de coherencia de archivos: arreglar rutas/case-sensitivity (`Data` vs `data`, `css/style.css` vs `css/main.css`), actualizar referencias en HTML/JS.
3. Restaurar/normalizar assets: crear `img/` o mover imágenes a ubicaciones referenciadas; añadir `alt`, `width` y `loading="lazy"` donde aplique.
4. Accessibility & HTML fixes: añadir `meta viewport`, `meta description`, vincular `label` con `id` en formularios, añadir `alt` y roles ARIA mínimos.
5. Security & secrets: localizar y eliminar/ocultar claves en `js/api.js` y `Datos.md`; recomendar mover claves a backend/variables. Secure `admin.html` (recomendación o implementación de bloqueo básico si se autoriza).
6. Performance tweaks: optimizar carga de CSS/JS (defer/async si corresponde), asegurar no-blocking render, añadir dimensiones a imágenes. Ejecutar auditorías Lighthouse/local y resumir.
7. SEO & crawlability: añadir OG/Twitter tags, `robots.txt`, `sitemap.xml` (generado a partir de archivos), favicon link.
8. Report & deliverables: producir un informe con hallazgos, lista de cambios aplicados (patches), pruebas (Lighthouse guidance), y pasos recomendados adicionales.

### Relevant files
- `index.html` — entrada principal; falta `viewport`, meta description, y referencia a `css/style.css` incorrecta.
- `gatos.html` — carga `js/gatos.js` y renderiza imágenes sin `alt`.
- `adopcion.html` — formulario con labels no vinculados.
- `admin.html` — interfaz administrativa sin autenticación.
- `css/main.css` — hoja de estilos real; páginas la referencian erróneamente.
- `js/gatos.js` — fetch a `data/gatos.json`; contiene implementaciones duplicadas.
- `js/api.js` — expone `SUPABASE_KEY` en cliente.
- `Data/gatos.json` — datos; path case mismatch con código.

### Verification
1. Manual checks: abrir páginas locales en navegador y verificar que no hay 404 por CSS/JSON/imagenes.
2. Accessibility: run axe o Lighthouse accessibility audits y confirmar fixes para `alt` y associations.
3. Performance: run Lighthouse y confirmar mejoras (lazy loading, dimensiones de imagen).
4. Security: search for secret tokens en el repo y validar redaction.

### Decisions / Assumptions
- Trabajo sobre los archivos en el repo; no hago cambios fuera del workspace ni en servidores.
- No tengo acceso al sitio en producción ni a credenciales de paneles externos (p.ej. Supabase) a menos que las facilites.
- Correcciones que modifiquen comportamiento sensible (p.ej. proteger admin con auth) requerirán tu aprobación y/o credenciales.

### Quick questions
1. ¿Quieres que aplique los parches automáticamente en el repo (`auto`) o prefieres revisar/autorizar cada cambio (`review`)?
2. ¿Tienes la URL pública del sitio o acceso a analytics/Lighthouse para pruebas en producción? (sí/no)
3. ¿Puedo eliminar o redactar las claves encontradas en `js/api.js` y `Datos.md` o prefieres que las reemplace por placeholders y documente el cambio?
4. ¿Prioridad principal: `seguridad`, `accesibilidad`, `SEO`, `rendimiento`? (elige una o varias)

---
Archivo generado automáticamente desde la memoria de sesión por el asistente.
