
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useMemberships } from '@/hooks/useMemberships';
import { Loader2, Crown, Users, Star } from 'lucide-react';

const MembershipManager = () => {
  const { memberships, loading, createMembership, updateMembership } = useMemberships();
  const [newMembership, setNewMembership] = useState({
    type: 'basic' as 'basic' | 'premium' | 'vip',
    end_date: '',
    features: {}
  });

  const handleCreateMembership = async () => {
    await createMembership(newMembership);
    setNewMembership({ type: 'basic', end_date: '', features: {} });
  };

  const getMembershipIcon = (type: string) => {
    switch (type) {
      case 'vip': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'premium': return <Star className="h-4 w-4 text-purple-500" />;
      default: return <Users className="h-4 w-4 text-blue-500" />;
    }
  };

  const getMembershipBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Membresías</CardTitle>
          <CardDescription>
            Administra las membresías premium de los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="membership-type">Tipo de Membresía</Label>
              <Select
                value={newMembership.type}
                onValueChange={(value) => setNewMembership({ ...newMembership, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básica</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="end-date">Fecha de Expiración</Label>
              <Input
                id="end-date"
                type="date"
                value={newMembership.end_date}
                onChange={(e) => setNewMembership({ ...newMembership, end_date: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleCreateMembership} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Crear Membresía
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membresías Activas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {memberships.map((membership) => (
                <div key={membership.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMembershipIcon(membership.type)}
                    <div>
                      <h4 className="font-medium capitalize">{membership.type}</h4>
                      <p className="text-sm text-gray-500">
                        {membership.end_date ? `Expira: ${membership.end_date}` : 'Sin expiración'}
                      </p>
                    </div>
                  </div>
                  <Badge className={getMembershipBadgeColor(membership.status)}>
                    {membership.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipManager;
