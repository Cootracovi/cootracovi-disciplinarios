import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - Registrar una decisión (1ra o 2da instancia)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: casoId } = await params;
    const data = await request.json();

    // Verificar que el caso existe
    const caso = await db.caso.findUnique({
      where: { id: casoId },
      include: { decisiones: true }
    });

    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    const instancia = data.instancia || 'PRIMERA';
    
    // Verificar si ya existe una decisión de esta instancia
    const decisionExistente = caso.decisiones.find(d => d.instancia === instancia);
    
    // Buscar o crear usuario responsable
    let usuario = await db.usuario.findFirst({
      where: { rol: data.rolResponsable || caso.rolResponsable }
    });
    
    if (!usuario) {
      usuario = await db.usuario.findFirst();
    }

    let decision;
    
    if (decisionExistente) {
      // Actualizar decisión existente
      decision = await db.decision.update({
        where: { id: decisionExistente.id },
        data: {
          tipoDecision: data.tipo,
          tipoSancion: data.tipoSancion || null,
          diasSuspension: data.diasSuspension || null,
          fundamentacion: data.fundamentacion,
        }
      });
    } else {
      // Crear nueva decisión
      decision = await db.decision.create({
        data: {
          casoId,
          instancia,
          tipoDecision: data.tipo,
          tipoSancion: data.tipoSancion || null,
          diasSuspension: data.diasSuspension || null,
          fundamentacion: data.fundamentacion,
          responsableId: usuario?.id || '',
        }
      });
    }

    // Actualizar estado del caso
    const updateData: Record<string, unknown> = {};
    
    if (instancia === 'PRIMERA') {
      updateData.estado = 'DECISION_1RA';
      updateData.etapaActual = 5;
      updateData.fechaDecision1 = new Date();
      
      // Agregar al historial
      await db.historialEtapa.create({
        data: {
          casoId,
          etapa: 5,
          nombreEtapa: 'Decisión de Primera Instancia',
          observacion: `Decisión: ${data.tipo}${data.tipoSancion ? ` - Sanción: ${data.tipoSancion}` : ''}`
        }
      });
    } else if (instancia === 'SEGUNDA') {
      updateData.estado = 'CERRADO';
      updateData.etapaActual = 8;
      updateData.fechaDecision2 = new Date();
      updateData.fechaCierre = new Date();
      
      await db.historialEtapa.create({
        data: {
          casoId,
          etapa: 7,
          nombreEtapa: 'Decisión de Segunda Instancia',
          observacion: `Decisión final: ${data.tipo}${data.tipoSancion ? ` - Sanción: ${data.tipoSancion}` : ''}`
        }
      });
      
      await db.historialEtapa.create({
        data: {
          casoId,
          etapa: 8,
          nombreEtapa: 'Caso Cerrado',
          observacion: 'Proceso disciplinario finalizado'
        }
      });
    }

    await db.caso.update({
      where: { id: casoId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      decision
    });
  } catch (error) {
    console.error('Error al registrar decisión:', error);
    return NextResponse.json({ error: 'Error al registrar la decisión' }, { status: 500 });
  }
}
