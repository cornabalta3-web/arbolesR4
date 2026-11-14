# Caja Árboles — contexto para actualizar la app

App de caja y tienda web del vivero **Árboles · Espacio Botánico** (Río Cuarto, Córdoba). La usan **Fran** (panchocorna@gmail.com) y **Rocío** (rociocupellino@gmail.com); la mantiene **Balta** (cornabalta3@gmail.com).

- Caja: https://cornabalta3-web.github.io/arbolesR4/ (GitHub Pages desde `main` / root; se republica sola al subir cambios).
- Tienda para clientes: https://cornabalta3-web.github.io/arbolesR4/tienda/ (sin login).
- Datos: Firebase, proyecto `arbolesr4-72a22`, Firestore en `southamerica-east1`. Login con Google.

## Cómo pidió Balta que se trabaje
- Tiene que ser **simple y casero**: hoy casi no anotan nada. Cada cambio debe hacer más fácil cobrar, no agregar pasos.
- Balta junta pedidos de Fran y Rocío y los trae juntos, a veces con capturas desde el celu. Responder en castellano rioplatense, corto, con pasos para hacer desde el celu.
- Antes de subir: probar la app con un Firebase simulado (stubs de `firebase-app/auth/firestore` servidos con Playwright) en celu (390px) y compu (1280px), y revisar `node --check` del módulo.
- Commits en castellano. Nunca tocar los datos de Firestore desde el código sin avisar.

## Archivos
- `index.html`: **toda la caja** (HTML + CSS + JS módulo). Es la fuente de verdad: editar acá.
- `tienda/index.html`: **toda la tienda web** (catálogo + pedido por WhatsApp). Usa `../firebase-config.js` y `../logo.png`. Sin service worker propio.
- `og.png`: imagen que se ve al compartir el link de la tienda.
- `firebase-config.js`: config pública del proyecto (no es secreta).
- `firestore.rules`: copia de las reglas publicadas. La tienda (sin login) solo lee productos con `web == true`, sus fotos y `config/tienda`; nadie de afuera escribe. Si se cambia, Balta tiene que pegarla en Firebase → Firestore → Reglas → Publicar.
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
- **Tienda web** (estilo "Vivero", elegido por Balta entre 4 opciones): bloque turquesa arriba con accesos a cada sección; Plantas y Otros en lista con foto chica y botón "+" redondo; Arte botánico en su propia sección color durazno ("hechas a mano por Rocío"), en tarjetas. Catálogo con los productos marcados "Mostrar en la tienda web" en Precios (se ocultan las piezas únicas vendidas). Carrito → abre WhatsApp con el pedido escrito (productos, total, retiro en el local o envío en Río Cuarto con dirección, nombre, nota). Pago por transferencia al alias arbolesr4 (Francisco Corna) cuando confirman. Precio vacío = "Consultar precio". El envío se coordina por WhatsApp (no hay costo cargado). No se guardan pedidos en Firestore.
- **Pasar productos a la tienda (v1.8):** en Precios → Tienda web, botón "Poner los N productos que faltan en la tienda" (con confirmación) marca `web: true` a todos los que están en venta. Los productos nuevos vienen con "Mostrar en la tienda web" tildado. Cada fila de la lista tiene un botón de cámara para sacar la foto directo (también deja el producto en la web) y el filtro "Sin foto" sirve para ir completándolas.
- **Fotos:** se suben desde Precios (editar producto o al agregarlo, con "Mostrar en la tienda web" marcado); se achican en el celu a 800 px JPEG y se guardan en `fotos/{id}` (sin Firebase Storage, para no pasar a plan pago).
- **Datos de la tienda** (Precios → Tienda web → Datos de la tienda): WhatsApp donde llegan los pedidos (se guarda como 549 + característica + número), Instagram y dónde/cuándo se retira. Los pueden cambiar Fran o Rocío.
- **Promo** (Precios → Promo): % off en todo o en un tipo, hasta un día (por defecto el domingo). Se guarda en `config/tienda.promo` y la ven en vivo los dos celus y la tienda. En Vender se aplica sola (los botones muestran el precio con descuento, línea "Promo… · No aplicar" debajo del total); la venta guarda `lista` (precio normal), `total` (con descuento) y `promo: pct`. Se termina sola al pasar la fecha o con "Terminar promo ahora". En la tienda: cartel arriba, precio tachado y "−20%" en la foto.
- **Modo oscuro:** botón luna/sol arriba a la derecha; se guarda por dispositivo (`caja.tema`) y por defecto sigue al celu. Todo color va por variables CSS (`--fill`/`--on-fill` para los bloques oscuros); no usar colores fijos nuevos.

