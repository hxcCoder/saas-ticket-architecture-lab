1️⃣ Propósito del Dominio

El dominio define las reglas del negocio, no la tecnología.

Este dominio existe para:

- representar procesos empresariales,

- controlar su ejecución,

- garantizar trazabilidad,

- permitir auditoría confiable.

👉 Nada importante ocurre fuera del dominio.

2️⃣ Entidades del Dominio (CORE)
1. Organización

Representa a una empresa (tenant).

Responsabilidad:

- agrupar usuarios, procesos y ejecuciones

- definir límites del plan

- habilitar o bloquear operaciones

Estados:

- activa

- suspendida

2. Usuario

Persona que interactúa con el sistema.

Responsabilidad:

- ejecutar acciones

- operar dentro de una organización

Estados:

- activo

- deshabilitado

3. Rol

- Define capacidades dentro de una organización.

Ejemplos:

- admin

- operador

- auditor

👉 Un usuario actúa siempre a través de un rol.

4. Proceso

Definición estructurada de una operación empresarial.

Responsabilidad:

- definir qué se ejecuta

- en qué orden

- bajo qué reglas

Estados:

- borrador

- activo

- pausado

- archivado

5. Paso

Unidad mínima dentro de un proceso.

Responsabilidad:

- representar una acción o validación

- mantener orden y dependencia

- Un paso no se ejecuta solo, siempre dentro de un proceso.

6. Ejecución

Instancia concreta de un proceso en tiempo real.

Responsabilidad:

- representar una corrida real

- registrar resultado

- controlar estados

Estados:

- pendiente

- en_progreso

- completada

- fallida

7. Evento

Registro técnico de algo que ocurrió durante una ejecución.

Responsabilidad:

- documentar hechos

- alimentar auditoría

- permitir análisis posterior

8. Auditoría

Registro formal e inmutable de acciones relevantes.

Responsabilidad:

- responder quién, qué, cuándo, resultado

- cumplir trazabilidad

👉 Toda acción importante genera auditoría.

9. Suscripción

Define el contrato comercial de una organización.

Estados:

- trial

- activa

- vencida

- cancelada

10. Plan

Define límites y capacidades.

Ejemplos:

- cantidad de procesos activos

- ejecuciones mensuales

- retención de auditoría

3️⃣ Relaciones clave (conceptuales)

1- Una Organización tiene muchos Usuarios

2- Un Usuario pertenece a una Organización

3- Un Usuario tiene un Rol

4- Una Organización tiene muchos Procesos

5- Un Proceso tiene muchos Pasos

6- Un Proceso genera Ejecuciones

7- Una Ejecución genera Eventos

8- Eventos alimentan Auditoría

9- Una Organización tiene una Suscripción

10- La Suscripción referencia un Plan

👉 Estas relaciones no son tablas aún, son lógica del negocio.

4️⃣ Reglas de Negocio (NO NEGOCIABLES)
Reglas de Organización

-  organización suspendida no puede ejecutar procesos

- Ningún usuario puede operar fuera de su organización

- Reglas de Usuario y Rol

- Un usuario deshabilitado no puede ejecutar acciones

- Toda acción requiere un rol válido

- Roles definen permisos explícitos

- Reglas de Proceso

- Un proceso en borrador no puede ejecutarse

- Un proceso pausado no puede generar ejecuciones

- Un proceso archivado es inmutable

Reglas de Ejecución

- Una ejecución solo puede iniciarse desde un proceso activo

- Una ejecución fallida no puede marcarse como completada

- Toda ejecución termina en estado final

Reglas de Auditoría

- Toda acción relevante genera auditoría

- La auditoría es inmutable

- No existe acción sin responsable

- Reglas de Suscripción

- Una suscripción vencida bloquea ejecuciones

- El plan limita procesos activos y ejecuciones

- Cambios de plan no alteran ejecuciones pasadas

5️⃣ Estados y Transiciones (CONTROL EXPLÍCITO)

Ejemplo — Proceso:

borrador → activo

activo → pausado

pausado → activo

activo → archivado

❌ No existen transiciones implícitas.

Ejemplo — Ejecución:

pendiente → en_progreso

en_progreso → completada

en_progreso → fallida

6️⃣ Eventos del Dominio (importante)

Ejemplos:

- ProcesoActivado

- EjecucionIniciada

- EjecucionFallida

- SuscripcionVencida

- UsuarioSuspendido

👉 Los eventos no ejecutan lógica, informan hechos.

7️⃣ Límites del Dominio

El dominio:

- NO conoce base de datos

- NO conoce frameworks

- NO envía emails

- NO maneja HTTP

- NO sabe de Prisma

El dominio:

- valida reglas

- controla estados

- protege consistencia

8️⃣ Frase guía del dominio

“Si una regla puede romperse desde un controller, el dominio está mal diseñado.”