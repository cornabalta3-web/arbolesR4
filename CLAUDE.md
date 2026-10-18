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
- Tipos: **Planta** (plata de Fran), **Arte botánico** (plata de Rocío, artesanías con flores prensadas), **Otro** (se elige de quién es por producto).
- Medios: **Efectivo** (queda en la billetera de quien cobró) y **Transferencia / Mercado Pago** (siempre a la cuenta de Fran, alias arbolesr4).
- No hay caja ni cambio: en lugar de cierre de caja hay **Cuentas** (quién le pasa cuánto a quién desde la última vez que se pasaron la plata).
- Precios: algunos fijos, otros varían (precio vacío = "Precio a elegir"). Descuentos: "¿Cobraste otro monto?" guarda `lista` y `total`; los montos por línea se reparten en proporción.
- Producto opcional al vender. Piezas únicas de Rocío se marcan `vendida` al venderse.
- Dónde: Local / Instagram-WhatsApp / Feria. Cada dispositivo elige una vez quién cobra (se guarda en `usuarios/{uid}`).
- Colores: Turquesa (#1F7A72) sobre blanco cálido; fuentes Jost + Nunito Sans.

## Datos en Firestore
- `dias/{AAAA-MM-DD}`: `{ fecha, ventas: { [id]: { ts, items:[{n,c,p,cat,de,pid?}], lista, total, medio, cobro, donde, nota, anulada? } } }`
- `productos/{id}`: `{ n, p|null, cat, de, unica, vendida, creado }`
- `cuentas/{id}`: `{ ts, monto, de, a, por }`
- `usuarios/{uid}`: `{ nombre: "Fran"|"Rocío", email }`
