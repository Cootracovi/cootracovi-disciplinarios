# -*- coding: utf-8 -*-
"""
Guía de Uso - Sistema de Procesos Disciplinarios COOTRACOVI
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import cm

# Crear documento
output_path = "/home/z/my-project/download/Guia_Uso_Sistema_Disciplinarios_COOTRACOVI.pdf"
document = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="Guia Uso Sistema Disciplinarios COOTRACOVI",
    author='Z.ai',
    creator='Z.ai',
    subject='Guia de uso del sistema de procesos disciplinarios para COOTRACOVI'
)

# Estilos
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Title'],
    fontSize=24,
    spaceAfter=20,
    textColor=colors.HexColor('#1F4E79')
)

subtitle_style = ParagraphStyle(
    'CustomSubtitle',
    parent=styles['Normal'],
    fontSize=14,
    alignment=TA_CENTER,
    spaceAfter=30,
    textColor=colors.HexColor('#4472C4')
)

h1_style = ParagraphStyle(
    'CustomH1',
    parent=styles['Heading1'],
    fontSize=16,
    spaceBefore=18,
    spaceAfter=10,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    'CustomH2',
    parent=styles['Heading2'],
    fontSize=13,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontSize=10.5,
    leading=15,
    alignment=TA_JUSTIFY,
    spaceBefore=4,
    spaceAfter=4
)

list_style = ParagraphStyle(
    'CustomList',
    parent=styles['Normal'],
    fontSize=10.5,
    leading=15,
    leftIndent=20,
    spaceBefore=2,
    spaceAfter=2
)

highlight_style = ParagraphStyle(
    'CustomHighlight',
    parent=styles['Normal'],
    fontSize=10,
    leading=14,
    backColor=colors.HexColor('#E6F0FA'),
    borderPadding=10,
    spaceBefore=10,
    spaceAfter=10
)

story = []

# === PORTADA ===
story.append(Spacer(1, 80))
story.append(Paragraph("<b>GUÍA DE USO</b>", title_style))
story.append(Spacer(1, 15))
story.append(Paragraph("Sistema de Procesos Disciplinarios", subtitle_style))
story.append(Paragraph("COOTRACOVI", subtitle_style))
story.append(Spacer(1, 40))
story.append(Paragraph("<b>Manual de Usuario</b>", ParagraphStyle(
    'CoverInfo',
    parent=styles['Normal'],
    fontSize=14,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1F4E79')
)))
story.append(Spacer(1, 60))
story.append(Paragraph("Marzo 2026", ParagraphStyle(
    'CoverDate',
    parent=styles['Normal'],
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#888888')
)))
story.append(PageBreak())

# === CONTENIDO ===

# 1. INTRODUCCION
story.append(Paragraph("<b>1. INTRODUCCIÓN</b>", h1_style))
story.append(Spacer(1, 6))

intro_text = """
El Sistema de Procesos Disciplinarios de COOTRACOVI es una herramienta diseñada para digitalizar y 
automatizar la gestión de procesos disciplinarios tanto para empleados como para propietarios 
(asociados y afiliados) de la cooperativa. Este manual le guiará paso a paso en el uso del sistema, 
desde la configuración inicial hasta el manejo diario de los procesos disciplinarios.
"""
story.append(Paragraph(intro_text, body_style))

# 2. PREPARACION DE GOOGLE DRIVE
story.append(Paragraph("<b>2. PREPARACIÓN DE GOOGLE DRIVE</b>", h1_style))
story.append(Spacer(1, 6))

drive_text = """
Antes de comenzar, debe organizar los documentos normativos en Google Drive. Cree una carpeta principal 
llamada 'Procesos_Disciplinarios_COOTRACOVI' y dentro de ella dos subcarpetas: 'Repositorio_Empleados' 
y 'Repositorio_Propietarios'.
"""
story.append(Paragraph(drive_text, body_style))

story.append(Paragraph("<b>2.1 Documentos para Empleados</b>", h2_style))
docs_emp = [
    "- Codigo_Sustantivo_Trabajo.pdf",
    "- Reglamento_Interno_Trabajo.pdf",
    "- Plan_Estrategico_Seguridad_Vial.pdf",
    "- Plan_Seguridad_Salud_Trabajo.pdf",
    "- Perfiles_Cargo.pdf",
    "- Codigo_Nacional_Transito.pdf",
]
for doc in docs_emp:
    story.append(Paragraph(doc, list_style))

story.append(Paragraph("<b>2.2 Documentos para Propietarios</b>", h2_style))
docs_prop = [
    "- Estatuto_Cootracovi.pdf",
    "- Programa_Etica_Transparencia.pdf",
    "- Codigo_Buen_Gobierno.pdf",
]
for doc in docs_prop:
    story.append(Paragraph(doc, list_style))

story.append(Spacer(1, 12))

# 3. USO DEL SISTEMA
story.append(Paragraph("<b>3. USO DEL SISTEMA</b>", h1_style))

story.append(Paragraph("<b>3.1 Registrar un Nuevo Caso</b>", h2_style))
registro_text = """
Haga clic en 'Nuevo Caso' y complete el formulario con: ID/Cédula del indiciado, Nombre completo, 
Grupo (Empleado o Propietario), Rol específico, Fecha del suceso, Descripción detallada de los hechos, 
y Responsable del proceso.
"""
story.append(Paragraph(registro_text, body_style))

story.append(Paragraph("<b>3.2 Análisis con IA</b>", h2_style))
ia_text = """
Haga clic en 'Analizar con IA' para que el sistema identifique automáticamente: la falta cometida, 
la gravedad (LEVE, GRAVE, GRAVÍSIMA), los artículos vulnerados, posibles atenuantes y agravantes, 
y sanciones sugeridas según la normativa.
"""
story.append(Paragraph(ia_text, body_style))

story.append(Paragraph("<b>3.3 Notificar al Indiciado</b>", h2_style))
notif_text = """
Haga clic en 'Generar Enlace' y copie el enlace. Envíelo por WhatsApp al indiciado. El indiciado 
abrirá el enlace y verá el formulario de descargos donde podrá escribir su defensa, firmar 
digitalmente y adjuntar foto de su cédula.
"""
story.append(Paragraph(notif_text, body_style))

story.append(Spacer(1, 12))

# 4. DECLARACION JURAMENTADA
story.append(Paragraph("<b>4. DECLARACIÓN JURAMENTADA</b>", h1_style))
declaracion = """
"Al enviar este formulario, declaro bajo la gravedad de juramento que soy el titular del número 
de WhatsApp registrado, que he recibido este proceso disciplinario por este medio de manera válida 
y que autorizo el uso de este canal para todas las notificaciones del proceso. Acepto que mi firma 
digital y la foto de mi cédula aquí adjuntas tienen plena validez legal según la Ley 527 de 1999 
y la Ley 2213 de 2022."
"""
story.append(Paragraph(declaracion, highlight_style))

# 5. EMISION DE DECISIONES
story.append(Paragraph("<b>5. EMISIÓN DE DECISIONES</b>", h1_style))

story.append(Paragraph("<b>Primera Instancia:</b>", h2_style))
primera_text = """
Una vez recibidos los descargos, el responsable puede emitir decisión: ABSOLVER o SANCIONAR. 
En caso de sanción, puede ser: Reconvención Escrita, Amonestación Económica, o Suspensión 
(indicando días).
"""
story.append(Paragraph(primera_text, body_style))

story.append(Paragraph("<b>Segunda Instancia (Apelación):</b>", h2_style))
segunda_text = """
Si el indiciado apela, el Comité de Apelaciones revisa el caso y emite decisión definitiva: 
ABSOLVER, CONFIRMAR o MODIFICAR la sanción.
"""
story.append(Paragraph(segunda_text, body_style))

story.append(Spacer(1, 12))

# 6. FLUJO COMPLETO
story.append(Paragraph("<b>6. FLUJO COMPLETO DEL PROCESO</b>", h1_style))

flujo_items = [
    "1. Inicio - Registro del caso",
    "2. Análisis IA - Identificación automática de falta",
    "3. Notificación - Envío de enlace al indiciado",
    "4. Descargos - El indiciado presenta su defensa",
    "5. Decisión 1ª Instancia - Absolución o sanción",
    "6. Apelación - Solicitud de segunda instancia (opcional)",
    "7. Decisión 2ª Instancia - Decisión definitiva",
    "8. Cierre - Generación de PDF completo",
]

for item in flujo_items:
    story.append(Paragraph("    " + item, list_style))

story.append(Spacer(1, 15))

# Nota final
nota_final = """
<b>Importante:</b> Este sistema ha sido desarrollado específicamente para COOTRACOVI y cumple 
con la normativa colombiana vigente. La información registrada tiene validez legal.
"""
story.append(Paragraph(nota_final, highlight_style))

# Construir PDF
document.build(story)
print(f"PDF generado exitosamente: {output_path}")
