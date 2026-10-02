# App requirements and designs

_Started 2026-10-01 22:30 UTC_

---

## User

Here in this PRD you have the all the information on what I want and the needs of my app. I willattach some designs so that get some inspo on what I want. La aplicacion debe ser diseñada en español

## Assistant



## Assistant

_[tool: read_skill_prompt]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: ask_user]_

Ya leí el PRD y la inspo. Ahora espero tus respuestas en el formulario: qué flujos hago primero, el formato, si querés variaciones, los nombres y el tono del texto.

## User

Answered — scope: Clienta: reservar (servicio → horario → datos → confirmación), Prestadora: agenda día/semana; format: Un prototipo interactivo con ambos lados (switch clienta/prestadora); variations: Una sola dirección, bien pulida, fiel a la inspo; name: bankap; voice: Rioplatense (vos); photos: Placeholders

## Assistant

_[tool: update_todos]_

_[tool: set_project_title]_

_[tool: dc_write]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

_[tool: update_todos]_

Armé el prototipo de bankap en `Bankap.dc.html`. Tiene un selector arriba para pasar de Clienta a Prestadora. Todavía se está revisando.

- **Clienta (web):** primero elige el servicio, filtrando por categoría. Después elige día y hora en vista de 7 días o del mes. Los horarios aparecen como libres, ocupados o pasados, siguiendo las reglas del PRD: arrancan en punto o y media, ocupan toda la duración del servicio y se descuenta el almuerzo. Luego carga sus datos, con validación, y llega a la confirmación con los botones de calendario y WhatsApp.
- **Prestadora (app):** agenda por día con línea de "ahora", y por semana. Al tocar un turno se abre el detalle con WhatsApp, reprogramar (solo muestra horarios libres) y cancelar con confirmación.
- **Las dos partes están conectadas:** cuando una clienta reserva, a la prestadora le llega una notificación y el turno aparece resaltado en su agenda.

Hay tres opciones que podés activar en el panel de Tweaks:
- elegir con qué lado arranca el prototipo;
- simular que otra clienta toma el horario mientras alguien reserva (el caso RF‑15);
- activar sobreturnos.

Para que el prototipo sea reproducible, "hoy" está fijo en el jueves 1 de octubre a las 10:15. Las pestañas Servicios, Horarios y Perfil están, pero no hacen nada todavía. Las fotos son espacios vacíos para que pongas las tuyas.

