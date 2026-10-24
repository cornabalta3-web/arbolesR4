# Caja Árboles

Caja y tienda web del vivero **Árboles · Espacio Botánico** (Río Cuarto) para Fran y Rocío: anotar ventas en segundos desde el celu o la compu, el cierre del día, el registro de ventas, el análisis del mes, la lista de precios y una tienda para que los clientes pidan por WhatsApp.

**Caja:** https://cornabalta3-web.github.io/arbolesR4/

**Tienda para clientes:** https://cornabalta3-web.github.io/arbolesR4/tienda/

## Cómo se usa (Fran y Rocío)

1. Abrir la dirección de arriba y tocar **Entrar con Google**. Se hace una sola vez en cada celu o compu.
2. La primera vez, elegir **quién está cobrando** en ese celu (Fran o Rocío).
3. Para cobrar: poner el monto, tocar **Planta**, **Arte botánico** u **Otro**, elegir **Efectivo** o **Transferencia** y apretar **Cobrar**.
4. Para tenerla como app: en iPhone, Compartir → *Agregar a inicio*; en Android, menú ⋮ → *Agregar a la pantalla principal*.

### Tienda web

1. En la caja, **Precios → Tienda web → Datos de la tienda**: cargar el WhatsApp donde llegan los pedidos (y si quieren, Instagram y dónde se retira).
2. En cada producto que quieran mostrar: **Editar → Mostrar en la tienda web**, sacarle una foto y, si quieren, una descripción corta. Guardar.
3. Compartir el link con **Copiar link** (Instagram, estados de WhatsApp).

El cliente arma el pedido, elige retiro o envío en Río Cuarto y se abre WhatsApp con todo escrito. Paga por transferencia al alias cuando le confirman.

Si no hay señal (por ejemplo en una feria), la venta se guarda en el celu y se sube sola cuando vuelve internet. Para eso la app tiene que haberse abierto al menos una vez con conexión en ese celu.

## Puesta en marcha (una sola vez)

### 1. Publicar la página con GitHub Pages

En este repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**. En unos minutos queda en la dirección de arriba.

### 2. Crear la base de datos en Firebase

Conviene crearla con la cuenta de Google de Fran, así los datos quedan a nombre del negocio.

1. Entrar a https://console.firebase.google.com y crear un proyecto, por ejemplo `caja-arboles`. Google Analytics no hace falta.
2. **Authentication → Comenzar → Método de acceso → Google → Habilitar**, elegir el mail de asistencia y guardar.
3. **Authentication → Configuración → Dominios autorizados → Agregar dominio:** `cornabalta3-web.github.io`
4. **Firestore Database → Crear base de datos**, ubicación `southamerica-east1 (São Paulo)`, en **modo de producción**. La ubicación no se puede cambiar después.
5. **Firestore Database → Reglas:** pegar el contenido de `firestore.rules` con los tres mails reales en lugar de los de ejemplo y tocar **Publicar**.
6. **Configuración del proyecto (engranaje) → Tus apps → Web (`</>`)**, nombre `Caja Árboles`, sin Firebase Hosting. Copiar el bloque `firebaseConfig` y pegarlo en `firebase-config.js` de este repo.

### 3. Probar

Entrar con las tres cuentas de la lista, hacer una venta de prueba desde un celu, ver que aparece en el otro y anularla desde **Registro**.

## Cómo está armada

- `index.html`: toda la caja (pantallas, cierre y análisis).
- `firebase-config.js`: la conexión con el proyecto de Firebase. No es secreta: la seguridad la dan las reglas.
- `firestore.rules`: quién puede entrar (solo los mails de la lista) y qué puede leer la tienda.
- `tienda/index.html`: la tienda para clientes.
- `sw.js`: guarda una copia de la app para que abra sin señal.

Datos en Firestore:

| Colección | Qué guarda |
|---|---|
| `dias/{AAAA-MM-DD}` | Las ventas de cada día: qué, monto, tipo, de quién es la plata, quién cobró, cómo pagó, dónde y nota. |
| `productos/{id}` | La lista de precios. El precio puede quedar vacío si varía. `web` marca lo que se muestra en la tienda. |
| `fotos/{id}` | La foto de cada producto para la tienda. |
| `config/tienda` | WhatsApp, Instagram y dónde se retira. |
| `cuentas/{id}` | En desuso. |
| `usuarios/{id}` | Si cada cuenta de Google es de Fran o de Rocío. |

Las plantas y los otros son de los dos, el arte botánico es de Rocío. Las transferencias y Mercado Pago van a la cuenta de Fran; el efectivo lo tiene quien cobró.

## Cómo se actualiza

1. Fran o Rocío avisan qué falla o qué quieren cambiar, mejor con una captura.
2. Balta lo pide en el mismo chat de Claude donde se armó la app, o en uno nuevo diciendo "Caja Árboles, repo arbolesR4". El archivo `CLAUDE.md` tiene todo el contexto.
3. El cambio se sube a este repo y la página se actualiza sola en 1 o 2 minutos. Para verlo, alcanza con cerrar y abrir la app.

Actualizar la app **no toca los datos**: ventas, precios y cuentas siguen en Firebase.

Cosas que se hacen sin tocar el código:
- **Sumar o sacar a alguien:** Firebase → Firestore → Reglas → editar la lista de mails → Publicar.
- **Ver un dato puntual:** Firebase → Firestore → Datos. Para borrar una venta, mejor usar **Anular** en la app.

**Respaldo:** en **Registro → Descargar Excel** se baja todo en un archivo para abrir con Excel o Google Sheets. Conviene hacerlo una vez por mes.
