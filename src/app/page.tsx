'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, Users, ClipboardList, BarChart3, Plus, Search, 
  Eye, Send, CheckCircle, Clock, AlertTriangle, ArrowRight,
  Scale, Gavel, FileSearch, Download, QrCode, User,
  History, Bell, Home, Camera, ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// ============== TIPOS ==============
type VistaPrincipal = 'dashboard' | 'nuevo-caso' | 'casos' | 'caso-detalle' | 'informes' | 'descargos';

interface Caso {
  id: number;
  numeroCaso: string;
  indiciadoId: number;
  indiciadoNombre: string;
  indiciadoIdentificacion: string;
  indiciadoRol: string;
  indiciadoGrupo: string;
  fechaSuceso: string;
  descripcionSuceso: string;
  faltaIdentificada: string | null;
  gravedadFalta: string | null;
  articulosVulnerados: string | null;
  estado: string;
  etapaActual: number;
  responsable: string;
  rolResponsable: string;
  fechaInicio: string;
  descargos: string | null;
  firmaDigital: string | null;
  fotoCedula: string | null;
  decision1: {
    tipo: string | null;
    tipoSancion: string | null;
    diasSuspension: number | null;
    fundamentacion: string | null;
  } | null;
  decision2: {
    tipo: string | null;
    tipoSancion: string | null;
    diasSuspension: number | null;
    fundamentacion: string | null;
  } | null;
  apelacionSolicitada: boolean;
  apelacionArgumentos: string | null;
}

interface Estadisticas {
  totalCasos: number;
  casosActivos: number;
  casosCerrados: number;
  pendientesDescargos: number;
  pendientesDecision: number;
  enApelacion: number;
  porRol: { rol: string; cantidad: number }[];
  porEstado: { estado: string; cantidad: number }[];
}

// ============== HELPERS ==============
function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

function getInitialAction(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('action');
}

