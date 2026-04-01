'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, Plus, Edit, Trash2, Search, Shield, Mail, Phone, 
  Clock, CheckCircle, XCircle, Key, Save
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Usuario {
  id: number;  // Cambiado a number
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  telefono: string | null;
  ultimoAcceso: string | null;
  createdAt: string;
}

const ROLES = [
  { value: 'LIDER_OPERACIONES', label: 'Líder de Operaciones' },
  { value: 'LIDER_GGRH', label: 'Líder de GGHH' },
  { value: 'GERENCIA', label: 'Gerencia' },
  { value: 'CONSEJO_ADMINISTRACION', label: 'Consejo de Administración' },
  { value: 'COMITE_APELACIONES', label: 'Comité de Apelaciones' },
];

export function UsersManager() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'crear' | 'editar'>('crear');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    telefono: '',
  });
  const [saving, setSaving] = useState(false);

  // Cargar usuarios
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol = filtroRol === 'todos' || u.rol === filtroRol;
    return coincideBusqueda && coincideRol;
  });

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModalMode('crear');
    setUsuarioSeleccionado(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: '',
      telefono: '',
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (user: Usuario) => {
    setModalMode('editar');
    setUsuarioSeleccionado(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
      telefono: user.telefono || '',
    });
    setShowModal(true);
  };

  // Guardar usuario
  const handleGuardar = async () => {
    if (!formData.nombre || !formData.email || !formData.rol) {
      toast({
        title: 'Campos requeridos',
        description: 'Complete todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    if (modalMode === 'crear' && !formData.password) {
      toast({
        title: 'Contraseña requerida',
        description: 'Debe asignar una contraseña al nuevo usuario',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const url = modalMode === 'crear' 
        ? '/api/usuarios' 
        : `/api/usuarios/${usuarioSeleccionado?.id}`;
      
      const method = modalMode === 'crear' ? 'POST' : 'PUT';
      
      const bodyData: Record<string, unknown> = {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        telefono: formData.telefono || null,
      };

      if (formData.password) {
        bodyData.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: modalMode === 'crear' ? 'Usuario creado' : 'Usuario actualizado',
          description: `El usuario ha sido ${modalMode === 'crear' ? 'creado' : 'actualizado'} exitosamente`,
        });
        setShowModal(false);
        cargarUsuarios();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Error al guardar usuario',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error de conexión',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle activo/inactivo
  const toggleActivo = async (user: Usuario) => {
    try {
      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !user.activo }),
      });

      if (response.ok) {
        toast({
          title: user.activo ? 'Usuario desactivado' : 'Usuario activado',
          description: `El usuario ha sido ${user.activo ? 'desactivado' : 'activado'}`,
        });
        cargarUsuarios();
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al cambiar estado del usuario',
        variant: 'destructive',
      });
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (user: Usuario) => {
    if (!confirm(`¿Está seguro de eliminar al usuario ${user.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Usuario eliminado',
          description: `El usuario ha sido eliminado`,
        });
        cargarUsuarios();
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al eliminar usuario',
        variant: 'destructive',
      });
    }
  };

  const getRolLabel = (rol: string) => {
    return ROLES.find(r => r.value === rol)?.label || rol;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Gestión de Usuarios
          </h2>
          <p className="text-slate-500">Administre los usuarios del sistema</p>
        </div>
        <Button onClick={abrirModalCrear} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroRol} onValueChange={setFiltroRol}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                {ROLES.map(rol => (
                  <SelectItem key={rol.value} value={rol.value}>{rol.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4">
          {usuariosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron usuarios</p>
              </CardContent>
            </Card>
          ) : (
            usuariosFiltrados.map(user => (
              <Card key={user.id} className={`${!user.activo ? 'opacity-60' : ''}`}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        user.activo ? 'bg-blue-100' : 'bg-slate-200'
                      }`}>
                        <Shield className={`h-6 w-6 ${user.activo ? 'text-blue-600' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{user.nombre}</h3>
                          <Badge variant={user.activo ? 'default' : 'secondary'}>
                            {user.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </span>
                          {user.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {user.telefono}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getRolLabel(user.rol)}
                          </Badge>
                          {user.ultimoAcceso && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Último acceso: {new Date(user.ultimoAcceso).toLocaleDateString('es-CO')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActivo(user)}
                        disabled={user.id === usuario?.id}
                        title={user.activo ? 'Desactivar' : 'Activar'}
                      >
                        {user.activo ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirModalEditar(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarUsuario(user)}
                        disabled={user.id === usuario?.id}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal de creación/edición */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalMode === 'crear' ? (
                <>
                  <Plus className="h-5 w-5" />
                  Nuevo Usuario
                </>
              ) : (
                <>
                  <Edit className="h-5 w-5" />
                  Editar Usuario
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'crear' 
                ? 'Complete los datos para crear un nuevo usuario del sistema'
                : 'Modifique los datos del usuario'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre completo del usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@cootracovi.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña {modalMode === 'crear' ? '*' : '(dejar vacío para mantener actual)'}
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <Select 
                value={formData.rol} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, rol: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(rol => (
                    <SelectItem key={rol.value} value={rol.value}>{rol.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono (opcional)</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={saving}>
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Guardar
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
