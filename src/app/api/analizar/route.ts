import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Documentos normativos simplificados (en producción vendrían de Google Drive)
const DOCUMENTOS_EMPLEADOS = `
REGLAMENTO INTERNO DE TRABAJO - FALTAS DISCIPLINARIAS

FALTAS LEVES:
- Llegar tarde al trabajo sin causa justificada (hasta 3 veces)
- No portar el uniforme completo
- Descuido en la presentación personal
- No informar cambio de domicilio

SANCIONES FALTAS LEVES:
- Amonestación verbal (primera vez)
- Reconvención escrita (segunda vez)
- Amonestación económica hasta 1 día de salario (tercera vez)

FALTAS GRAVES:
- Inasistencia injustificada al trabajo
- Abandono del puesto de trabajo
- Indisciplina o insubordinación
- Faltar a la verdad en asuntos del servicio
- Violación de normas de seguridad vial
- Uso de dispositivos electrónicos mientras conduce

SANCIONES FALTAS GRAVES:
- Suspensión de 2 a 8 días
- Amonestación económica de 2 a 5 días de salario

FALTAS GRAVISIMAS:
- Hurto o robo a la empresa o compañeros
- Fraude en el cumplimiento de funciones
- Acoso laboral o sexual
- Presentarse al trabajo en estado de embriaguez o bajo efectos de sustancias
- Violentar los sistemas de seguridad
- Causar accidente de tránsito por imprudencia temeraria
- Transportar personas o cargas no autorizadas

SANCIONES FALTAS GRAVISIMAS:
- Suspensión de 10 a 30 días
- Despido con justa causa

ATENUANTES:
- Confesión voluntaria de la falta
- Haber observado buena conducta anterior
- Haber sido provocado
- El grado de participación en la falta

AGRAVANTES:
- Reiteración de la falta
- Haber ocultado la falta
- Cometer la falta aprovechando la confianza depositada
- Cometer la falta en presencia de subalternos
- Causar daño a terceros
`;

const DOCUMENTOS_PROPIETARIOS = `
ESTATUTO DE LA COOPERATIVA - FALTAS DE LOS ASOCIADOS Y AFILIADOS

FALTAS LEVES:
- No asistir a asambleas sin excusa justificada
- No pagar las cuotas ordinarias en forma puntual
- No informar cambio de domicilio o datos de contacto

SANCIONES FALTAS LEVES:
- Llamado de atención verbal
- Llamado de atención escrito

FALTAS GRAVES:
- Incumplir las obligaciones derivadas del contrato de uso de ruta
- Realizar competencia desleal a la cooperativa
- Ceder el uso de la ruta a terceros no autorizados
- No acatar las decisiones de los órganos de administración

SANCIONES FALTAS GRAVES:
- Multa de 1 a 3 salarios mínimos diarios
- Suspensión del uso de la ruta hasta por 15 días

FALTAS GRAVISIMAS:
- Actos de violencia contra asociados o personal de la cooperativa
- Fraude en perjuicio de la cooperativa
- Conducta inmoral que afecte el prestigio de la cooperativa
- Incumplimiento reiterado de obligaciones económicas
- Utilizar la ruta para fines ilícitos

SANCIONES FALTAS GRAVISIMAS:
- Suspensión del uso de la ruta de 15 a 90 días
- Expulsión de la cooperativa

CÓDIGO DE BUEN GOBIERNO:
- Todos los asociados deben actuar con ética y transparencia
- Se prohíbe el conflicto de interés
- Se deben evitar conductas que afecten la imagen institucional

PROGRAMA DE ÉTICA Y TRANSPARENCIA:
- Los asociados deben reportar irregularidades
- Se prohíbe el acoso en cualquiera de sus formas
- Se debe mantener confidencialidad de información sensible
`;

export async function POST(request: NextRequest) {
  try {
    const { descripcion, grupo } = await request.json();

    if (!descripcion) {
      return NextResponse.json({ error: 'Descripción requerida' }, { status: 400 });
    }

    const documentos = grupo === 'PROPIETARIO' ? DOCUMENTOS_PROPIETARIOS : DOCUMENTOS_EMPLEADOS;
    const tipoGrupo = grupo === 'PROPIETARIO' ? 'propietario (asociado o afiliado)' : 'empleado';

    // Crear instancia de Z.ai
    const zai = await ZAI.create();

    // Realizar análisis con IA
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Eres un experto en derecho laboral colombiano y procesos disciplinarios de una cooperativa de transporte. 
Tu tarea es analizar la descripción de un suceso e identificar:
1. La falta cometida (específica)
2. La gravedad (LEVE, GRAVE o GRAVISIMA)
3. Los artículos o normas vulnerados
4. Posibles atenuantes
5. Posibles agravantes
6. Sanciones sugeridas

DOCUMENTOS NORMATIVOS APLICABLES:
${documentos}

Responde en formato JSON con esta estructura:
{
  "faltaIdentificada": "descripción de la falta",
  "gravedad": "LEVE|GRAVE|GRAVISIMA",
  "articulos": "artículos y normas vulnerados",
  "atenuantes": "posibles atenuantes si aplica",
  "agravantes": "posibles agravantes si aplica",
  "sancionesSugeridas": "sanciones sugeridas según la normativa"
}`
        },
        {
          role: 'user',
          content: `Analiza el siguiente caso de un ${tipoGrupo}:

DESCRIPCIÓN DEL SUCESO:
${descripcion}

Proporciona el análisis completo en formato JSON.`
        }
      ],
    });

    const respuesta = completion.choices[0]?.message?.content || '';
    
    // Intentar parsear la respuesta JSON
    let analisis;
    try {
      // Buscar el JSON en la respuesta
      const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analisis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON en la respuesta');
      }
    } catch {
      // Si no se puede parsear, usar valores por defecto
      analisis = {
        faltaIdentificada: 'Falta por determinar - requiere análisis manual',
        gravedad: 'GRAVE',
        articulos: 'Por verificar según el caso específico',
        atenuantes: 'Por evaluar',
        agravantes: 'Por evaluar',
        sancionesSugeridas: 'Por determinar según el proceso disciplinario aplicable',
      };
    }

    return NextResponse.json(analisis);

  } catch (error) {
    console.error('Error en análisis con IA:', error);
    
    // Devolver un análisis por defecto en caso de error
    return NextResponse.json({
      faltaIdentificada: 'Error en el análisis automático - requiere revisión manual',
      gravedad: 'POR_DETERMINAR',
      articulos: 'Verificar manualmente según la normativa aplicable',
      atenuantes: 'Por evaluar',
      agravantes: 'Por evaluar', 
      sancionesSugeridas: 'Requiere análisis manual por el responsable del proceso',
    });
  }
}