// ============== COMPONENTE PRINCIPAL ==============
export default function Page() {
  // Determinar vista inicial basada en URL params
  const initialToken = useMemo(() => getInitialToken(), []);
  const initialAction = useMemo(() => getInitialAction(), []);
  
  const [vista, setVista] = useState<VistaPrincipal>(() => 
    (initialToken && initialAction === 'descargos') ? 'descargos' : 'dashboard'
  );
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [tokenAcceso] = useState<string | null>(() => initialToken);
  
  // Cargar datos iniciales
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const [resCasos, resStats] = await Promise.all([
          fetch('/api/casos'),
          fetch('/api/estadisticas')
        ]);
        
        if (mounted) {
          if (resCasos.ok) {
            const casosData = await resCasos.json();
            setCasos(casosData);
          }
          if (resStats.ok) {
            const statsData = await resStats.json();
            setEstadisticas(statsData);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
    
    return () => { mounted = false; };
  }, []);

  // Funciones de recarga
  const recargarDatos = async () => {
    try {
      const [resCasos, resStats] = await Promise.all([
        fetch('/api/casos'),
        fetch('/api/estadisticas')
      ]);
      
      if (resCasos.ok) {
        setCasos(await resCasos.json());
      }
      if (resStats.ok) {
        setEstadisticas(await resStats.json());
      }
    } catch (error) {
      console.error('Error al recargar datos:', error);
    }
  };

  const casosFiltrados = useMemo(() => casos.filter(caso => {
    const coincideBusqueda = 
      caso.numeroCaso.toLowerCase().includes(busqueda.toLowerCase()) ||
      caso.indiciadoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      caso.indiciadoIdentificacion.includes(busqueda);
    const coincideEstado = filtroEstado === 'todos' || caso.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  }), [casos, busqueda, filtroEstado]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.ibb.co/F4313WXS/LOGO-COOTRACOVI-ODS.jpg" 
                alt="COOTRACOVI" 
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900">COOTRACOVI</h1>
                <p className="text-xs text-slate-500">Sistema de Procesos Disciplinarios</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <Button 
                variant={vista === 'dashboard' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setVista('dashboard')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant={vista === 'nuevo-caso' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setVista('nuevo-caso')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Nuevo Caso
              </Button>
              <Button 
                variant={vista === 'casos' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setVista('casos')}
                className="gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                Casos
              </Button>
              <Button 
                variant={vista === 'informes' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setVista('informes')}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Informes
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {estadisticas?.pendientesDescargos || 0}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación móvil */}
      <nav className="md:hidden bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          <Button variant={vista === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setVista('dashboard')}>
            <Home className="h-4 w-4" />
          </Button>
          <Button variant={vista === 'nuevo-caso' ? 'default' : 'ghost'} size="sm" onClick={() => setVista('nuevo-caso')}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant={vista === 'casos' ? 'default' : 'ghost'} size="sm" onClick={() => setVista('casos')}>
            <ClipboardList className="h-4 w-4" />
          </Button>
          <Button variant={vista === 'informes' ? 'default' : 'ghost'} size="sm" onClick={() => setVista('informes')}>
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {vista === 'dashboard' && (
          <DashboardView 
            estadisticas={estadisticas} 
            casos={casos}
            onVerCaso={(caso) => { setCasoSeleccionado(caso); setVista('caso-detalle'); }}
            onNuevoCaso={() => setVista('nuevo-caso')}
          />
        )}
        
        {vista === 'nuevo-caso' && (
          <NuevoCasoView 
            onCancelar={() => setVista('dashboard')}
            onGuardar={(caso) => {
              recargarDatos();
              setCasoSeleccionado(caso);
              setVista('caso-detalle');
            }}
          />
        )}
        
        {vista === 'casos' && (
          <CasosView 
            casos={casosFiltrados}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            onVerCaso={(caso) => { setCasoSeleccionado(caso); setVista('caso-detalle'); }}
            onRecargar={recargarDatos}
          />
        )}
        
        {vista === 'caso-detalle' && casoSeleccionado && (
          <CasoDetailView 
            caso={casoSeleccionado}
            onVolver={() => setVista('casos')}
            onActualizar={(casoActualizado) => {
              recargarDatos();
              setCasoSeleccionado(casoActualizado);
            }}
          />
        )}
        
        {vista === 'informes' && (
          <InformesView estadisticas={estadisticas} casos={casos} />
        )}
        
        {vista === 'descargos' && tokenAcceso && (
          <DescargosView 
            token={tokenAcceso}
            onCompletado={() => {
              setVista('dashboard');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
            <p>© 2026 COOTRACOVI - Sistema de Procesos Disciplinarios</p>
            <p>Desarrollado con tecnología Z.ai</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============== DASHBOARD VIEW ==============
function DashboardView({ 
  estadisticas, 
  casos, 
  onVerCaso, 
  onNuevoCaso 
}: { 
  estadisticas: Estadisticas | null; 
  casos: Caso[];
  onVerCaso: (caso: Caso) => void;
  onNuevoCaso: () => void;
}) {
  const casosRecientes = casos.slice(0, 5);
  const casosPendientes = casos.filter(c => c.estado === 'PENDIENTE_DESCARGOS' || c.estado === 'CON_DESCARGOS');

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
          <p className="text-slate-500">Resumen de procesos disciplinarios</p>
        </div>
        <Button onClick={onNuevoCaso} className="gap-2">
          <Plus className="h-4 w-4" />
          Registrar Nuevo Caso
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription>Casos Totales</CardDescription>
            <CardTitle className="text-3xl">{estadisticas?.totalCasos ?? casos.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Histórico completo</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardDescription>Activos</CardDescription>
            <CardTitle className="text-3xl">{estadisticas?.casosActivos ?? casos.filter(c => c.estado !== 'CERRADO').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">En proceso</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardDescription>Pendientes</CardDescription>
            <CardTitle className="text-3xl">{estadisticas?.pendientesDescargos ?? casosPendientes.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Esperando acción</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription>Cerrados</CardDescription>
            <CardTitle className="text-3xl">{estadisticas?.casosCerrados ?? casos.filter(c => c.estado === 'CERRADO').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Resueltos</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido en dos columnas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Casos recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              Casos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {casosRecientes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay casos registrados</p>
                <Button onClick={onNuevoCaso} variant="outline" size="sm" className="mt-2">
                  Registrar primer caso
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {casosRecientes.map(caso => (
                  <div 
                    key={caso.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => onVerCaso(caso)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{caso.indiciadoNombre}</p>
                        <p className="text-xs text-slate-500">{caso.numeroCaso}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        caso.estado === 'CERRADO' ? 'default' :
                        caso.estado === 'PENDIENTE_DESCARGOS' ? 'destructive' :
                        caso.estado === 'CON_DESCARGOS' ? 'secondary' : 'outline'
                      }>
                        {caso.estado.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(caso.fechaInicio).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones pendientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            {casosPendientes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-50" />
                <p>¡Todo al día!</p>
                <p className="text-sm">No hay casos pendientes de atención</p>
              </div>
            ) : (
              <div className="space-y-3">
                {casosPendientes.slice(0, 5).map(caso => (
                  <div 
                    key={caso.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors"
                    onClick={() => onVerCaso(caso)}
                  >
                    <div>
                      <p className="font-medium text-sm">{caso.indiciadoNombre}</p>
                      <p className="text-xs text-slate-600">
                        {caso.estado === 'PENDIENTE_DESCARGOS' ? 'Esperando descargos' : 'Listo para decisión'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-600" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Flujo del proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Flujo del Proceso Disciplinario</CardTitle>
          <CardDescription>Etapas y estado actual de los casos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {[
              { etapa: 1, nombre: 'Inicio', icon: FileText },
              { etapa: 2, nombre: 'Análisis IA', icon: FileSearch },
              { etapa: 3, nombre: 'Notificación', icon: Send },
              { etapa: 4, nombre: 'Descargos', icon: ClipboardList },
              { etapa: 5, nombre: 'Decisión 1ª', icon: Gavel },
              { etapa: 6, nombre: 'Apelación', icon: Scale },
              { etapa: 7, nombre: 'Decisión 2ª', icon: Gavel },
              { etapa: 8, nombre: 'Cierre', icon: CheckCircle },
            ].map((item, idx) => (
              <div key={item.etapa} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 text-center">{item.nombre}</span>
                </div>
                {idx < 7 && <ArrowRight className="h-4 w-4 text-slate-300 mx-1 sm:mx-2 hidden sm:block" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== NUEVO CASO VIEW ==============
function NuevoCasoView({ 
  onCancelar, 
  onGuardar 
}: { 
  onCancelar: () => void; 
  onGuardar: (caso: Caso) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [analizando, setAnalizando] = useState(false);
  const [formData, setFormData] = useState({
    identificacion: '',
    nombreIndiciado: '',
    rolIndiciado: '',
    grupoIndiciado: '',
    fechaSuceso: new Date().toISOString().split('T')[0],
    descripcionSuceso: '',
    responsable: '',
    rolResponsable: '',
  });
  const [analisisIA, setAnalisisIA] = useState<{
    faltaIdentificada: string;
    gravedad: string;
    articulos: string;
    atenuantes: string;
    agravantes: string;
    sancionesSugeridas: string;
  } | null>(null);

  const rolesEmpleado = ['CONDUCTOR', 'DESPACHADOR', 'LIDER_PROCESO', 'GERENCIA'];
  const rolesPropietario = ['ASOCIADO', 'AFILIADO'];
  const rolesResponsable = ['LIDER_OPERACIONES', 'LIDER_GGRH', 'GERENCIA', 'CONSEJO_ADMINISTRACION', 'COMITE_APELACIONES'];

  const handleGrupoChange = (grupo: string) => {
    setFormData(prev => ({ 
      ...prev, 
      grupoIndiciado: grupo,
      rolIndiciado: ''
    }));
  };

  const analizarConIA = async () => {
    if (!formData.descripcionSuceso || !formData.grupoIndiciado) {
      toast({
        title: 'Información incompleta',
        description: 'Complete la descripción del suceso y seleccione el grupo del indiciado',
        variant: 'destructive',
      });
      return;
    }

    setAnalizando(true);
    try {
      const response = await fetch('/api/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: formData.descripcionSuceso,
          grupo: formData.grupoIndiciado,
        }),
      });

      if (response.ok) {
        const resultado = await response.json();
        setAnalisisIA(resultado);
        toast({
          title: 'Análisis completado',
          description: 'El agente de IA ha analizado el caso',
        });
      } else {
        throw new Error('Error en el análisis');
      }
    } catch {
      toast({
        title: 'Error en el análisis',
        description: 'No se pudo completar el análisis con IA. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setAnalizando(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.identificacion || !formData.nombreIndiciado || !formData.rolIndiciado ||
        !formData.grupoIndiciado || !formData.descripcionSuceso || !formData.responsable) {
      toast({
        title: 'Campos requeridos',
        description: 'Complete todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/casos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...analisisIA,
        }),
      });

      if (response.ok) {
        const nuevoCaso = await response.json();
        toast({
          title: 'Caso registrado',
          description: `El caso ${nuevoCaso.numeroCaso} ha sido creado exitosamente`,
        });
        onGuardar(nuevoCaso);
      } else {
        throw new Error('Error al guardar');
      }
    } catch {
      toast({
        title: 'Error al guardar',
        description: 'No se pudo registrar el caso. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          ← Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Registrar Nuevo Caso</h2>
          <p className="text-slate-500">Complete la información del proceso disciplinario</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Datos del Indiciado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-slate-400" />
              Datos del Indiciado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identificacion">ID / Cédula del Indiciado *</Label>
                <Input
                  id="identificacion"
                  value={formData.identificacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, identificacion: e.target.value }))}
                  placeholder="Número de documento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombreIndiciado}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombreIndiciado: e.target.value }))}
                  placeholder="Nombre completo del indiciado"
                />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grupo">Grupo *</Label>
                <Select value={formData.grupoIndiciado} onValueChange={handleGrupoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLEADO">Empleado</SelectItem>
                    <SelectItem value="PROPIETARIO">Propietario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select 
                  value={formData.rolIndiciado} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, rolIndiciado: val }))}
                  disabled={!formData.grupoIndiciado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.grupoIndiciado === 'EMPLEADO' ? rolesEmpleado : rolesPropietario).map(rol => (
                      <SelectItem key={rol} value={rol}>{rol.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos del Suceso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" />
              Datos del Suceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del Suceso *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fechaSuceso}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaSuceso: e.target.value }))}
                className="max-w-xs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción del Suceso *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcionSuceso}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcionSuceso: e.target.value }))}
                placeholder="Describa detalladamente los hechos ocurridos..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Responsable del Proceso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-400" />
              Responsable del Proceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsable">Nombre del Responsable *</Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rolResponsable">Rol del Responsable *</Label>
                <Select 
                  value={formData.rolResponsable} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, rolResponsable: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesResponsable.map(rol => (
                      <SelectItem key={rol} value={rol}>{rol.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análisis con IA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-500" />
              Análisis con Agente de IA
            </CardTitle>
            <CardDescription>
              El agente de IA analizará el suceso con base en los documentos normativos del repositorio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={analizarConIA}
              disabled={analizando || !formData.descripcionSuceso}
              className="w-full sm:w-auto"
            >
              {analizando ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  Analizando...
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4 mr-2" />
                  Analizar con IA
                </>
              )}
            </Button>

            {analisisIA && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                <h4 className="font-medium text-blue-900">Resultado del Análisis</h4>
                
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Falta Identificada:</span>
                    <p className="text-slate-600">{analisisIA.faltaIdentificada}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium text-slate-700">Gravedad:</span>
                      <Badge className="ml-2" variant={
                        analisisIA.gravedad === 'GRAVISIMA' ? 'destructive' :
                        analisisIA.gravedad === 'GRAVE' ? 'secondary' : 'outline'
                      }>
                        {analisisIA.gravedad}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Artículos:</span>
                      <p className="text-slate-600">{analisisIA.articulos}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium text-slate-700">Atenuantes:</span>
                      <p className="text-slate-600">{analisisIA.atenuantes || 'No identificados'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Agravantes:</span>
                      <p className="text-slate-600">{analisisIA.agravantes || 'No identificados'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Sanciones Sugeridas:</span>
                    <p className="text-slate-600">{analisisIA.sancionesSugeridas}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Registrar Caso
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============== CASOS VIEW ==============
function CasosView({ 
  casos, 
  busqueda, 
  setBusqueda, 
  filtroEstado, 
  setFiltroEstado, 
  onVerCaso,
  onRecargar 
}: { 
  casos: Caso[];
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroEstado: string;
  setFiltroEstado: (val: string) => void;
  onVerCaso: (caso: Caso) => void;
  onRecargar: () => void;
}) {
  const estados = [
    { value: 'todos', label: 'Todos' },
    { value: 'INICIADO', label: 'Iniciado' },
    { value: 'PENDIENTE_DESCARGOS', label: 'Pendiente Descargos' },
    { value: 'CON_DESCARGOS', label: 'Con Descargos' },
    { value: 'DECISION_1RA', label: 'Decisión 1ª Instancia' },
    { value: 'APELACION', label: 'En Apelación' },
    { value: 'DECISION_2DA', label: 'Decisión 2ª Instancia' },
    { value: 'CERRADO', label: 'Cerrado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lista de Casos</h2>
          <p className="text-slate-500">{casos.length} casos encontrados</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRecargar} className="gap-2">
          <History className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por número, nombre o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map(e => (
                  <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de casos */}
      <Card>
        <CardContent className="p-0">
          {casos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No se encontraron casos</p>
              <p className="text-sm">Intente con otros filtros de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">No. Caso</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Indiciado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {casos.map(caso => (
                    <tr key={caso.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-sm">{caso.numeroCaso}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{caso.indiciadoNombre}</p>
                          <p className="text-xs text-slate-500">ID: {caso.indiciadoIdentificacion}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{caso.indiciadoRol.replace(/_/g, ' ')}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(caso.fechaInicio).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          caso.estado === 'CERRADO' ? 'default' :
                          caso.estado === 'PENDIENTE_DESCARGOS' ? 'destructive' :
                          caso.estado === 'CON_DESCARGOS' ? 'secondary' : 'outline'
                        }>
                          {caso.estado.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" onClick={() => onVerCaso(caso)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============== CASO DETAIL VIEW ==============
function CasoDetailView({ 
  caso, 
  onVolver, 
  onActualizar 
}: { 
  caso: Caso;
  onVolver: () => void;
  onActualizar: (caso: Caso) => void;
}) {
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [decision, setDecision] = useState({
    tipo: '',
    tipoSancion: '',
    diasSuspension: 0,
    fundamentacion: '',
  });

  const etapas = [
    { num: 1, nombre: 'Inicio', completado: caso.etapaActual >= 1 },
    { num: 2, nombre: 'Análisis IA', completado: caso.etapaActual >= 2 },
    { num: 3, nombre: 'Notificación', completado: caso.etapaActual >= 3 },
    { num: 4, nombre: 'Descargos', completado: caso.etapaActual >= 4 },
    { num: 5, nombre: 'Decisión 1ª', completado: caso.etapaActual >= 5 },
    { num: 6, nombre: 'Apelación', completado: caso.etapaActual >= 6 || caso.apelacionSolicitada },
    { num: 7, nombre: 'Decisión 2ª', completado: caso.etapaActual >= 7 },
    { num: 8, nombre: 'Cierre', completado: caso.etapaActual >= 8 },
  ];

  const generarEnlace = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const token = typeof Buffer !== 'undefined' ? Buffer.from(caso.id).toString('base64') : btoa(caso.id);
    return `${baseUrl}?token=${token}&action=descargos`;
  };

  const copiarEnlace = () => {
    const enlace = generarEnlace();
    navigator.clipboard.writeText(enlace);
    toast({
      title: 'Enlace copiado',
      description: 'El enlace ha sido copiado al portapapeles',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onVolver}>
          ← Volver
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">{caso.numeroCaso}</h2>
            <Badge variant={
              caso.estado === 'CERRADO' ? 'default' :
              caso.estado === 'PENDIENTE_DESCARGOS' ? 'destructive' :
              caso.estado === 'CON_DESCARGOS' ? 'secondary' : 'outline'
            }>
              {caso.estado.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-slate-500">{caso.indiciadoNombre}</p>
        </div>
        
        {caso.etapaActual >= 2 && caso.etapaActual < 8 && (
          <Button variant="outline" onClick={() => setShowQRDialog(true)} className="gap-2">
            <QrCode className="h-4 w-4" />
            Generar Enlace
          </Button>
        )}
      </div>

      {/* Progreso del proceso */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progreso del Proceso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {etapas.map((etapa, idx) => (
              <div key={etapa.num} className="flex items-center min-w-[80px]">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    etapa.completado 
                      ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {etapa.completado ? <CheckCircle className="h-4 w-4" /> : etapa.num}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 text-center">{etapa.nombre}</span>
                </div>
                {idx < etapas.length - 1 && (
                  <div className={`h-1 w-8 mx-1 rounded ${
                    etapa.completado && etapas[idx + 1].completado ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del caso */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos del indiciado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-slate-400" />
                Datos del Indiciado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500 text-xs">ID / Cédula</Label>
                  <p className="font-medium">{caso.indiciadoIdentificacion}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs">Nombre</Label>
                  <p className="font-medium">{caso.indiciadoNombre}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs">Grupo</Label>
                  <p className="font-medium">{caso.indiciadoGrupo}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs">Rol</Label>
                  <Badge variant="outline">{caso.indiciadoRol.replace(/_/g, ' ')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción del suceso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                Descripción del Suceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{caso.descripcionSuceso}</p>
              <p className="text-sm text-slate-500 mt-2">
                Fecha del suceso: {new Date(caso.fechaSuceso).toLocaleDateString('es-CO')}
              </p>
            </CardContent>
          </Card>

          {/* Análisis de IA */}
          {caso.faltaIdentificada && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-blue-500" />
                  Análisis del Agente de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-500 text-xs">Falta Identificada</Label>
                    <p className="font-medium">{caso.faltaIdentificada}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Gravedad</Label>
                    <Badge variant={
                      caso.gravedadFalta === 'GRAVISIMA' ? 'destructive' :
                      caso.gravedadFalta === 'GRAVE' ? 'secondary' : 'outline'
                    }>
                      {caso.gravedadFalta}
                    </Badge>
                  </div>
                </div>
                {caso.articulosVulnerados && (
                  <div>
                    <Label className="text-slate-500 text-xs">Artículos Vulnerados</Label>
                    <p className="text-sm">{caso.articulosVulnerados}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Descargos */}
          {caso.descargos && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-slate-400" />
                  Descargos del Indiciado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{caso.descargos}</p>
                
                {/* Evidencias */}
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {caso.firmaDigital && (
                    <div>
                      <Label className="text-slate-500 text-xs">Firma Digital</Label>
                      <div className="mt-1 p-4 bg-slate-50 rounded-lg">
                        <img src={caso.firmaDigital} alt="Firma" className="h-20" />
                      </div>
                    </div>
                  )}
                  {caso.fotoCedula && (
                    <div>
                      <Label className="text-slate-500 text-xs">Foto de Cédula</Label>
                      <div className="mt-1 p-4 bg-slate-50 rounded-lg">
                        <img src={caso.fotoCedula} alt="Cédula" className="h-20 object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Decisiones */}
          {caso.decision1 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-blue-500" />
                  Decisión de Primera Instancia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={caso.decision1.tipo === 'ABSOLVER' ? 'default' : 'destructive'}>
                    {caso.decision1.tipo}
                  </Badge>
                  {caso.decision1.tipoSancion && (
                    <Badge variant="outline">{caso.decision1.tipoSancion.replace(/_/g, ' ')}</Badge>
                  )}
                  {caso.decision1.diasSuspension && (
                    <span className="text-sm text-slate-600">{caso.decision1.diasSuspension} días</span>
                  )}
                </div>
                {caso.decision1.fundamentacion && (
                  <p className="text-sm text-slate-600">{caso.decision1.fundamentacion}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Apelación */}
          {caso.apelacionSolicitada && caso.apelacionArgumentos && (
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-500" />
                  Apelación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{caso.apelacionArgumentos}</p>
              </CardContent>
            </Card>
          )}

          {caso.decision2 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-green-500" />
                  Decisión de Segunda Instancia (Definitiva)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={caso.decision2.tipo === 'ABSOLVER' ? 'default' : 'destructive'}>
                    {caso.decision2.tipo}
                  </Badge>
                  {caso.decision2.tipoSancion && (
                    <Badge variant="outline">{caso.decision2.tipoSancion.replace(/_/g, ' ')}</Badge>
                  )}
                  {caso.decision2.diasSuspension && (
                    <span className="text-sm text-slate-600">{caso.decision2.diasSuspension} días</span>
                  )}
                </div>
                {caso.decision2.fundamentacion && (
                  <p className="text-sm text-slate-600">{caso.decision2.fundamentacion}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna derecha - Acciones */}
        <div className="space-y-6">
          {/* Responsable */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Responsable del Proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{caso.responsable}</p>
              <p className="text-sm text-slate-500">{caso.rolResponsable.replace(/_/g, ' ')}</p>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Fechas del Proceso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Inicio:</span>
                <span>{new Date(caso.fechaInicio).toLocaleDateString('es-CO')}</span>
              </div>
              {caso.descargos && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Descargos:</span>
                  <span>Recibidos</span>
                </div>
              )}
              {caso.estado === 'CERRADO' && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Cierre:</span>
                  <span>Completado</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones disponibles según estado */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Acciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {caso.estado === 'CON_DESCARGOS' && !caso.decision1 && (
                <Button 
                  className="w-full" 
                  onClick={() => setShowDecisionDialog(true)}
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Emitir Decisión 1ª Instancia
                </Button>
              )}
              
              {caso.estado === 'CERRADO' && (
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF Completo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para decisión */}
      <Dialog open={showDecisionDialog} onOpenChange={setShowDecisionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Decisión</DialogTitle>
            <DialogDescription>
              Complete la información de la decisión
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Decisión</Label>
              <Select value={decision.tipo} onValueChange={(val) => setDecision(prev => ({ ...prev, tipo: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABSOLVER">Absolver</SelectItem>
                  <SelectItem value="SANCIONAR">Sancionar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {decision.tipo === 'SANCIONAR' && (
              <div className="space-y-2">
                <Label>Tipo de Sanción</Label>
                <Select value={decision.tipoSancion} onValueChange={(val) => setDecision(prev => ({ ...prev, tipoSancion: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECONVENCION">Reconvención Escrita</SelectItem>
                    <SelectItem value="AMONESTACION_ECONOMICA">Amonestación Económica</SelectItem>
                    <SelectItem value="SUSPENSION">Suspensión</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {decision.tipoSancion === 'SUSPENSION' && (
              <div className="space-y-2">
                <Label>Días de Suspensión</Label>
                <Input 
                  type="number" 
                  value={decision.diasSuspension}
                  onChange={(e) => setDecision(prev => ({ ...prev, diasSuspension: parseInt(e.target.value) || 0 }))}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Fundamentación</Label>
              <Textarea 
                value={decision.fundamentacion}
                onChange={(e) => setDecision(prev => ({ ...prev, fundamentacion: e.target.value }))}
                placeholder="Argumente la decisión..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDecisionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({ title: 'Decisión registrada', description: 'La decisión ha sido guardada' });
              setShowDecisionDialog(false);
            }}>
              Guardar Decisión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para QR */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enlace para el Indiciado</DialogTitle>
            <DialogDescription>
              Copie este enlace y envíelo por WhatsApp al indiciado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <QrCode className="h-32 w-32 mx-auto text-slate-400" />
              <p className="text-xs text-slate-500 mt-2">Escanee el código QR o use el enlace</p>
            </div>
            <div className="flex items-center gap-2">
              <Input value={generarEnlace()} readOnly className="text-xs" />
              <Button size="icon" onClick={copiarEnlace}>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Copy Icon
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

// ============== INFORMES VIEW ==============
function InformesView({ estadisticas, casos }: { estadisticas: Estadisticas | null; casos: Caso[] }) {
  const [periodo, setPeriodo] = useState('mes');

  const stats = useMemo(() => {
    const ahora = new Date();
    const casosPeriodo = casos.filter(c => {
      const fechaInicio = new Date(c.fechaInicio);
      if (periodo === 'mes') {
        return fechaInicio.getMonth() === ahora.getMonth() && fechaInicio.getFullYear() === ahora.getFullYear();
      } else if (periodo === 'anio') {
        return fechaInicio.getFullYear() === ahora.getFullYear();
      }
      return true;
    });

    const porRol: Record<string, number> = {};
    const porDecision: Record<string, number> = { ABSOLVER: 0, SANCIONAR: 0, CONFIRMAR: 0, MODIFICAR: 0 };
    
    casosPeriodo.forEach(caso => {
      porRol[caso.indiciadoRol] = (porRol[caso.indiciadoRol] || 0) + 1;
      if (caso.decision1?.tipo) {
        porDecision[caso.decision1.tipo]++;
      }
    });

    return {
      total: casosPeriodo.length,
      porRol: Object.entries(porRol).map(([rol, cantidad]) => ({ rol, cantidad })),
      porDecision: Object.entries(porDecision).filter(([_, v]) => v > 0).map(([tipo, cantidad]) => ({ tipo, cantidad })),
      tasaAbsolucion: casosPeriodo.length > 0 
        ? Math.round((porDecision.ABSOLVER / casosPeriodo.length) * 100) 
        : 0,
    };
  }, [casos, periodo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Informes y Estadísticas</h2>
          <p className="text-slate-500">Análisis de procesos disciplinarios</p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes">Este mes</SelectItem>
            <SelectItem value="anio">Este año</SelectItem>
            <SelectItem value="todo">Todo el historial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resumen */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Casos</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Absoluciones</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.porDecision.find(d => d.tipo === 'ABSOLVER')?.cantidad ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sanciones</CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.porDecision.find(d => d.tipo === 'SANCIONAR')?.cantidad ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasa Absolución</CardDescription>
            <CardTitle className="text-2xl">{stats.tasaAbsolucion}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Por Rol */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Casos por Rol</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.porRol.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay datos disponibles</p>
            ) : (
              <div className="space-y-3">
                {stats.porRol.map(({ rol, cantidad }) => (
                  <div key={rol} className="flex items-center justify-between">
                    <span className="text-sm">{rol.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(cantidad / stats.total) * 100} className="w-24 h-2" />
                      <span className="text-sm font-medium w-8">{cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Por Tipo de Decisión */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Por Tipo de Decisión</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.porDecision.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay decisiones registradas</p>
            ) : (
              <div className="space-y-3">
                {stats.porDecision.map(({ tipo, cantidad }) => (
                  <div key={tipo} className="flex items-center justify-between">
                    <span className="text-sm">{tipo}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(cantidad / stats.total) * 100} className="w-24 h-2" />
                      <span className="text-sm font-medium w-8">{cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exportar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exportar Informes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== DESCARGOS VIEW ==============
interface InfoCaso {
  casoId: string;
  numeroCaso: string;
  indiciadoNombre: string;
  indiciadoIdentificacion: string;
  fechaSuceso: string;
  descripcionSuceso: string;
  faltaIdentificada: string | null;
  gravedadFalta: string | null;
}

function DescargosView({ 
  token, 
  onCompletado 
}: { 
  token: string;
  onCompletado: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoCaso, setInfoCaso] = useState<InfoCaso | null>(null);
  const [descargos, setDescargos] = useState('');
  const [firma, setFirma] = useState<string | null>(null);
  const [fotoCedula, setFotoCedula] = useState<string | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Cargar información del caso
  useEffect(() => {
    const fetchCaso = async () => {
      try {
        const response = await fetch(`/api/verificar-token?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Error al cargar el caso');
          return;
        }
        
        setInfoCaso(data);
      } catch {
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchCaso();
    }
  }, [token]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoCedula(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!descargos || !firma || !fotoCedula || !aceptaTerminos) {
      toast({
        title: 'Información incompleta',
        description: 'Complete todos los campos y acepte los términos',
        variant: 'destructive',
      });
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch('/api/descargos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          descargos,
          firmaDigital: firma,
          fotoCedula,
          aceptaTerminos
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar');
      }
      
      toast({
        title: 'Descargos enviados',
        description: 'Sus descargos han sido registrados exitosamente',
      });
      onCompletado();
    } catch (err) {
      toast({
        title: 'Error al enviar',
        description: err instanceof Error ? err.message : 'No se pudieron enviar los descargos',
        variant: 'destructive',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <img 
          src="https://i.ibb.co/F4313WXS/LOGO-COOTRACOVI-ODS.jpg" 
          alt="COOTRACOVI" 
          className="h-16 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-slate-900">Formulario de Descargos</h1>
        <p className="text-slate-500">Proceso Disciplinario</p>
      </div>

      {/* Estado de carga */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500" />
            <p className="text-slate-500">Cargando información del caso...</p>
          </CardContent>
        </Card>
      )}

      {/* Estado de error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Información del caso */}
      {infoCaso && (
        <>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Información del Caso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">No. de Caso:</span>
                  <span className="font-medium ml-2">{infoCaso.numeroCaso}</span>
                </div>
                <div>
                  <span className="text-slate-500">Fecha del Suceso:</span>
                  <span className="font-medium ml-2">{new Date(infoCaso.fechaSuceso).toLocaleDateString('es-CO')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Nombre:</span>
                  <span className="font-medium ml-2">{infoCaso.indiciadoNombre}</span>
                </div>
                <div>
                  <span className="text-slate-500">Identificación:</span>
                  <span className="font-medium ml-2">{infoCaso.indiciadoIdentificacion}</span>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-slate-500 text-sm">Descripción del Suceso:</span>
                <p className="mt-1 text-slate-700">{infoCaso.descripcionSuceso}</p>
              </div>
              {infoCaso.faltaIdentificada && (
                <div className="bg-amber-100 p-3 rounded-lg">
                  <span className="text-amber-800 text-sm font-medium">Falta Identificada:</span>
                  <p className="mt-1 text-amber-900">{infoCaso.faltaIdentificada}</p>
                  {infoCaso.gravedadFalta && (
                    <Badge variant={infoCaso.gravedadFalta === 'GRAVISIMA' ? 'destructive' : infoCaso.gravedadFalta === 'GRAVE' ? 'secondary' : 'outline'} className="mt-2">
                      Gravedad: {infoCaso.gravedadFalta}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulario de descargos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mis Descargos</CardTitle>
              <CardDescription>
                Presente su defensa de manera clara y completa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Descargos *</Label>
                <Textarea
                  value={descargos}
                  onChange={(e) => setDescargos(e.target.value)}
                  placeholder="Escriba aquí sus descargos y argumentos de defensa..."
                  rows={6}
                />
              </div>

              {/* Firma */}
              <div className="space-y-2">
                <Label>Firma Digital *</Label>
                <p className="text-xs text-slate-500">Firme con el dedo en el área debajo</p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg overflow-hidden">
                  <SignaturePad value={firma} onChange={setFirma} />
                </div>
              </div>

              {/* Foto de cédula */}
              <div className="space-y-2">
                <Label>Foto Frontal de Cédula *</Label>
                <p className="text-xs text-slate-500">Tome una foto clara de su cédula</p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Camera className="h-4 w-4 mr-2" />
                      {fotoCedula ? 'Cambiar foto' : 'Tomar/Seleccionar foto'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        className="hidden" 
                        onChange={handleFotoChange}
                      />
                    </label>
                  </Button>
                  {fotoCedula && (
                    <img src={fotoCedula} alt="Cédula" className="h-16 rounded" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Términos legales */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terminos"
                  checked={aceptaTerminos}
                  onCheckedChange={(checked) => setAceptaTerminos(checked as boolean)}
                />
                <Label htmlFor="terminos" className="text-sm leading-relaxed cursor-pointer">
                  <span className="font-medium">Declaración juramentada:</span>
                  <span className="block mt-1 text-slate-600">
                    "Al enviar este formulario, declaro bajo la gravedad de juramento que soy el titular del número 
                    de WhatsApp registrado, que he recibido este proceso disciplinario por este medio de manera válida 
                    y que autorizo el uso de este canal para todas las notificaciones del proceso. Acepto que mi firma 
                    digital y la foto de mi cédula aquí adjuntas tienen plena validez legal según la Ley 527 de 1999 
                    y la Ley 2213 de 2022."
                  </span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Botón enviar */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={!descargos || !firma || !fotoCedula || !aceptaTerminos || enviando}
          >
            {enviando ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Descargos
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}

// ============== SIGNATURE PAD COMPONENT ==============
function SignaturePad({ value, onChange }: { value: string | null; onChange: (val: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPosRef.current = getPos(e);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;
    onChange(canvas.toDataURL());
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="w-full touch-none bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={clearCanvas}>
        Limpiar
      </Button>
    </div>
  );
}
