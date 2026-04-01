# -*- coding: utf-8 -*-
"""
Plan de Implementacion - Aplicacion de Procesos Disciplinarios
Para Cooperativa de Transporte de Pasajeros Urbano
DOCUMENTO ACTUALIZADO CON MEJORAS DEL USUARIO
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Registrar fuentes
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Crear documento
output_path = "/home/z/my-project/download/Plan_Implementacion_Procesos_Disciplinarios.pdf"
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="Plan Implementacion Procesos Disciplinarios",
    author='Z.ai',
    creator='Z.ai',
    subject='Plan de implementacion detallado para aplicacion de procesos disciplinarios'
)

# Estilos
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='MainTitle',
    fontName='Times New Roman',
    fontSize=26,
    leading=32,
    alignment=TA_CENTER,
    spaceAfter=15,
    textColor=colors.HexColor('#1F4E79')
)

subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    spaceAfter=25,
    textColor=colors.HexColor('#4472C4')
)

h1_style = ParagraphStyle(
    name='Heading1',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_LEFT,
    spaceBefore=18,
    spaceAfter=10,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    name='Heading2',
    fontName='Times New Roman',
    fontSize=13,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#2E75B6')
)

h3_style = ParagraphStyle(
    name='Heading3',
    fontName='Times New Roman',
    fontSize=11,
    leading=15,
    alignment=TA_LEFT,
    spaceBefore=8,
    spaceAfter=4,
    textColor=colors.HexColor('#404040')
)

body_style = ParagraphStyle(
    name='BodyText',
    fontName='Times New Roman',
    fontSize=10.5,
    leading=15,
    alignment=TA_JUSTIFY,
    spaceBefore=4,
    spaceAfter=4
)

body_left = ParagraphStyle(
    name='BodyLeft',
    fontName='Times New Roman',
    fontSize=10.5,
    leading=15,
    alignment=TA_LEFT,
    spaceBefore=4,
    spaceAfter=4
)

list_style = ParagraphStyle(
    name='ListText',
    fontName='Times New Roman',
    fontSize=10.5,
    leading=15,
    alignment=TA_LEFT,
    leftIndent=20,
    spaceBefore=2,
    spaceAfter=2
)

highlight_style = ParagraphStyle(
    name='Highlight',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT,
    backColor=colors.HexColor('#FFF3CD'),
    borderPadding=8,
    spaceBefore=8,
    spaceAfter=8
)

legal_style = ParagraphStyle(
    name='LegalText',
    fontName='Times New Roman',
    fontSize=9.5,
    leading=13,
    alignment=TA_JUSTIFY,
    backColor=colors.HexColor('#E8F4FD'),
    borderPadding=10,
    spaceBefore=8,
    spaceAfter=8,
    borderColor=colors.HexColor('#2E75B6'),
    borderWidth=1
)

step_style = ParagraphStyle(
    name='StepText',
    fontName='Times New Roman',
    fontSize=10.5,
    leading=15,
    alignment=TA_LEFT,
    leftIndent=15,
    spaceBefore=3,
    spaceAfter=3
)

table_header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    leading=13,
    alignment=TA_CENTER,
    textColor=colors.white
)

table_cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=9.5,
    leading=12,
    alignment=TA_LEFT
)

table_cell_center = ParagraphStyle(
    name='TableCellCenter',
    fontName='Times New Roman',
    fontSize=9.5,
    leading=12,
    alignment=TA_CENTER
)

story = []

# === PORTADA ===
story.append(Spacer(1, 80))
story.append(Paragraph("<b>PLAN DE IMPLEMENTACION</b>", title_style))
story.append(Spacer(1, 15))
story.append(Paragraph("Aplicacion de Procesos Disciplinarios", subtitle_style))
story.append(Paragraph("Cooperativa de Transporte de Pasajeros Urbano", subtitle_style))
story.append(Spacer(1, 40))
story.append(Paragraph("<b>DOCUMENTO ACTUALIZADO</b>", ParagraphStyle(
    name='CoverUpdated',
    fontName='Times New Roman',
    fontSize=12,
    leading=16,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#28A745')
)))
story.append(Paragraph("Con las mejoras propuestas por el usuario", ParagraphStyle(
    name='CoverNote',
    fontName='Times New Roman',
    fontSize=11,
    leading=15,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 50))
story.append(Paragraph("Marzo 2026", ParagraphStyle(
    name='CoverDate',
    fontName='Times New Roman',
    fontSize=11,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#888888')
)))
story.append(PageBreak())

# === CONTENIDO ===

# 1. RESUMEN DE ACTUALIZACIONES
story.append(Paragraph("<b>1. RESUMEN DE ACTUALIZACIONES INCORPORADAS</b>", h1_style))
story.append(Spacer(1, 6))

resumen_text = """
Este documento actualiza el plan de implementacion incorporando las mejoras y ajustes propuestos por el 
usuario tras la revision del analisis inicial. Las principales modificaciones incluyen: adicion del ID del 
indiciado en el encabezado, inclusion del texto legal de consentimiento para validacion de notificaciones 
digitales, simplificacion del envio de notificaciones (sin integracion automatica de WhatsApp), ajuste 
en la generacion de documentos PDF (unicamente al final del proceso), incorporacion del modulo de 
capacitacion mediante enlaces a Microsoft Forms, y redefinicion del alcance del analisis con IA.
"""
story.append(Paragraph(resumen_text, body_style))

# Tabla de cambios
cambios_data = [
    [Paragraph('<b>Aspecto</b>', table_header_style), 
     Paragraph('<b>Cambio Realizado</b>', table_header_style)],
    [Paragraph('Encabezado', table_cell_style), 
     Paragraph('Se incluye campo "ID del indiciado"', table_cell_style)],
    [Paragraph('Consentimiento Legal', table_cell_style), 
     Paragraph('Texto de aceptacion segun Ley 527/1999 y Ley 2213/2022', table_cell_style)],
    [Paragraph('Generacion PDF', table_cell_style), 
     Paragraph('Solo al finalizar el proceso completo, no en cada etapa', table_cell_style)],
    [Paragraph('Capacitacion', table_cell_style), 
     Paragraph('Integracion con Microsoft Forms existentes', table_cell_style)],
    [Paragraph('WhatsApp', table_cell_style), 
     Paragraph('Eliminado - Se usa copia manual de enlace/QR', table_cell_style)],
    [Paragraph('NotebookLM', table_cell_style), 
     Paragraph('No indispensable - IA accede directamente a Google Drive', table_cell_style)],
    [Paragraph('Dashboard/Informes', table_cell_style), 
     Paragraph('Confirmado como funcionalidad necesaria', table_cell_style)],
]

cambios_table = Table(cambios_data, colWidths=[4*cm, 10*cm])
cambios_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(cambios_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 1.</b> Resumen de actualizaciones incorporadas", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 12))

# 2. ESTRUCTURA DEL SISTEMA ACTUALIZADA
story.append(Paragraph("<b>2. ESTRUCTURA DEL SISTEMA ACTUALIZADA</b>", h1_style))
story.append(Spacer(1, 6))

# 2.1 Formulario de Encabezado
story.append(Paragraph("<b>2.1 Formulario de Encabezado (Inicio del Proceso)</b>", h2_style))

encabezado_text = """
El formulario de inicio del proceso disciplinario ha sido actualizado para incluir el ID del indiciado 
como campo obligatorio. Este identificador permitira vincular el proceso disciplinario con los registros 
administrativos existentes del indiciado (numero de empleado, numero de asociado, o documento de identidad).
"""
story.append(Paragraph(encabezado_text, body_style))

encabezados_data = [
    [Paragraph('<b>Campo</b>', table_header_style), 
     Paragraph('<b>Tipo</b>', table_header_style),
     Paragraph('<b>Descripcion</b>', table_header_style),
     Paragraph('<b>Obligatorio</b>', table_header_style)],
    [Paragraph('ID del Indiciado', table_cell_style), 
     Paragraph('Texto', table_cell_center),
     Paragraph('Identificador unico (cedula, codigo empleado, etc.)', table_cell_style),
     Paragraph('Si', table_cell_center)],
    [Paragraph('Nombre del Indiciado', table_cell_style), 
     Paragraph('Texto', table_cell_center),
     Paragraph('Nombre completo del indiciado', table_cell_style),
     Paragraph('Si', table_cell_center)],
    [Paragraph('Rol', table_cell_style), 
     Paragraph('Selector', table_cell_center),
     Paragraph('Empleado (Conductor/Despachador/Lider/Gerencia) o Propietario (Asociado/Afiliado)', table_cell_style),
     Paragraph('Si', table_cell_center)],
    [Paragraph('Fecha del Suceso', table_cell_style), 
     Paragraph('Fecha', table_cell_center),
     Paragraph('Fecha en que ocurrieron los hechos', table_cell_style),
     Paragraph('Si', table_cell_center)],
    [Paragraph('Descripcion del Suceso', table_cell_style), 
     Paragraph('Texto largo', table_cell_center),
     Paragraph('Descripcion detallada de los hechos', table_cell_style),
     Paragraph('Si', table_cell_center)],
    [Paragraph('Responsable del Proceso', table_cell_style), 
     Paragraph('Texto', table_cell_center),
     Paragraph('Nombre de quien decide en primera instancia', table_cell_style),
     Paragraph('Si', table_cell_center)],
    [Paragraph('Rol del Responsable', table_cell_style), 
     Paragraph('Selector', table_cell_center),
     Paragraph('Cargo del responsable del proceso', table_cell_style),
     Paragraph('Si', table_cell_center)],
]

encabezados_table = Table(encabezados_data, colWidths=[3.5*cm, 2*cm, 6.5*cm, 2*cm])
encabezados_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('ALIGN', (3, 0), (3, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#D5E8D4')),
    ('BACKGROUND', (0, 2), (-1, 2), colors.white),
    ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 4), (-1, 4), colors.white),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 6), (-1, 6), colors.white),
    ('BACKGROUND', (0, 7), (-1, 7), colors.HexColor('#F5F5F5')),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(encabezados_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 2.</b> Campos del formulario de encabezado", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 12))

# 2.2 Formulario del Indiciado
story.append(Paragraph("<b>2.2 Formulario de Descargos (Vista del Indiciado)</b>", h2_style))

descargos_text = """
Cuando el indiciado accede al sistema mediante el enlace o codigo QR, vera el formulario de descargos 
que incluye la informacion del caso y el texto legal de consentimiento. Este texto es obligatorio y 
debe ser aceptado antes de poder enviar los descargos.
"""
story.append(Paragraph(descargos_text, body_style))

story.append(Spacer(1, 6))
story.append(Paragraph("<b>TEXTO LEGAL DE CONSENTIMIENTO</b>", ParagraphStyle(
    name='LegalTitle',
    fontName='Times New Roman',
    fontSize=10,
    leading=13,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1F4E79'),
    spaceBefore=8,
    spaceAfter=4
)))

legal_text = """
"Al enviar este formulario, declaro bajo la gravedad de juramento que soy el titular del numero de WhatsApp 
registrado, que he recibido este proceso disciplinario por este medio de manera valida y que autorizo el 
uso de este canal para todas las notificaciones del proceso. Acepto que mi firma digital y la foto de mi 
cedula aqui adjuntas tienen plena validez legal segun la Ley 527 de 1999 y la Ley 2213 de 2022."
"""
story.append(Paragraph(legal_text, legal_style))
story.append(Spacer(1, 8))

elementos_form = """
El formulario de descargos contendra los siguientes elementos:
"""
story.append(Paragraph(elementos_form, body_style))

elementos_list = [
    "<b>Informacion del caso:</b> ID, nombre, fecha del suceso, descripcion de los hechos (solo lectura)",
    "<b>Analisis de falta preliminar:</b> Falta identificada, articulos y normas vulneradas (solo lectura)",
    "<b>Cuadro de descargos:</b> Campo de texto para que el indiciado escriba su defensa",
    "<b>Firma digital:</b> Area para firmar con el dedo en dispositivo movil",
    "<b>Foto de cedula:</b> Captura o carga de foto frontal del documento de identidad",
    "<b>Casilla de aceptacion:</b> Checkbox para aceptar el texto legal de consentimiento",
    "<b>Boton de envio:</b> Solo se habilita cuando todos los campos estan completos y se acepta el consentimiento",
]

for elem in elementos_list:
    story.append(Paragraph("    " + elem, list_style))
story.append(Spacer(1, 10))

# 2.3 Flujo Completo Actualizado
story.append(Paragraph("<b>2.3 Flujo Completo del Proceso (Actualizado)</b>", h2_style))

flujo_data = [
    [Paragraph('<b>Etapa</b>', table_header_style), 
     Paragraph('<b>Accion</b>', table_header_style),
     Paragraph('<b>Responsable</b>', table_header_style),
     Paragraph('<b>Notificacion</b>', table_header_style)],
    [Paragraph('1. Inicio', table_cell_style), 
     Paragraph('Registro del encabezado con ID, nombre, rol, fecha, descripcion, responsable', table_cell_style),
     Paragraph('Responsable del Proceso', table_cell_style),
     Paragraph('Se genera enlace/QR', table_cell_center)],
    [Paragraph('2. Analisis IA', table_cell_style), 
     Paragraph('IA analiza el suceso contra documentos del repositorio en Google Drive', table_cell_style),
     Paragraph('Sistema (Automatico)', table_cell_style),
     Paragraph('N/A', table_cell_center)],
    [Paragraph('3. Notificacion', table_cell_style), 
     Paragraph('El responsable copia el enlace/QR y lo envia manualmente por WhatsApp', table_cell_style),
     Paragraph('Responsable del Proceso', table_cell_style),
     Paragraph('Manual via WhatsApp', table_cell_center)],
    [Paragraph('4. Descargos', table_cell_style), 
     Paragraph('El indiciado accede, acepta terminos, escribe descargos, firma y adjunta cedula', table_cell_style),
     Paragraph('Indiciado', table_cell_style),
     Paragraph('N/A', table_cell_center)],
    [Paragraph('5. Decision 1ra', table_cell_style), 
     Paragraph('Analisis de descargos y emision de decision: Absolver o Sancionar', table_cell_style),
     Paragraph('Responsable del Proceso', table_cell_style),
     Paragraph('Se genera enlace', table_cell_center)],
    [Paragraph('6. Notificacion 1ra', table_cell_style), 
     Paragraph('El responsable envia enlace con decision de primera instancia', table_cell_style),
     Paragraph('Responsable del Proceso', table_cell_style),
     Paragraph('Manual via WhatsApp', table_cell_center)],
    [Paragraph('7. Apelacion', table_cell_style), 
     Paragraph('El indiciado puede solicitar apelacion y presentar nuevos argumentos', table_cell_style),
     Paragraph('Indiciado (Opcional)', table_cell_style),
     Paragraph('N/A', table_cell_center)],
    [Paragraph('8. Decision 2da', table_cell_style), 
     Paragraph('El Comite de Apelaciones decide: Absolver, Confirmar o Modificar', table_cell_style),
     Paragraph('Comite de Apelaciones', table_cell_style),
     Paragraph('Se genera enlace', table_cell_center)],
    [Paragraph('9. Cierre', table_cell_style), 
     Paragraph('Notificacion final y generacion del PDF completo del proceso', table_cell_style),
     Paragraph('Sistema (Automatico)', table_cell_style),
     Paragraph('Manual via WhatsApp', table_cell_center)],
]

flujo_table = Table(flujo_data, colWidths=[2*cm, 6*cm, 3.5*cm, 2.5*cm])
flujo_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (3, 0), (3, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 9), (-1, 9), colors.white),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(flujo_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 3.</b> Flujo completo del proceso disciplinario actualizado", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 12))

# 2.4 Generacion de Documentos
story.append(Paragraph("<b>2.4 Generacion de Documentos PDF</b>", h2_style))

pdf_text = """
Siguiendo la sugerencia del usuario, la generacion del documento PDF se realizara unicamente al finalizar 
todo el proceso disciplinario. Este documento consolidado incluira:
"""
story.append(Paragraph(pdf_text, body_style))

pdf_contenido = [
    "Encabezado con todos los datos del caso y del indiciado",
    "Analisis de falta realizado por el agente de IA",
    "Texto completo de los descargos presentados",
    "Registro de la firma digital y la foto de cedula",
    "Decision de primera instancia con fundamentacion",
    "En caso de apelacion: nuevos argumentos del indiciado",
    "Decision de segunda instancia (si aplica)",
    "Firmas digitales de todos los involucrados",
    "Registro de fechas de cada etapa del proceso",
]

for item in pdf_contenido:
    story.append(Paragraph("    " + item, list_style))
story.append(Spacer(1, 10))

# 2.5 Modulo de Capacitacion
story.append(Paragraph("<b>2.5 Modulo de Capacitacion</b>", h2_style))

capacitacion_text = """
El modulo de capacitacion se integrara con los formularios de Microsoft 365 existentes en la cooperativa. 
Cuando se imponga una sancion, el sistema permitira asociar un enlace a un formulario de capacitacion 
relacionado con la falta cometida. El flujo sera el siguiente:
"""
story.append(Paragraph(capacitacion_text, body_style))

capacitacion_pasos = """
Al momento de registrar una sancion, el responsable podra seleccionar (opcionalmente) un enlace de 
capacitacion de una lista preconfigurada. Esta lista se alimentara de los enlaces de Microsoft Forms 
que la cooperativa ya tiene disponibles. El indiciado recibira el enlace junto con la notificacion 
de la sancion y podra completar la capacitacion de manera autodidacta. El sistema registrara si el 
indiciado completo o no la capacitacion sugerida.
"""
story.append(Paragraph(capacitacion_pasos, body_style))
story.append(Spacer(1, 10))

# 3. ARQUITECTURA TECNICA SIMPLIFICADA
story.append(Paragraph("<b>3. ARQUITECTURA TECNICA SIMPLIFICADA</b>", h1_style))
story.append(Spacer(1, 6))

arch_text = """
Basado en las simplificaciones propuestas por el usuario, la arquitectura del sistema se reduce 
significativamente, manteniendo las funcionalidades esenciales:
"""
story.append(Paragraph(arch_text, body_style))

# Tabla de arquitectura
arch_data = [
    [Paragraph('<b>Componente</b>', table_header_style), 
     Paragraph('<b>Tecnologia</b>', table_header_style),
     Paragraph('<b>Funcion</b>', table_header_style)],
    [Paragraph('Frontend (Interfaz)', table_cell_style), 
     Paragraph('Next.js + React', table_cell_center),
     Paragraph('Paginas web para registro, descargos, decisiones', table_cell_style)],
    [Paragraph('Base de Datos', table_cell_style), 
     Paragraph('SQLite / PostgreSQL', table_cell_center),
     Paragraph('Almacenamiento de casos, usuarios, decisiones', table_cell_style)],
    [Paragraph('Repositorio Documentos', table_cell_style), 
     Paragraph('Google Drive', table_cell_center),
     Paragraph('PDFs de CST, RIT, Estatutos, etc.', table_cell_style)],
    [Paragraph('Almacenamiento Evidencias', table_cell_style), 
     Paragraph('Google Drive', table_cell_center),
     Paragraph('Fotos de cedula, firmas digitales', table_cell_style)],
    [Paragraph('Agente IA', table_cell_style), 
     Paragraph('Z.ai SDK', table_cell_center),
     Paragraph('Analisis de faltas contra documentos', table_cell_style)],
    [Paragraph('Generacion QR', table_cell_style), 
     Paragraph('Libreria QR', table_cell_center),
     Paragraph('Codigos QR para acceso del indiciado', table_cell_style)],
    [Paragraph('Generacion PDF', table_cell_style), 
     Paragraph('ReportLab / PDF-lib', table_cell_center),
     Paragraph('Documento final consolidado', table_cell_style)],
    [Paragraph('Dashboard', table_cell_style), 
     Paragraph('Next.js + Graficos', table_cell_center),
     Paragraph('Visualizacion de estadisticas', table_cell_style)],
    [Paragraph('Capacitacion', table_cell_style), 
     Paragraph('Enlaces externos', table_cell_center),
     Paragraph('Microsoft Forms existentes', table_cell_style)],
]

arch_table = Table(arch_data, colWidths=[4*cm, 3.5*cm, 6.5*cm])
arch_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 9), (-1, 9), colors.white),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(arch_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 4.</b> Componentes del sistema y tecnologias", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 12))

# 4. ANALISIS CON IA SIMPLIFICADO
story.append(Paragraph("<b>4. ANALISIS CON IA SIMPLIFICADO</b>", h1_style))
story.append(Spacer(1, 6))

ia_text = """
El analisis con IA se ha simplificado segun la propuesta del usuario. En lugar de utilizar NotebookLM, 
el agente de IA accedera directamente a los documentos almacenados en Google Drive. Para optimizar 
el analisis, se recomienda crear un documento resumen de cada normativa que extraiga:
"""
story.append(Paragraph(ia_text, body_style))

ia_elementos = [
    "<b>Catalogo de Faltas:</b> Lista detallada de cada falta con su clasificacion (leve, grave, gravisima)",
    "<b>Escala de Sanciones:</b> Sanciones aplicables para cada tipo de falta",
    "<b>Atenuantes:</b> Circunstancias que pueden reducir la sancion",
    "<b>Agravantes:</b> Circunstancias que pueden aumentar la sancion",
    "<b>Procedimiento:</b> Pasos a seguir segun el tipo de falta",
    "<b>Articulos Referencia:</b> Numeros de articulos para citacion",
]

for elem in ia_elementos:
    story.append(Paragraph("    " + elem, list_style))
story.append(Spacer(1, 8))

ia_proceso = """
El proceso de analisis sera el siguiente: cuando el responsable registre un caso, el sistema enviara 
automaticamente la descripcion del suceso al agente de IA junto con el contexto del rol del indiciado. 
La IA consultara los documentos del repositorio correspondiente (empleados o propietarios) y generara 
un informe preliminar que incluira: la falta identificada, los articulos vulnerados, posibles atenuantes 
y agravantes, y un rango de sanciones sugeridas. Este informe sera visible tanto para el responsable 
del proceso como para el indiciado (quien podra refutarlo en sus descargos).
"""
story.append(Paragraph(ia_proceso, body_style))
story.append(Spacer(1, 10))

# 5. DASHBOARD E INFORMES
story.append(Paragraph("<b>5. DASHBOARD E INFORMES</b>", h1_style))
story.append(Spacer(1, 6))

dashboard_text = """
El dashboard e informes son funcionalidades confirmadas como necesarias para la trazabilidad y 
gestion del sistema. A continuacion se detallan las metricas y reportes que se implementaran:
"""
story.append(Paragraph(dashboard_text, body_style))

story.append(Paragraph("<b>5.1 Dashboard Principal</b>", h2_style))

dashboard_kpis = [
    "<b>Casos activos:</b> Numero de procesos en curso (por etapa)",
    "<b>Casos pendientes de descargos:</b> Procesos esperando respuesta del indiciado",
    "<b>Casos pendientes de decision:</b> Procesos listos para emitir resolucion",
    "<b>Casos en apelacion:</b> Procesos en segunda instancia",
    "<b>Tiempo promedio de resolucion:</b> Dias promedio desde inicio hasta cierre",
    "<b>Tasa de apelaciones:</b> Porcentaje de casos que llegan a segunda instancia",
]

for kpi in dashboard_kpis:
    story.append(Paragraph("    " + kpi, list_style))
story.append(Spacer(1, 8))

story.append(Paragraph("<b>5.2 Informes Disponibles</b>", h2_style))

informes_list = [
    "<b>Por persona:</b> Historial disciplinario completo de un indiciado especifico",
    "<b>Por tipo de falta:</b> Estadisticas de faltas mas frecuentes",
    "<b>Por decision:</b> Distribucion de absoluciones y sanciones",
    "<b>Por rol:</b> Comparativa entre empleados y propietarios",
    "<b>Por responsable:</b> Carga de trabajo por responsable de proceso",
    "<b>Temporal:</b> Evolucion de casos en el tiempo (mensual, trimestral, anual)",
    "<b>Reincidencia:</b> Personas con multiples procesos disciplinarios",
]

for inf in informes_list:
    story.append(Paragraph("    " + inf, list_style))
story.append(Spacer(1, 10))

# 6. PLAN DE IMPLEMENTACION PASO A PASO
story.append(Paragraph("<b>6. PLAN DE IMPLEMENTACION PASO A PASO</b>", h1_style))
story.append(Spacer(1, 6))

implementacion_intro = """
A continuacion se presenta el plan de implementacion detallado, disenado especificamente para alguien 
sin conocimientos tecnicos. Cada paso incluye instrucciones claras de que hacer y que esperar.
"""
story.append(Paragraph(implementacion_intro, body_style))

# FASE 1
story.append(Paragraph("<b>FASE 1: PREPARACION DE DOCUMENTOS Y RECURSOS</b>", h2_style))
story.append(Spacer(1, 4))

story.append(Paragraph("<b>Paso 1.1: Crear estructura en Google Drive</b>", h3_style))
paso11 = """
Abra Google Drive con su cuenta de la cooperativa. Cree una carpeta principal llamada "Procesos Disciplinarios". 
Dentro de esta carpeta, cree dos subcarpetas: "Repositorio_Empleados" y "Repositorio_Propietarios". 
En cada subcarpeta, suba los documentos PDF correspondientes. Para empleados: Codigo Sustantivo de Trabajo, 
Reglamento Interno de Trabajo, Plan Estrategico de Seguridad Vial, Plan de Seguridad y Salud en el Trabajo, 
Perfiles de Cargo, Codigo Nacional de Transito, y modelos de contrato. Para propietarios: Estatuto, 
Programa de Etica y Transparencia Empresarial, y Codigo de Buen Gobierno.
"""
story.append(Paragraph(paso11, body_left))

story.append(Paragraph("<b>Paso 1.2: Crear documento resumen de cada normativa</b>", h3_style))
paso12 = """
Para cada documento normativo, cree un documento adicional (puede ser en Google Docs o Word) que resuma: 
el catalogo de faltas con clasificacion, la escala de sanciones, los atenuantes y agravantes, y los 
articulos relevantes con su numeracion. Este documento resumen ayudara a que la IA responda mas rapidamente. 
Por ejemplo, del Reglamento Interno de Trabajo, extraiga todas las faltas y sus sanciones en una tabla 
simple. Guarde estos documentos resumen en las mismas carpetas con el prefijo "RESUMEN_".
"""
story.append(Paragraph(paso12, body_left))

story.append(Paragraph("<b>Paso 1.3: Compilar enlaces de Microsoft Forms</b>", h3_style))
paso13 = """
Reuna todos los enlaces de los formularios de Microsoft 365 que utilizan para capacitacion. Cree un 
documento simple (puede ser en Google Sheets) con dos columnas: "Nombre del formulario" y "Enlace". 
Por ejemplo: "Seguridad Vial - https://forms.office.com/..." , "Etica y Transparencia - https://forms.office.com/...". 
Este listado sera cargado al sistema para vincular sanciones con capacitaciones.
"""
story.append(Paragraph(paso13, body_left))
story.append(Spacer(1, 8))

# FASE 2
story.append(Paragraph("<b>FASE 2: DESARROLLO DEL SISTEMA (EJECUTADO POR EL EQUIPO TECNICO)</b>", h2_style))
story.append(Spacer(1, 4))

story.append(Paragraph("<b>Paso 2.1: Configuracion del entorno de desarrollo</b>", h3_style))
paso21 = """
El equipo tecnico configurara el servidor de hosting (se recomienda Vercel que tiene plan gratuito 
generoso para proyectos pequeños). Se creara el proyecto en Next.js con la estructura de carpetas 
necesaria. Se configurara la conexion con Google Drive para acceder a los documentos. Se instalara 
el SDK de Z.ai para el analisis con IA.
"""
story.append(Paragraph(paso21, body_left))

story.append(Paragraph("<b>Paso 2.2: Desarrollo de las pantallas principales</b>", h3_style))
paso22 = """
Se desarrollaran las siguientes pantallas: (1) Pantalla de login con control de acceso por roles, 
(2) Dashboard principal con metricas en tiempo real, (3) Formulario de registro de nuevo caso, 
(4) Vista de detalles del caso para el responsable, (5) Formulario de descargos para el indiciado, 
(6) Formulario de decision de primera instancia, (7) Formulario de apelacion, (8) Formulario de 
decision de segunda instancia, (9) Modulo de informes y estadisticas.
"""
story.append(Paragraph(paso22, body_left))

story.append(Paragraph("<b>Paso 2.3: Integracion con Google Drive</b>", h3_style))
paso23 = """
Se configurara la integracion para que el sistema pueda: leer los documentos del repositorio, 
guardar las fotos de cedula y firmas digitales, y organizar las evidencias por numero de caso. 
Para esto, necesitara crear una cuenta de servicio en Google Cloud y compartir las carpetas 
con dicha cuenta. Se le proporcionaran instrucciones detalladas cuando llegue este paso.
"""
story.append(Paragraph(paso23, body_left))

story.append(Paragraph("<b>Paso 2.4: Configuracion del agente de IA</b>", h3_style))
paso24 = """
Se configurara el agente de IA para que, al recibir la descripcion de un suceso, consulte los 
documentos del repositorio correspondiente y genere un analisis estructurado. La IA devolvera: 
falta identificada, clasificacion de gravedad, articulos vulnerados, posibles atenuantes, 
posibles agravantes, y sanciones sugeridas.
"""
story.append(Paragraph(paso24, body_left))

story.append(Paragraph("<b>Paso 2.5: Pruebas del sistema</b>", h3_style))
paso25 = """
Antes de poner el sistema en produccion, se realizaran pruebas completas: crear casos de prueba, 
simular descargos, verificar el analisis de IA, probar la generacion de QR, validar el flujo de 
apelaciones, y generar informes de prueba. Se le invitara a participar en las pruebas para 
asegurar que el sistema cumple con sus expectativas.
"""
story.append(Paragraph(paso25, body_left))
story.append(Spacer(1, 8))

# FASE 3
story.append(Paragraph("<b>FASE 3: PUESTA EN MARCHA</b>", h2_style))
story.append(Spacer(1, 4))

story.append(Paragraph("<b>Paso 3.1: Capacitacion de usuarios</b>", h3_style))
paso31 = """
Se capacitara a los usuarios que interactuaran con el sistema: (1) Responsables de proceso: como 
registrar casos, copiar enlaces, registrar decisiones, (2) Comite de Apelaciones: como acceder a 
casos en apelacion y emitir decisiones de segunda instancia, (3) Gerencia: como usar el dashboard 
y generar informes. La capacitacion se realizara mediante videollamada y se grabara para futura 
referencia.
"""
story.append(Paragraph(paso31, body_left))

story.append(Paragraph("<b>Paso 3.2: Carga de datos iniciales</b>", h3_style))
paso32 = """
Si la cooperativa tiene procesos disciplinarios en curso o historicos que desea migrar al sistema, 
se definira un proceso de migracion. Los casos activos se ingresaran manualmente para asegurar que 
todos los datos esten correctos. Los casos historicos pueden cargarse de forma masiva si se 
disponen en formato digital estructurado.
"""
story.append(Paragraph(paso32, body_left))

story.append(Paragraph("<b>Paso 3.3: Inicio de operaciones</b>", h3_style))
paso33 = """
El sistema quedara disponible en una direccion web (por ejemplo: disciplinarios.sucooperativa.com). 
Se recomienda iniciar con un periodo de operacion asistida de 2-4 semanas donde el equipo tecnico 
estara disponible para resolver dudas y hacer ajustes menores. Durante este periodo, se recomienda 
que los primeros casos sean seguidos de cerca para identificar mejoras.
"""
story.append(Paragraph(paso33, body_left))
story.append(Spacer(1, 8))

# FASE 4
story.append(Paragraph("<b>FASE 4: MEJORAS CONTINUAS</b>", h2_style))
story.append(Spacer(1, 4))

story.append(Paragraph("<b>Paso 4.1: Retroalimentacion y ajustes</b>", h3_style))
paso41 = """
Despues del primer mes de operacion, se realizara una reunion de retroalimentacion para identificar 
aspectos a mejorar. Los usuarios podran reportar dificultades, sugerir nuevas funcionalidades, y 
comentar sobre el desempeno del agente de IA. Se priorizaran los ajustes segun su impacto en la 
operacion diaria.
"""
story.append(Paragraph(paso41, body_left))

story.append(Paragraph("<b>Paso 4.2: Optimizacion del agente de IA</b>", h3_style))
paso42 = """
Con base en los casos procesados, se ajustara el comportamiento del agente de IA para mejorar la 
precision en la identificacion de faltas y la sugerencia de sanciones. Se pueden agregar nuevos 
documentos al repositorio o refinar los documentos resumen para obtener mejores resultados.
"""
story.append(Paragraph(paso42, body_left))

story.append(Paragraph("<b>Paso 4.3: Nuevas funcionalidades</b>", h3_style))
paso43 = """
Segun las necesidades que vayan surgiendo, se podran agregar nuevas funcionalidades al sistema. 
Algunas posibilidades: notificaciones por correo electronico automaticas, integracion con otros 
sistemas de la cooperativa, modulo de seguimiento de sanciones cumplidas, aplicacion movil nativa, 
entre otras. Estas mejoras se evaluaran en funcion del presupuesto disponible.
"""
story.append(Paragraph(paso43, body_left))
story.append(Spacer(1, 12))

# 7. RECURSOS NECESARIOS
story.append(Paragraph("<b>7. RECURSOS NECESARIOS</b>", h1_style))
story.append(Spacer(1, 6))

recursos_text = """
Para implementar el sistema, se requieren los siguientes recursos:
"""
story.append(Paragraph(recursos_text, body_style))

recursos_data = [
    [Paragraph('<b>Recurso</b>', table_header_style), 
     Paragraph('<b>Tipo</b>', table_header_style),
     Paragraph('<b>Costo Estimado</b>', table_header_style)],
    [Paragraph('Hosting (Vercel)', table_cell_style), 
     Paragraph('Infraestructura', table_cell_center),
     Paragraph('Gratuito (plan hobby) o $20 USD/mes (pro)', table_cell_style)],
    [Paragraph('API de IA (Z.ai)', table_cell_style), 
     Paragraph('Servicio', table_cell_center),
     Paragraph('Incluido en el desarrollo / costo por uso', table_cell_style)],
    [Paragraph('Dominio (opcional)', table_cell_style), 
     Paragraph('Infraestructura', table_cell_center),
     Paragraph('$10-15 USD/ano', table_cell_style)],
    [Paragraph('Google Drive', table_cell_style), 
     Paragraph('Almacenamiento', table_cell_center),
     Paragraph('Incluido con Google Workspace existente', table_cell_style)],
    [Paragraph('Microsoft Forms', table_cell_style), 
     Paragraph('Capacitacion', table_cell_center),
     Paragraph('Incluido con Microsoft 365 existente', table_cell_style)],
    [Paragraph('Desarrollo', table_cell_style), 
     Paragraph('Talento', table_cell_center),
     Paragraph('A definir segun alcance final', table_cell_style)],
]

recursos_table = Table(recursos_data, colWidths=[4*cm, 3*cm, 7*cm])
recursos_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(recursos_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 5.</b> Recursos necesarios para la implementacion", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 12))

# 8. CRONOGRAMA PROPUESTO
story.append(Paragraph("<b>8. CRONOGRAMA PROPUESTO</b>", h1_style))
story.append(Spacer(1, 6))

crono_text = """
El siguiente cronograma es una estimacion inicial que puede ajustarse segun la disponibilidad 
de recursos y la complejidad de los requerimientos especificos:
"""
story.append(Paragraph(crono_text, body_style))

crono_data = [
    [Paragraph('<b>Fase</b>', table_header_style), 
     Paragraph('<b>Actividades</b>', table_header_style),
     Paragraph('<b>Duracion</b>', table_header_style)],
    [Paragraph('Preparacion', table_cell_style), 
     Paragraph('Organizar documentos, crear resumenes, compilar enlaces', table_cell_style),
     Paragraph('1-2 semanas', table_cell_center)],
    [Paragraph('Desarrollo Core', table_cell_style), 
     Paragraph('Pantallas principales, base de datos, flujo basico', table_cell_style),
     Paragraph('3-4 semanas', table_cell_center)],
    [Paragraph('Integracion IA', table_cell_style), 
     Paragraph('Agente de analisis, conexion Google Drive', table_cell_style),
     Paragraph('1-2 semanas', table_cell_center)],
    [Paragraph('Dashboard/Informes', table_cell_style), 
     Paragraph('Estadisticas, reportes, exportacion', table_cell_style),
     Paragraph('1-2 semanas', table_cell_center)],
    [Paragraph('Pruebas', table_cell_style), 
     Paragraph('Testing completo, ajustes, correcciones', table_cell_style),
     Paragraph('1 semana', table_cell_center)],
    [Paragraph('Puesta en Marcha', table_cell_style), 
     Paragraph('Capacitacion, carga inicial, soporte inicial', table_cell_style),
     Paragraph('1-2 semanas', table_cell_center)],
    [Paragraph('TOTAL ESTIMADO', ParagraphStyle(name='TotalStyle', fontName='Times New Roman', fontSize=9.5, leading=12, alignment=TA_LEFT, textColor=colors.HexColor('#1F4E79'))), 
     Paragraph('', table_cell_style),
     Paragraph('8-13 semanas', ParagraphStyle(name='TotalStyle2', fontName='Times New Roman', fontSize=9.5, leading=12, alignment=TA_CENTER, textColor=colors.HexColor('#1F4E79')))],
]

crono_table = Table(crono_data, colWidths=[3.5*cm, 7.5*cm, 3*cm])
crono_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (2, 0), (2, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.HexColor('#E6F0FA')),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(crono_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 6.</b> Cronograma estimado de implementacion", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    leading=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 12))

# 9. SIGUIENTES PASOS
story.append(Paragraph("<b>9. SIGUIENTES PASOS RECOMENDADOS</b>", h1_style))
story.append(Spacer(1, 6))

siguientes_text = """
Para avanzar con el proyecto, se recomienda seguir los siguientes pasos:
"""
story.append(Paragraph(siguientes_text, body_style))

siguientes_list = [
    "<b>Confirmar alcance:</b> Revise este documento y confirme si todas las funcionalidades descritas son correctas o si desea agregar/modificar algo.",
    "<b>Preparar documentos:</b> Comience a organizar los documentos normativos en Google Drive segun las instrucciones del Paso 1.1.",
    "<b>Definir responsables:</b> Identifique quienes seran los usuarios del sistema: responsables de proceso y miembros del Comite de Apelaciones.",
    "<b>Recopilar enlaces de capacitacion:</b> Reuna los enlaces de Microsoft Forms para el modulo de capacitacion.",
    "<b>Confirmar inicio:</b> Cuando este listo, confirme el inicio del desarrollo y se procedera con la Fase 2.",
]

for sig in siguientes_list:
    story.append(Paragraph("    " + sig, list_style))
story.append(Spacer(1, 12))

# NOTA FINAL
story.append(Paragraph("<b>NOTA IMPORTANTE</b>", h2_style))
nota_final = """
Este documento ha sido preparado teniendo en cuenta que usted no tiene conocimientos tecnicos. 
Durante todo el proceso de implementacion, se le proporcionaran instrucciones claras y se le 
acompanara en cada paso. No dude en preguntar cualquier aspecto que no le quede claro. El objetivo 
es que al final del proceso tenga una herramienta funcional que facilite la gestion de los procesos 
disciplinarios en su cooperativa.
"""
story.append(Paragraph(nota_final, body_style))

# Construir PDF
doc.build(story)
print(f"PDF generado exitosamente: {output_path}")
