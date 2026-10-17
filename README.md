# Caja Árboles

Caja del vivero **Árboles · Espacio Botánico** para Fran y Rocío: anotar ventas en segundos desde el celu o la compu, ver las cuentas entre los dos, el registro de ventas, el análisis del mes y la lista de precios.

**Dirección de la app:** https://cornabalta3-web.github.io/arbolesr4/

## Cómo se usa (Fran y Rocío)

1. Abrir la dirección de arriba y tocar **Entrar con Google**. Se hace una sola vez en cada celu o compu.
2. La primera vez, elegir **quién está cobrando** en ese celu (Fran o Rocío).
3. Para cobrar: poner el monto, tocar **Planta**, **Arte botánico** u **Otro**, elegir **Efectivo** o **Transferencia** y apretar **Cobrar**.
4. Para tenerla como app: en iPhone, Compartir → *Agregar a inicio*; en Android, menú ⋮ → *Agregar a la pantalla principal*.

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

- `index.html`: toda la app (pantallas, cuentas y análisis).
- `firebase-config.js`: la conexión con el proyecto de Firebase. No es secreta: la seguridad la dan las reglas.
- `firestore.rules`: quién puede entrar (solo los mails de la lista).
- `sw.js`: guarda una copia de la app para que abra sin señal.

Datos en Firestore:

| Colección | Qué guarda |
|---|---|
| `dias/{AAAA-MM-DD}` | Las ventas de cada día: qué, monto, tipo, de quién es la plata, quién cobró, cómo pagó, dónde y nota. |
| `productos/{id}` | La lista de precios. El precio puede quedar vacío si varía. |
| `cuentas/{id}` | Cada vez que Fran y Rocío se pasan la plata. |
| `usuarios/{id}` | Si cada cuenta de Google es de Fran o de Rocío. |

Reglas de las cuentas entre Fran y Rocío: las plantas son de Fran, el arte botánico de Rocío y los otros según el producto. Las transferencias y Mercado Pago van a la cuenta de Fran; el efectivo lo tiene quien cobró.

**Respaldo:** en **Registro → Descargar Excel** se baja todo en un archivo para abrir con Excel o Google Sheets. Conviene hacerlo una vez por mes.
