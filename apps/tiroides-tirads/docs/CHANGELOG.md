# Changelog

## v1.1.0

- La app se traslada a `apps/tiroides-tirads/` dentro de la nueva estructura de portal multi-app del repositorio. Sin cambios funcionales.
- Añadido enlace "← Portal de herramientas" en la cabecera.

## v1.0.0

- Reestructuración del proyecto en archivos independientes (`index.html`, `css/style.css`, `js/app.js`) para publicación en GitHub Pages.
- Eliminado el bloque de datos identificativos del paciente (nombre, nº historia, fecha, médico solicitante, indicación) del informe generado.
- Añadida la opción **"Tiroides sin nódulos"**, que genera un informe simplificado sin requerir ningún umbral de tamaño.
- Añadido el campo **"Comparación con estudios previos"** en cada nódulo (estable / nuevo / aumentado / disminuido / sin estudio previo), con nota opcional, incluido en el texto del informe.
- Numeración de nódulos automática por orden de pestaña (elimina el riesgo de asignar el mismo número a dos nódulos).
- Codificación visual por color (TR1–TR5) en las pestañas y en el resumen rápido.
- Banner de puntuación en tiempo real con categoría TR y recomendación mientras se completa el formulario.
- Sección de "Impresión diagnóstica" generada automáticamente al final del informe.
- Botón "Nuevo informe" para reiniciar todos los datos.
