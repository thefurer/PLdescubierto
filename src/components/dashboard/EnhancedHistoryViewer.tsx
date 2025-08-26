import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { History, RotateCcw, User, Calendar as CalendarIcon, FileText, Palette, Navigation, Image, MousePointer, Type, Filter, Search, Eye, Diff, Download, RefreshCw } from 'lucide-react';
import { useContentHistory } from '@/hooks/useContentHistory';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
const EnhancedHistoryViewer = () => {
  const {
    history,
    loading,
    revertToVersion,
    fetchHistory
  } = useContentHistory();
  const [filteredHistory, setFilteredHistory] = useState(history);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedChangeType, setSelectedChangeType] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = [...history];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item => item.section_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.changed_by_name?.toLowerCase().includes(searchTerm.toLowerCase()) || (item as any).section_display_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filtro por usuario
    if (selectedUser !== 'all') {
      filtered = filtered.filter(item => item.changed_by === selectedUser);
    }

    // Filtro por sección
    if (selectedSection !== 'all') {
      filtered = filtered.filter(item => item.section_name === selectedSection);
    }

    // Filtro por tipo de cambio
    if (selectedChangeType !== 'all') {
      filtered = filtered.filter(item => item.change_type === selectedChangeType);
    }

    // Filtro por fecha
    if (dateFrom) {
      filtered = filtered.filter(item => new Date(item.changed_at) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(item => new Date(item.changed_at) <= dateTo);
    }
    setFilteredHistory(filtered);
  };

  // Aplicar filtros cuando cambien los valores
  React.useEffect(() => {
    applyFilters();
  }, [history, searchTerm, selectedUser, selectedSection, selectedChangeType, dateFrom, dateTo]);
  const getSectionIcon = (sectionName: string) => {
    if (sectionName.includes('color_palette')) return <Palette className="h-4 w-4 text-blue-500" />;
    if (sectionName.includes('navbar_settings')) return <Navigation className="h-4 w-4 text-green-500" />;
    if (sectionName.includes('logo_settings')) return <Image className="h-4 w-4 text-pink-500" />;
    if (sectionName.includes('button_styles')) return <MousePointer className="h-4 w-4 text-purple-500" />;
    if (sectionName.includes('typography')) return <Type className="h-4 w-4 text-orange-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };
  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getChangeTypeText = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return 'Creado';
      case 'update':
        return 'Actualizado';
      case 'delete':
        return 'Eliminado';
      default:
        return changeType;
    }
  };

  // Obtener listas únicas para filtros - evitar duplicados
  const uniqueUsers = history.reduce((acc, item) => {
    if (item.changed_by && !acc.find(u => u.id === item.changed_by)) {
      acc.push({
        id: item.changed_by,
        name: item.changed_by_name || 'Usuario desconocido'
      });
    }
    return acc;
  }, [] as Array<{
    id: string;
    name: string;
  }>);
  const uniqueSections = [...new Set(history.map(item => item.section_name))];
  const uniqueChangeTypes = [...new Set(history.map(item => item.change_type))];
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUser('all');
    setSelectedSection('all');
    setSelectedChangeType('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };
  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `historial_cambios_${format(new Date(), 'yyyy-MM-dd')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Cambios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">Cargando historial...</div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="h-[700px]">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              Historial de Cambios
            </CardTitle>
            <CardDescription>
              Monitoreo, filtrado y auditoría completa de modificaciones
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchHistory} className="h-8">
              <RefreshCw className="h-3 w-3 mr-1" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm" onClick={exportHistory} className="h-8">
              <Download className="h-3 w-3 mr-1" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 h-9" />
            </div>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                {uniqueUsers.map(user => <SelectItem key={user.id} value={user.id || ''}>
                    {user.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Sección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las secciones</SelectItem>
                {uniqueSections.map(section => <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedChangeType} onValueChange={setSelectedChangeType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tipo de acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                {uniqueChangeTypes.map(type => <SelectItem key={type} value={type}>
                    {getChangeTypeText(type)}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Desde:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("h-9 justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hasta:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("h-9 justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <Filter className="h-3 w-3 mr-1" />
              Limpiar filtros
            </Button>

            <Badge variant="secondary" className="ml-auto">
              {filteredHistory.length} de {history.length} registros
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {filteredHistory.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <History className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {history.length === 0 ? 'No hay historial disponible' : 'No hay resultados'}
              </h3>
              <p className="text-sm text-gray-500">
                {history.length === 0 ? 'Los cambios que realices aparecerán aquí' : 'Intenta ajustar los filtros para encontrar lo que buscas'}
              </p>
            </div> : <div className="space-y-0">
              {filteredHistory.map((item, index) => <div key={item.id}>
                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getSectionIcon(item.section_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {(item as any).section_display_name || item.section_name}
                            </h4>
                            <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getChangeTypeColor(item.change_type)}`}>
                              {getChangeTypeText(item.change_type)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{item.changed_by_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>
                                {formatDistanceToNow(new Date(item.changed_at), {
                            addSuffix: true,
                            locale: es
                          })}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {format(new Date(item.changed_at), 'dd/MM/yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-2">
                        {/* Botón de auditoría */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setSelectedItem(item)}>
                              <Eye className="h-3 w-3 mr-1" />
                              Auditar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Diff className="h-5 w-5" />
                                Auditoría de Cambios
                              </DialogTitle>
                              <DialogDescription>
                                Comparación detallada del contenido anterior y nuevo
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <Tabs defaultValue="comparison" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-slate-200">
                                  <TabsTrigger value="comparison">Comparación</TabsTrigger>
                                  <TabsTrigger value="before">Contenido Anterior</TabsTrigger>
                                  <TabsTrigger value="after">Contenido Nuevo</TabsTrigger>
                                </TabsList>
                                <TabsContent value="comparison" className="mt-4">
                                  <div className="grid grid-cols-2 gap-4 h-[400px]">
                                    <div>
                                      <h4 className="font-semibold mb-2 text-red-600">Contenido Anterior</h4>
                                      <ScrollArea className="h-full border rounded p-4 bg-red-50">
                                        <pre className="text-xs whitespace-pre-wrap">
                                          {selectedItem?.old_content ? JSON.stringify(selectedItem.old_content, null, 2) : 'No disponible'}
                                        </pre>
                                      </ScrollArea>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2 text-green-600">Contenido Nuevo</h4>
                                      <ScrollArea className="h-full border rounded p-4 bg-green-50">
                                        <pre className="text-xs whitespace-pre-wrap">
                                          {selectedItem?.new_content ? JSON.stringify(selectedItem.new_content, null, 2) : 'No disponible'}
                                        </pre>
                                      </ScrollArea>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="before" className="mt-4">
                                  <ScrollArea className="h-[400px] border rounded p-4">
                                    <pre className="text-xs whitespace-pre-wrap">
                                      {selectedItem?.old_content ? JSON.stringify(selectedItem.old_content, null, 2) : 'No hay contenido anterior disponible'}
                                    </pre>
                                  </ScrollArea>
                                </TabsContent>
                                <TabsContent value="after" className="mt-4">
                                  <ScrollArea className="h-[400px] border rounded p-4">
                                    <pre className="text-xs whitespace-pre-wrap">
                                      {selectedItem?.new_content ? JSON.stringify(selectedItem.new_content, null, 2) : 'No hay contenido nuevo disponible'}
                                    </pre>
                                  </ScrollArea>
                                </TabsContent>
                              </Tabs>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Botón de revertir */}
                        {item.old_content && <Button variant="outline" size="sm" onClick={() => revertToVersion(item)} className="h-8 px-3 text-xs" title="Revertir a esta versión">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Revertir
                          </Button>}
                      </div>
                    </div>
                  </div>
                  {index < filteredHistory.length - 1 && <Separator />}
                </div>)}
            </div>}
        </ScrollArea>
      </CardContent>
    </Card>;
};
export default EnhancedHistoryViewer;