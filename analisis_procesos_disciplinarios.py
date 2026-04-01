# -*- coding: utf-8 -*-
"""
Análisis Completo - Aplicación de Procesos Disciplinarios
Para Cooperativa de Transporte de Pasajeros Urbano
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, Image, ListFlowable, ListItem
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
output_path = "/home/z/my-project/download/Analisis_App_Procesos_Disciplinarios.pdf"
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="Analisis App Procesos Disciplinarios",
    author='Z.ai',
    creator='Z.ai',
    subject='Analisis completo para desarrollo de aplicacion de procesos disciplinarios'
)

# Estilos
styles = getSampleStyleSheet()

# Estilo para titulo principal
title_style = ParagraphStyle(
    name='MainTitle',
    fontName='Times New Roman',
    fontSize=28,
    leading=34,
    alignment=TA_CENTER,
    spaceAfter=20,
    textColor=colors.HexColor('#1F4E79')
)

# Estilo para subtitulo
subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=30,
    textColor=colors.HexColor('#4472C4')
)

# Estilo para encabezados de seccion
h1_style = ParagraphStyle(
    name='Heading1',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    alignment=TA_LEFT,
    spaceBefore=20,
    spaceAfter=12,
    textColor=colors.HexColor('#1F4E79')
)

# Estilo para subsecciones
h2_style = ParagraphStyle(
    name='Heading2',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=15,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

# Estilo para body text
body_style = ParagraphStyle(
    name='BodyText',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceBefore=6,
    spaceAfter=6
)

# Estilo para listas
list_style = ParagraphStyle(
    name='ListText',
    fontName='Times New Roman',
    fontSize=11,
    leading=15,
    alignment=TA_LEFT,
    leftIndent=20,
    spaceBefore=3,
    spaceAfter=3
)

# Estilo para destacados
highlight_style = ParagraphStyle(
    name='Highlight',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    backColor=colors.HexColor('#E6F0FA'),
    borderPadding=10,
    spaceBefore=10,
    spaceAfter=10
)

# Estilo para tabla header
table_header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.white
)

# Estilo para tabla cells
table_cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=10,
    leading=13,
    alignment=TA_LEFT
)

table_cell_center = ParagraphStyle(
    name='TableCellCenter',
    fontName='Times New Roman',
    fontSize=10,
    leading=13,
    alignment=TA_CENTER
)

story = []

# === PORTADA ===
story.append(Spacer(1, 100))
story.append(Paragraph("<b>ANALISIS COMPLETO</b>", title_style))
story.append(Spacer(1, 20))
story.append(Paragraph("Aplicacion de Procesos Disciplinarios", subtitle_style))
story.append(Paragraph("Para Cooperativa de Transporte de Pasajeros Urbano", subtitle_style))
story.append(Spacer(1, 60))
story.append(Paragraph("Documento de Analisis y Propuesta Tecnica", ParagraphStyle(
    name='CoverInfo',
    fontName='Times New Roman',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 30))
story.append(Paragraph("Fecha: Marzo 2026", ParagraphStyle(
    name='CoverDate',
    fontName='Times New Roman',
    fontSize=12,
    leading=16,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#888888')
)))
story.append(PageBreak())

# === CONTENIDO PRINCIPAL ===

# 1. RESUMEN EJECUTIVO
story.append(Paragraph("<b>1. RESUMEN EJECUTIVO</b>", h1_style))
story.append(Spacer(1, 8))

exec_summary = """
Este documento presenta un analisis completo para el desarrollo de una aplicacion de gestion de procesos disciplinarios 
para una Cooperativa de transporte de pasajeros urbano en Colombia. La aplicacion buscara digitalizar y automatizar 
el registro, seguimiento y gestion de procesos disciplinarios tanto para empleados (conductores, despachadores, 
lideres de proceso y gerencia) como para propietarios (asociados y afiliados), incorporando inteligencia artificial 
para el analisis de faltas y garantizando el debido proceso en todas las etapas.
"""
story.append(Paragraph(exec_summary, body_style))

key_findings = """
El analisis revela que existen soluciones comerciales en el mercado colombiano como Heinsohn, DocManager, SIGHSAS y 
Softland que ofrecen modulos de procesos disciplinarios, pero ninguna se adapta completamente a las necesidades 
especificas de una cooperativa de transporte con la estructura organizacional particular de este cliente. 
Se recomienda desarrollar una solucion a medida utilizando tecnologias modernas de desarrollo web con integracion 
de IA, aprovechando la experiencia previa del usuario con Google Apps Script pero evolucionando hacia una plataforma 
mas robusta y escalable.
"""
story.append(Paragraph(key_findings, body_style))
story.append(Spacer(1, 12))

# 2. ANALISIS DE LA NECESIDAD
story.append(Paragraph("<b>2. ANALISIS DETALLADO DE LA NECESIDAD</b>", h1_style))
story.append(Spacer(1, 8))

# 2.1 Contexto Organizacional
story.append(Paragraph("<b>2.1 Contexto Organizacional</b>", h2_style))

context_text = """
La Cooperativa de transporte de pasajeros urbano presenta una estructura organizacional dual que requiere un 
tratamiento diferenciado en materia disciplinaria. Por un lado, se encuentran los empleados vinculados mediante 
contrato laboral (conductores, despachadores, lideres de proceso y gerencia), sujetos al regimen laboral colombiano 
establecido en el Codigo Sustantivo de Trabajo. Por otro lado, estan los propietarios (asociados y afiliados) que, 
aunque no mantienen una relacion laboral directa con la cooperativa, deben cumplir con normas internas derivadas 
del Estatuto, el programa de etica y transparencia empresarial, y el codigo de buen gobierno.
"""
story.append(Paragraph(context_text, body_style))

roles_text = """
Esta dualidad organizacional implica la necesidad de manejar dos regimenes disciplinarios diferenciados, cada uno 
con sus propios documentos normativos de referencia, procedimientos aplicables y tipos de sanciones. La aplicacion 
debe ser capaz de identificar automaticamente el regimen aplicable segun el rol del indiciado y aplicar las normas 
correspondientes de manera consistente y documentada.
"""
story.append(Paragraph(roles_text, body_style))
story.append(Spacer(1, 10))

# Tabla de roles
roles_data = [
    [Paragraph('<b>Grupo</b>', table_header_style), 
     Paragraph('<b>Rol</b>', table_header_style), 
     Paragraph('<b>Regimen Aplicable</b>', table_header_style),
     Paragraph('<b>Documentos Base</b>', table_header_style)],
    [Paragraph('Empleados', table_cell_style), 
     Paragraph('Conductores', table_cell_style), 
     Paragraph('Laboral', table_cell_center),
     Paragraph('CST, RIT, PESV, PSST', table_cell_style)],
    [Paragraph('Empleados', table_cell_style), 
     Paragraph('Despachadores', table_cell_style), 
     Paragraph('Laboral', table_cell_center),
     Paragraph('CST, RIT, Perfil Cargo', table_cell_style)],
    [Paragraph('Empleados', table_cell_style), 
     Paragraph('Lideres de Proceso', table_cell_style), 
     Paragraph('Laboral', table_cell_center),
     Paragraph('CST, RIT, Contrato', table_cell_style)],
    [Paragraph('Empleados', table_cell_style), 
     Paragraph('Gerencia', table_cell_style), 
     Paragraph('Laboral', table_cell_center),
     Paragraph('CST, RIT, Contrato', table_cell_style)],
    [Paragraph('Propietarios', table_cell_style), 
     Paragraph('Asociados', table_cell_style), 
     Paragraph('Cooperativo', table_cell_center),
     Paragraph('Estatuto, Codigo Buen Gobierno', table_cell_style)],
    [Paragraph('Propietarios', table_cell_style), 
     Paragraph('Afiliados', table_cell_style), 
     Paragraph('Cooperativo', table_cell_center),
     Paragraph('Programa Etica, Estatuto', table_cell_style)],
]

roles_table = Table(roles_data, colWidths=[2.5*cm, 3.5*cm, 2.5*cm, 5*cm])
roles_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(roles_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 1.</b> Estructura de roles y regimenes aplicables", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=10,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 15))

# 2.2 Flujo del Proceso Disciplinario
story.append(Paragraph("<b>2.2 Flujo del Proceso Disciplinario Propuesto</b>", h2_style))

flujo_text = """
El proceso disciplinario que se busca implementar sigue una estructura de dos instancias con multiples puntos de 
interaccion entre el indiciado y los responsables del proceso. Esta estructura garantiza el derecho a la defensa 
y el debido proceso, permitiendo que el indiciado presente sus descargos en cada etapa y tenga la oportunidad 
de apelar las decisiones adversas. A continuacion se detalla el flujo completo del proceso:
"""
story.append(Paragraph(flujo_text, body_style))

# Etapas del proceso
etapas = [
    ("<b>Etapa 1 - Inicio del Proceso:</b> Se registra el encabezado con los datos del indiciado, fecha del suceso, descripcion de los hechos y responsable del proceso. El sistema genera un codigo QR con la informacion basica del caso que puede ser enviado por WhatsApp al indiciado.",),
    ("<b>Etapa 2 - Analisis con IA:</b> Un agente de inteligencia artificial analiza el suceso comparandolo con los documentos normativos del repositorio correspondiente segun el rol del indiciado. El sistema identifica la falta cometida, los articulos y normas vulneradas, y genera un informe preliminar.",),
    ("<b>Etapa 3 - Descargos:</b> El indiciado recibe un enlace por WhatsApp para acceder al sistema y presentar sus descargos por escrito. En esta etapa debe adjuntar foto frontal de su cedula para verificacion de identidad y firmar digitalmente con el dedo en el dispositivo movil.",),
    ("<b>Etapa 4 - Decision de Primera Instancia:</b> El responsable del proceso analiza los descargos, la falta identificada, las normas incumplidas, los agravantes y atenuantes, y emite una decision que puede ser: absolver, sancionar con reconvencion escrita, amonestacion economica, o suspension por determinado numero de dias.",),
    ("<b>Etapa 5 - Notificacion y Apelacion:</b> Se notifica al indiciado la decision de primera instancia. Si hay sancion, el indiciado puede solicitar reconsideracion y apelacion, presentando nuevos argumentos en un cuadro de texto habilitado para tal fin.",),
    ("<b>Etapa 6 - Segunda Instancia:</b> En caso de apelacion, el Comite de Apelaciones analiza todo el caso y emite una decision definitiva: absolver, confirmar la sancion, o modificarla (pudiendo incrementar o disminuir la sancion). Esta decision es definitiva y solo se notifica al indiciado.",),
]

for etapa in etapas:
    story.append(Paragraph("    " + etapa[0], list_style))
story.append(Spacer(1, 12))

# 2.3 Requerimientos Funcionales
story.append(Paragraph("<b>2.3 Requerimientos Funcionales Identificados</b>", h2_style))

req_text = """
Del analisis de la necesidad expresada por el usuario, se han identificado los siguientes requerimientos funcionales 
que la aplicacion debe cumplir para satisfacer completamente las expectativas del cliente. Estos requerimientos 
han sido organizados por modulos y priorizados segun su criticidad para el funcionamiento del sistema:
"""
story.append(Paragraph(req_text, body_style))

# Tabla de requerimientos
req_data = [
    [Paragraph('<b>Modulo</b>', table_header_style), 
     Paragraph('<b>Requerimiento</b>', table_header_style), 
     Paragraph('<b>Prioridad</b>', table_header_style)],
    [Paragraph('Registro', table_cell_style), 
     Paragraph('Encabezado con datos del indiciado, rol, fecha, descripcion y responsable', table_cell_style), 
     Paragraph('Alta', table_cell_center)],
    [Paragraph('IA', table_cell_style), 
     Paragraph('Analisis automatico de faltas contra documentos normativos', table_cell_style), 
     Paragraph('Alta', table_cell_center)],
    [Paragraph('Comunicacion', table_cell_style), 
     Paragraph('Generacion de codigo QR y envio de enlaces por WhatsApp', table_cell_style), 
     Paragraph('Alta', table_cell_center)],
    [Paragraph('Interaccion', table_cell_style), 
     Paragraph('Formulario de descargos con captura de firma y foto de cedula', table_cell_style), 
     Paragraph('Alta', table_cell_center)],
    [Paragraph('Decisiones', table_cell_style), 
     Paragraph('Registro de decisiones en primera y segunda instancia', table_cell_style), 
     Paragraph('Alta', table_cell_center)],
    [Paragraph('Historial', table_cell_style), 
     Paragraph('Registro completo del historial del caso con todas las variables', table_cell_style), 
     Paragraph('Media', table_cell_center)],
    [Paragraph('Informes', table_cell_style), 
     Paragraph('Estadisticas por persona, falta y tipo de decision', table_cell_style), 
     Paragraph('Media', table_cell_center)],
    [Paragraph('Documentos', table_cell_style), 
     Paragraph('Repositorio de documentos normativos por regimen', table_cell_style), 
     Paragraph('Alta', table_cell_center)],
]

req_table = Table(req_data, colWidths=[2.5*cm, 9*cm, 2*cm])
req_table.setStyle(TableStyle([
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
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(req_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 2.</b> Requerimientos funcionales identificados", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=10,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 15))

# 3. SOLUCIONES EXISTENTES EN EL MERCADO
story.append(Paragraph("<b>3. SOLUCIONES EXISTENTES EN EL MERCADO</b>", h1_style))
story.append(Spacer(1, 8))

market_intro = """
Se realizo una investigacion exhaustiva de las soluciones disponibles en el mercado colombiano para la gestion 
de procesos disciplinarios. A continuacion se presenta un analisis comparativo de las principales opciones 
identificadas, evaluando sus fortalezas, debilidades y nivel de ajuste a las necesidades especificas de la 
cooperativa de transporte:
"""
story.append(Paragraph(market_intro, body_style))

# 3.1 Heinsohn
story.append(Paragraph("<b>3.1 Heinsohn - Software de Talento Humano</b>", h2_style))
heinsohn_text = """
Heinsohn es una de las empresas lideres en Colombia en soluciones de software empresarial, ofreciendo un modulo 
especifico para la gestion de procesos disciplinarios dentro de su suite de talento humano. Su solucion permite 
el registro y seguimiento de procesos disciplinarios, desvinculacion, y administracion de la estructura 
organizacional. La plataforma esta disenada para medianas y grandes empresas, con integracion a nomina y otros 
modulos de RRHH. Sin embargo, su enfoque generalista no contempla las particularidades del sector transporte 
ni la estructura dual empleado-propietario que caracteriza a las cooperativas. Ademas, no incorpora funcionalidades 
de inteligencia artificial para analisis de faltas, lo cual es un requerimiento critico para el cliente.
"""
story.append(Paragraph(heinsohn_text, body_style))

# 3.2 DocManager
story.append(Paragraph("<b>3.2 DocManager - Gestion de Talento Humano</b>", h2_style))
docmanager_text = """
DocManager ofrece una solucion de gestion documental con modulos especializados para talento humano, incluyendo 
la gestion de procesos disciplinarios. Su fortaleza radica en la capacidad de gestionar documentacion y mantener 
un historial organizado de cada caso. La plataforma permite escalar procesos y comunicar decisiones de manera 
eficiente. No obstante, carece de funcionalidades avanzadas como analisis automatizado con IA, generacion de 
codigos QR para notificacion, y captura de firma digital desde dispositivos moviles. Su modelo esta orientado 
a empresas tradicionales con relaciones laborales estandar.
"""
story.append(Paragraph(docmanager_text, body_style))

# 3.3 SIGHSAS
story.append(Paragraph("<b>3.3 SIGHSAS - Procesos Disciplinarios</b>", h2_style))
sighsas_text = """
SIGHSAS ofrece un modulo especializado para el seguimiento de procesos disciplinarios desde su inicio hasta 
su finalizacion, incluyendo el cumplimiento de las medidas disciplinarias. Esta solucion esta disenada 
especificamente para el sector salud, aunque su logica puede adaptarse a otros sectores. Permite un seguimiento 
detallado de cada etapa del proceso y genera informes de gestion. Su principal limitacion es la falta de 
integracion con canales de comunicacion modernos como WhatsApp y la ausencia de capacidades de IA para el 
analisis normativo automatizado.
"""
story.append(Paragraph(sighsas_text, body_style))

# 3.4 KaleidoTrans
story.append(Paragraph("<b>3.4 KaleidoTrans - Software para Cooperativas de Transporte</b>", h2_style))
kaleido_text = """
KaleidoTrans es una solucion especializada para cooperativas de transporte que permite gestionar viajes, socios, 
documentacion, facturacion y pagos desde una unica plataforma. Es la unica solucion identificada que entiende 
la naturaleza especifica de las cooperativas de transporte. Sin embargo, no cuenta con un modulo especifico 
para procesos disciplinarios, por lo que este aspecto deberia desarrollarse como una funcionalidad adicional 
o integrarse con otra solucion. Tampoco incorpora capacidades de inteligencia artificial.
"""
story.append(Paragraph(kaleido_text, body_style))

# Tabla comparativa
story.append(Paragraph("<b>3.5 Comparativa de Soluciones</b>", h2_style))

comp_data = [
    [Paragraph('<b>Solucion</b>', table_header_style), 
     Paragraph('<b>Especialidad</b>', table_header_style), 
     Paragraph('<b>IA</b>', table_header_style),
     Paragraph('<b>WhatsApp</b>', table_header_style),
     Paragraph('<b>Ajuste</b>', table_header_style)],
    [Paragraph('Heinsohn', table_cell_style), 
     Paragraph('RRHH General', table_cell_style), 
     Paragraph('No', table_cell_center),
     Paragraph('No', table_cell_center),
     Paragraph('Bajo', table_cell_center)],
    [Paragraph('DocManager', table_cell_style), 
     Paragraph('Documental', table_cell_style), 
     Paragraph('No', table_cell_center),
     Paragraph('No', table_cell_center),
     Paragraph('Bajo', table_cell_center)],
    [Paragraph('SIGHSAS', table_cell_style), 
     Paragraph('Sector Salud', table_cell_style), 
     Paragraph('No', table_cell_center),
     Paragraph('No', table_cell_center),
     Paragraph('Bajo', table_cell_center)],
    [Paragraph('KaleidoTrans', table_cell_style), 
     Paragraph('Transporte', table_cell_style), 
     Paragraph('No', table_cell_center),
     Paragraph('No', table_cell_center),
     Paragraph('Medio', table_cell_center)],
    [Paragraph('Solucion a Medida', table_cell_style), 
     Paragraph('Personalizada', table_cell_style), 
     Paragraph('Si', table_cell_center),
     Paragraph('Si', table_cell_center),
     Paragraph('Alto', table_cell_center)],
]

comp_table = Table(comp_data, colWidths=[3*cm, 3*cm, 2*cm, 2.5*cm, 2*cm])
comp_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#D5E8D4')),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(comp_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 3.</b> Comparativa de soluciones existentes vs solucion a medida", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=10,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 15))

# 4. ANALISIS TECNOLOGICO
story.append(Paragraph("<b>4. ANALISIS TECNOLOGICO Y RECOMENDACION</b>", h1_style))
story.append(Spacer(1, 8))

tech_intro = """
Considerando que el usuario tiene experiencia previa con Google Apps Script y ha desarrollado aplicaciones 
sencillas pero funcionales utilizando Google Sheets como base de datos y Google Drive para almacenamiento 
de archivos, es importante evaluar las diferentes opciones tecnologicas disponibles y determinar cual 
se ajusta mejor a las necesidades del proyecto. A continuacion se presenta un analisis comparativo detallado:
"""
story.append(Paragraph(tech_intro, body_style))

# 4.1 Opcion A: Google Apps Script
story.append(Paragraph("<b>4.1 Opcion A: Google Apps Script (Plataforma Actual)</b>", h2_style))
gas_text = """
Google Apps Script es una plataforma de desarrollo basada en la nube que permite crear aplicaciones que se 
integran nativamente con los servicios de Google Workspace. Esta opcion aprovecha la experiencia previa del 
usuario y utiliza herramientas con las que ya esta familiarizado. La base de datos se gestionaria en Google 
Sheets, el almacenamiento de archivos (fotos, firmas, documentos) en Google Drive, y la interfaz de usuario 
se construiria con HTML/CSS/JavaScript servido desde Apps Script.
"""
story.append(Paragraph(gas_text, body_style))

gas_advantages = """
Las ventajas de esta opcion incluyen: costo minimo de implementacion (solo se requiere licencia de Google 
Workspace que probablemente ya poseen), curva de aprendizaje baja dado el conocimiento previo del usuario, 
integracion nativa con Gmail para notificaciones, Google Drive para archivos, y facilidad de mantenimiento. 
Ademas, permite colaboracion en tiempo real y acceso desde cualquier dispositivo con navegador web.
"""
story.append(Paragraph(gas_advantages, body_style))

gas_disadvantages = """
Sin embargo, esta opcion presenta limitaciones significativas: la integracion con inteligencia artificial 
requeriria llamadas a APIs externas (como la API de OpenAI o Gemini) lo cual complejiza el desarrollo 
y genera costos adicionales. El envio de mensajes por WhatsApp requiere la integracion con la API de 
WhatsApp Business, que tiene un costo mensual. Google Sheets tiene limitaciones de rendimiento cuando 
la cantidad de registros crece significativamente. La captura de firma digital y la generacion de codigos 
QR son posibles pero requieren codigo JavaScript adicional. Finalmente, la interfaz de usuario estaria 
limitada a lo que se puede construir con HTML servido desde Apps Script, sin las ventajas de frameworks 
modernos de desarrollo frontend.
"""
story.append(Paragraph(gas_disadvantages, body_style))

# 4.2 Opcion B: Desarrollo Web Profesional
story.append(Paragraph("<b>4.2 Opcion B: Desarrollo Web Profesional (Next.js)</b>", h2_style))
nextjs_text = """
La segunda opcion consiste en desarrollar una aplicacion web profesional utilizando tecnologias modernas 
como Next.js (un framework de React para desarrollo web full-stack), con una base de datos real como 
PostgreSQL o MongoDB, y un sistema de archivos optimizado para el almacenamiento de evidencias. Esta 
opcion representaria un salto cualitativo importante en terminos de capacidades y profesionalizacion 
del sistema.
"""
story.append(Paragraph(nextjs_text, body_style))

nextjs_advantages = """
Las ventajas de esta opcion son considerables: permite una integracion nativa y robusta con servicios de 
inteligencia artificial, incluyendo la posibilidad de utilizar modelos como GPT-4 o Claude para el analisis 
normativo automatizado. La interfaz de usuario puede ser moderna, responsiva y optimizada para dispositivos 
moviles, crucial considerando que los indiciados accederan desde sus telefonos para presentar descargos. 
El rendimiento es superior especialmente cuando la base de datos crece. Existen librerias especializadas 
para todo tipo de funcionalidades: generacion de QR, captura de firma digital, envio de mensajes por 
WhatsApp, generacion de documentos PDF, entre otras.
"""
story.append(Paragraph(nextjs_advantages, body_style))

nextjs_disadvantages = """
Las desventajas de esta opcion incluyen: requiere de un servidor de hosting (aunque existen opciones 
gratuitas generosas como Vercel o Railway), una curva de aprendizaje mas pronunciada si el usuario 
desea mantener el sistema por si mismo, y un costo operativo mensual por el hosting y los servicios 
de IA (aunque estos pueden ser moderados si se utilizan eficientemente). Tambien requiere una mayor 
inversion inicial de tiempo en el desarrollo comparado con la solucion basada en Apps Script.
"""
story.append(Paragraph(nextjs_disadvantages, body_style))

# 4.3 Opcion Hibrida
story.append(Paragraph("<b>4.3 Opcion C: Solucion Hibrida Recomendada</b>", h2_style))
hybrid_text = """
Considerando el perfil del usuario y las necesidades del proyecto, se recomienda una solucion hibrida 
que combine lo mejor de ambos mundos. Esta propuesta aprovecha la familiaridad del usuario con el 
ecosistema Google para el almacenamiento de documentos y algunas funcionalidades basicas, mientras 
incorpora tecnologias modernas para las capacidades criticas como el analisis con IA y la experiencia 
de usuario movil optimizada.
"""
story.append(Paragraph(hybrid_text, body_style))

hybrid_details = """
La arquitectura propuesta consistiria en: (1) Una aplicacion web desarrollada con Next.js como frontend 
principal, ofreciendo una experiencia de usuario moderna y optimizada para moviles, con captura de firma 
digital, carga de fotos y formularios responsivos. (2) Integracion con un servicio de IA (como el SDK de 
Z.ai que ya esta disponible) para el analisis automatizado de faltas contra los documentos normativos. 
(3) Almacenamiento en Google Drive para los documentos normativos (repositorio) y las evidencias de cada 
caso (fotos, firmas), aprovechando que el usuario ya tiene familiaridad con esta herramienta. (4) Base de 
datos en un sistema moderno (SQLite o PostgreSQL) para el registro estructurado de casos, decisiones y 
estadisticas. (5) Integracion con WhatsApp Business API para el envio de notificaciones y codigos QR a 
los indiciados.
"""
story.append(Paragraph(hybrid_details, body_style))
story.append(Spacer(1, 12))

# Tabla comparativa tecnologica
tech_data = [
    [Paragraph('<b>Aspecto</b>', table_header_style), 
     Paragraph('<b>Apps Script</b>', table_header_style), 
     Paragraph('<b>Next.js</b>', table_header_style),
     Paragraph('<b>Hibrida</b>', table_header_style)],
    [Paragraph('Costo inicial', table_cell_style), 
     Paragraph('Muy bajo', table_cell_center), 
     Paragraph('Medio', table_cell_center),
     Paragraph('Medio', table_cell_center)],
    [Paragraph('Costo mensual', table_cell_style), 
     Paragraph('Bajo', table_cell_center), 
     Paragraph('Medio', table_cell_center),
     Paragraph('Medio', table_cell_center)],
    [Paragraph('Integracion IA', table_cell_style), 
     Paragraph('Compleja', table_cell_center), 
     Paragraph('Nativa', table_cell_center),
     Paragraph('Nativa', table_cell_center)],
    [Paragraph('UX Movil', table_cell_style), 
     Paragraph('Limitada', table_cell_center), 
     Paragraph('Excelente', table_cell_center),
     Paragraph('Excelente', table_cell_center)],
    [Paragraph('Firma digital', table_cell_style), 
     Paragraph('Posible', table_cell_center), 
     Paragraph('Nativa', table_cell_center),
     Paragraph('Nativa', table_cell_center)],
    [Paragraph('WhatsApp', table_cell_style), 
     Paragraph('Manual', table_cell_center), 
     Paragraph('Automatizado', table_cell_center),
     Paragraph('Automatizado', table_cell_center)],
    [Paragraph('Mantenimiento', table_cell_style), 
     Paragraph('Facil', table_cell_center), 
     Paragraph('Requiere conocimientos', table_cell_center),
     Paragraph('Moderado', table_cell_center)],
    [Paragraph('Escalabilidad', table_cell_style), 
     Paragraph('Limitada', table_cell_center), 
     Paragraph('Alta', table_cell_center),
     Paragraph('Alta', table_cell_center)],
    [Paragraph('Curva aprendizaje', table_cell_style), 
     Paragraph('Baja', table_cell_center), 
     Paragraph('Alta', table_cell_center),
     Paragraph('Media', table_cell_center)],
]

tech_table = Table(tech_data, colWidths=[3.5*cm, 3*cm, 3*cm, 3*cm])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
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
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(tech_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Tabla 4.</b> Comparativa de opciones tecnologicas", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=10,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 15))

# 5. SUGERENCIAS Y MEJORAS
story.append(Paragraph("<b>5. SUGERENCIAS Y MEJORAS PROPUESTAS</b>", h1_style))
story.append(Spacer(1, 8))

mejoras_intro = """
Basandose en el analisis de las necesidades del usuario y las mejores practicas del sector, se proponen 
las siguientes mejoras y funcionalidades adicionales que agregarian valor significativo a la aplicacion 
de procesos disciplinarios:
"""
story.append(Paragraph(mejoras_intro, body_style))

# 5.1 Mejoras Tecnicas
story.append(Paragraph("<b>5.1 Mejoras Tecnicas Propuestas</b>", h2_style))

tech_improvements = """
<b>Panel de Control Dashboard:</b> Implementar un tablero de control principal que muestre en tiempo real 
el estado de todos los procesos disciplinarios: casos pendientes de descargos, casos en espera de decision, 
casos en apelacion, y casos cerrados. Este dashboard permitiria a los responsables del proceso tener una 
vision general inmediata de la carga de trabajo y los plazos pendientes, facilitando la gestion eficiente 
del tiempo y los recursos.
"""
story.append(Paragraph(tech_improvements, body_style))

tech_improvements2 = """
<b>Notificaciones Automaticas:</b> Implementar un sistema de notificaciones automaticas que alerte a los 
responsables cuando: (a) se acerca el vencimiento del plazo para presentar descargos, (b) un indiciado ha 
presentado sus descargos y el caso esta listo para decision, (c) se ha solicitado apelacion y requiere 
atencion del Comite de Apelaciones, (d) un caso ha superado los tiempos establecidos por la normativa 
aplicable sin que se haya tomado decision.
"""
story.append(Paragraph(tech_improvements2, body_style))

tech_improvements3 = """
<b>Generacion Automatica de Documentos:</b> Desarrollar plantillas automaticas para la generacion de los 
documentos formales del proceso: auto de apertura, notificacion de cargos, acta de descargos, resolucion 
de primera instancia, y resolucion de segunda instancia. Estos documentos podrian generarse en formato PDF 
con todos los datos del caso ya precargados, reduciendo significativamente el trabajo administrativo y 
asegurando consistencia en el formato y contenido de los documentos oficiales.
"""
story.append(Paragraph(tech_improvements3, body_style))

tech_improvements4 = """
<b>Integracion con NotebookLM:</b> Respecto a la pregunta sobre el repositorio de documentos, se recomienda 
utilizar una combinacion de Google Drive para almacenamiento fisico de los documentos y NotebookLM como 
capa de inteligencia para el analisis. NotebookLM es una herramienta de Google que permite subir documentos 
(PDFs, Google Docs, slides) y luego hacer preguntas sobre ellos utilizando IA. Esto permitiria que el agente 
de IA consulte los documentos normativos de manera mas eficiente y precisa. Se podrian crear dos notebooks 
separados: uno para empleados (con CST, RIT, PESV, PSST, perfiles de cargo, Codigo Nacional de Transito, 
contratos) y otro para propietarios (con Estatuto, programa de etica, codigo de buen gobierno).
"""
story.append(Paragraph(tech_improvements4, body_style))

# 5.2 Mejoras Funcionales
story.append(Paragraph("<b>5.2 Mejoras Funcionales Propuestas</b>", h2_style))

func_improvements = """
<b>Historial Disciplinario por Persona:</b> Implementar un modulo que permita consultar el historial 
disciplinario completo de cada persona (empleado o propietario), mostrando todos los procesos en los que 
ha estado involucrado, las faltas cometidas, las sanciones impuestas, y si ha sido reincidente en alguna 
falta especifica. Esto facilitaria la identificacion de patrones de comportamiento y la aplicacion de 
sanciones progresivas en casos de reincidencia.
"""
story.append(Paragraph(func_improvements, body_style))

func_improvements2 = """
<b>Matriz de Sanciones:</b> Desarrollar una matriz de sanciones sugeridas que, basandose en la falta 
identificada y el historial del indiciado, proponga al responsable del proceso un rango de sanciones 
aplicables segun la gravedad de la falta y las circunstancias atenuantes o agravantes. Esta matriz 
podria basarse en precedentes de casos anteriores y en las tablas de sanciones tipicas de la normativa 
aplicable.
"""
story.append(Paragraph(func_improvements2, body_style))

func_improvements3 = """
<b>Modulo de Capacitacion:</b> Considerar la integracion de un modulo de capacitacion que, cuando se 
sancione a una persona por una falta especifica, le asigne automaticamente un curso de capacitacion 
relacionado con la falta cometida. Por ejemplo, si un conductor es sancionado por una infraccion de 
transito, podria asignarsele un curso de seguridad vial. Esto transformaria el proceso disciplinario 
en una oportunidad de mejora y desarrollo.
"""
story.append(Paragraph(func_improvements3, body_style))

func_improvements4 = """
<b>Reportes y Estadisticas Avanzadas:</b> Implementar un modulo de informes que permita generar reportes 
personalizados con metricas como: numero de procesos por tipo de falta, tiempo promedio de resolucion, 
tasa de apelaciones, distribucion de sanciones por rol, comparativo mensual o anual de casos, y efectividad 
de las sanciones (medida por reincidencia). Estos informes podrian exportarse en diferentes formatos 
(PDF, Excel) para presentaciones a la gerencia o al Consejo de Administracion.
"""
story.append(Paragraph(func_improvements4, body_style))

# 5.3 Mejoras de Seguridad
story.append(Paragraph("<b>5.3 Mejoras de Seguridad y Cumplimiento</b>", h2_style))

security_improvements = """
<b>Registro de Auditoria:</b> Implementar un registro de auditoria que documente cada accion realizada 
en el sistema: quien accedio, que modifico, cuando lo hizo, y desde que dispositivo. Esto garantiza la 
trazabilidad completa de todas las acciones y proporciona evidencia en caso de que se cuestione la 
integridad del proceso. El registro de auditoria debe ser inmutable y almacenarse de forma segura.
"""
story.append(Paragraph(security_improvements, body_style))

security_improvements2 = """
<b>Control de Acceso por Roles:</b> Implementar un sistema de control de acceso basado en roles que 
limite las funcionalidades disponibles segun el perfil del usuario. Por ejemplo: (a) Los lideres de 
proceso solo pueden iniciar casos y ver los casos de su area, (b) Los miembros del Comite de Apelaciones 
solo pueden acceder a los casos que llegan a segunda instancia, (c) La gerencia tiene acceso a todos 
los casos y a los reportes estadisticos, (d) Los indiciados solo pueden acceder a sus propios casos 
y solo durante las etapas en las que se requiere su participacion.
"""
story.append(Paragraph(security_improvements2, body_style))

security_improvements3 = """
<b>Respaldo Automatico:</b> Configurar respaldos automaticos periodicos de toda la base de datos y 
los archivos almacenados. Los respaldos deben mantenerse en una ubicacion geograficamente separada 
para garantizar la recuperacion ante desastres. Se recomienda un esquema de respaldo diario con 
retencion de 30 dias para respaldos diarios, 12 meses para respaldos semanales, y 5 anos para 
respaldos mensuales.
"""
story.append(Paragraph(security_improvements3, body_style))
story.append(Spacer(1, 12))

# 6. RECOMENDACION FINAL
story.append(Paragraph("<b>6. RECOMENDACION FINAL</b>", h1_style))
story.append(Spacer(1, 8))

final_rec = """
Despues de analizar detalladamente las necesidades del usuario, las soluciones existentes en el mercado, 
y las opciones tecnologicas disponibles, se emite la siguiente recomendacion: Desarrollar una solucion 
a medida utilizando la arquitectura hibrida propuesta, la cual ofrece el mejor equilibrio entre 
funcionalidad, costo, y mantenibilidad para el perfil del cliente.
"""
story.append(Paragraph(final_rec, body_style))

final_rec2 = """
La solucion recomendada aprovecharia las ventajas de las tecnologias web modernas para la experiencia 
de usuario (especialmente critica en dispositivos moviles para los indiciados), la integracion nativa 
con servicios de IA para el analisis automatizado de faltas, y la familiaridad del usuario con el 
ecosistema Google para el almacenamiento de documentos. Esta combinacion permite desarrollar un sistema 
profesional, escalable y con todas las funcionalidades requeridas, sin perder de vista la realidad 
operativa del cliente.
"""
story.append(Paragraph(final_rec2, body_style))

final_rec3 = """
El desarrollo puede realizarse en fases, comenzando con las funcionalidades criticas (registro de casos, 
analisis basico con IA, descargos con firma digital, y decisiones de primera instancia) e incorporando 
progresivamente las funcionalidades avanzadas (WhatsApp, dashboard, informes, integracion con NotebookLM). 
Esto permite que el usuario comience a utilizar el sistema rapidamente y vaya adoptando las nuevas 
capacidades a medida que se desarrollan.
"""
story.append(Paragraph(final_rec3, body_style))

# Conclusión
story.append(Spacer(1, 15))
story.append(Paragraph("<b>Conclusion</b>", h2_style))
conclusion_text = """
El proyecto de desarrollo de la aplicacion de procesos disciplinarios es viable y responde a una necesidad 
real y bien definida. No existen soluciones comerciales en el mercado colombiano que se ajusten completamente 
a los requerimientos especificos de la cooperativa, particularmente en lo relacionado con la estructura dual 
empleado-propietario y la integracion de inteligencia artificial. La solucion propuesta permitira digitalizar 
y optimizar todo el ciclo del proceso disciplinario, garantizando transparencia, trazabilidad, y cumplimiento 
normativo, mientras se mejora la experiencia tanto de los responsables del proceso como de los indiciados. 
Se recomienda proceder con el desarrollo una vez se confirme la viabilidad tecnica de las integraciones 
propuestas (especialmente WhatsApp Business API y NotebookLM) y se establezca el presupuesto disponible 
para los costos operativos mensuales del sistema.
"""
story.append(Paragraph(conclusion_text, body_style))

# Construir PDF
doc.build(story)
print(f"PDF generado exitosamente: {output_path}")
