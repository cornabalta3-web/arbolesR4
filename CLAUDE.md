# Caja Árboles — contexto para actualizar la app

App de caja del vivero **Árboles · Espacio Botánico** (Córdoba). La usan **Fran** (panchocorna@gmail.com) y **Rocío** (rociocupellino@gmail.com); la mantiene **Balta** (cornabalta3@gmail.com).

- En línea: https://cornabalta3-web.github.io/arbolesR4/ (GitHub Pages desde `main` / root; se republica sola al subir cambios).
- Datos: Firebase, proyecto `arbolesr4-72a22`, Firestore en `southamerica-east1`. Login con Google.

## Cómo pidió Balta que se trabaje
- Tiene que ser **simple y casero**: hoy casi no anotan nada. Cada cambio debe hacer más fácil cobrar, no agregar pasos.
- Balta junta pedidos de Fran y Rocío y los trae juntos, a veces con capturas desde el celu. Responder en castellano rioplatense, corto, con pasos para hacer desde el celu.
- Antes de subir: probar la app con un Firebase simulado (stubs de `firebase-app/auth/firestore` servidos con Playwright) en celu (390px) y compu (1280px), y revisar `node --check` del módulo.
- Commits en castellano. Nunca tocar los datos de Firestore desde el código sin avisar.

## Archivos
- `index.html`: **toda la app** (HTML + CSS + JS módulo). Es la fuente de verdad: editar acá.
- `firebase-config.js`: config pública del proyecto (no es secreta).
- `firestore.rules`: copia de las reglas publicadas. Si se cambia, Balta tiene que pegarla en Firebase → Firestore → Reglas → Publicar.
- `sw.js`: cache para abrir sin señal (red primero). Subir `CACHE` (`caja-arboles-vN`) si cambian archivos cacheados de forma importante.
- `logo.png`, íconos y `manifest.webmanifest`.

## Reglas del negocio (ya implementadas)
- Tipos: **Planta** y **Otro** (de los dos), **Arte botánico** (de Rocío, artesanías con flores prensadas). No se pregunta de quién es la plata al vender.
- Medios: **Efectivo** (queda en la billetera de quien cobró) y **Transferencia / Mercado Pago** (siempre a la cuenta de Fran, alias arbolesr4).
- No hay caja ni cambio. **Cierre del día**: total, efectivo vs transferencia, qué se vendió y por tipo, con "Copiar resumen" para WhatsApp.
- **No mostrar quién le debe a quién** ni saldos entre Fran y Rocío: Balta lo pidió explícitamente porque genera conflicto. La colección `cuentas` quedó en desuso.
- Precios: algunos fijos, otros varían (precio vacío = "Precio a elegir"). Descuentos: "¿Cobraste otro monto?" guarda `lista` y `total`; los montos por línea se reparten en proporción.
- Producto opcional al vender. Piezas únicas de Rocío se marcan `vendida` al venderse.
- Dónde: Local / Instagram-WhatsApp / Feria. Cada dispositivo elige una vez quién cobra (se guarda en `usuarios/{uid}`).
- **Modo revisión (solo Balta, cornabalta3@gmail.com):** tocando el número de versión se abre un panel discreto. Con "Modo prueba" sus ventas se guardan con `prueba: true` y no cuentan en totales, cuentas ni análisis; desde ahí se borran.
- Versión visible abajo a la derecha (`VERSION` en `index.html`): subirla en cada cambio.
- Plantas iniciales cargadas una sola vez (`config/semilla`), todas con precio variable.
- Colores: Turquesa (#1F7A72) sobre blanco cálido; fuentes Jost + Nunito Sans.
- **QR para cobrar:** con Transferencia elegida aparece "Mostrar QR al cliente" (pantalla blanca con monto, `qr.png`, alias y titular). Si falta `qr.png`, muestra solo el alias.
- **Modo oscuro:** botón luna/sol arriba a la derecha; se guarda por dispositivo (`caja.tema`) y por defecto sigue al celu. Todo color va por variables CSS (`--fill`/`--on-fill` para los bloques oscuros); no usar colores fijos nuevos.

## Datos en Firestore
- `dias/{AAAA-MM-DD}`: `{ fecha, ventas: { [id]: { ts, items:[{n,c,p,cat,de,pid?}], lista, total, medio, cobro, donde, nota, anulada?, prueba? } } }`
- `productos/{id}`: `{ n, p|null, cat, de: "Fran"|"Rocío"|"Los dos"|null, unica, vendida, creado }`
- `config/semilla`: marca de que ya se cargaron las plantas iniciales
- `cuentas/{id}`: en desuso (antes guardaba cuando se pasaban la plata)
- `usuarios/{uid}`: `{ nombre: "Fran"|"Rocío", email }`