## Datos en Firestore
- `dias/{AAAA-MM-DD}`: `{ fecha, ventas: { [id]: { ts, items:[{n,c,p,cat,de,pid?}], lista, total, medio, cobro, donde, nota, anulada?, prueba?, promo? } } }`
- `productos/{id}`: `{ n, p|null, cat, de: "Fran"|"Rocío"|"Los dos"|null, unica, vendida, creado, web?, d?, foto?: ts|null }` (`d` = descripción para la web)
- `fotos/{id}`: `{ img: dataURL JPEG, ts }` (mismo id que el producto)
- `config/tienda`: `{ whatsapp: "549..."|null, instagram|null, retiro|null, promo?: { pct, cats: "todos"|"Planta"|"Arte"|"Otro", hasta: "AAAA-MM-DD", desde }|null }`
- `config/semilla`: marca de que ya se cargaron las plantas iniciales
- `cuentas/{id}`: en desuso (antes guardaba cuando se pasaban la plata)
- `usuarios/{uid}`: `{ nombre: "Fran"|"Rocío", email }`

## Pendientes (al 14/11/2026)
- **Dominio propio `arbolesr4.com.ar`:** estaba disponible en NIC Argentina; Balta lo estaba registrando a nombre de Fran (CUIT de Fran, clave fiscal). Preguntar si ya quedó pago y acreditado. Plan acordado, en este orden:
  1. Cloudflare gratis: agregar el dominio, plan Free; poner sus dos servidores de nombres en NIC → Delegar.
  2. En Cloudflare → DNS, con la nube gris ("Solo DNS"): cuatro registros A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, y CNAME `www` → `cornabalta3-web.github.io`.
  3. GitHub → repo → Settings → Pages → Custom domain `arbolesr4.com.ar` → Save, y después "Enforce HTTPS".
  4. Firebase → Authentication → Configuración → Dominios autorizados → agregar `arbolesr4.com.ar` (si no, el login de la caja falla).
  5. Recién ahí reorganizar el repo: la **tienda pasa a la raíz** (`arbolesr4.com.ar`) y la **caja a `/caja/`** (ajustar rutas relativas, manifest, `sw.js` y su alcance, `og:url`/`og:image`). Mostrar un botón "Ir a la caja" en la tienda solo si ese navegador ya usó la caja (`caja.yo` en localStorage), nunca a clientes.
  6. Avisar que Fran y Ro tienen que entrar con Google una vez más en la caja nueva y volver a agregarla a la pantalla de inicio (cambia el origen: se pierden la sesión y el localStorage, no los datos de Firebase). El link viejo de github.io redirige solo.
- **Reglas de Firestore:** confirmar con Balta que publicó las de `firestore.rules` (sin eso la tienda dice "No se pudo cargar").
- **`qr.png`:** falta la foto del QR fijo de Mercado Pago (Kit QR) para "Mostrar QR al cliente".
- **Productos en la tienda:** tocar una vez "Poner los N productos que faltan en la tienda" (v1.8), ir sacando fotos con la cámara de cada fila (filtro "Sin foto") y cargar el WhatsApp en Datos de la tienda.
- Tiendanube quedó descartado por ahora (duplicaría la carga de productos); se habló como opción solo si algún día quieren cobro con tarjeta online.
