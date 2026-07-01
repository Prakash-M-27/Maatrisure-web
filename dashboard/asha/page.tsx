'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, LogOut, Heart, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AssignedMother {
  id: string;
  email: string;
  phoneNumber: string;
  lastChecked: string;
  status: 'normal' | 'warning' | 'critical';
  metrics: {
    heartRate: number;
    bloodPressure: string;
    hemoglobin: number;
    fetalMovement: number;
    contractions: number;
  };
}

export default function AshaWorkerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mothers, setMothers] = useState<AssignedMother[]>([]);
  const [selectedMotherId, setSelectedMotherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      const parsed = JSON.parse(userData);
      if (parsed.role !== 'asha') {
        router.push('/login');
        return;
      }

      setUser(parsed);
      loadAssignedMothers();
    };

    checkAuth();
  }, [router]);

  const loadAssignedMothers = () => {
    // Mock data - replace with actual API call
    const mockMothers: AssignedMother[] = [
      {
        id: '1',
        email: 'mother1@example.com',
        phoneNumber: '+91 98765 43210',
        lastChecked: '2 hours ago',
        status: 'normal',
        metrics: {
          heartRate: 72,
          bloodPressure: '120/80',
          hemoglobin: 11.2,
          fetalMovement: 8,
          contractions: 0,
        },
      },
      {
        id: '2',
        email: 'mother2@example.com',
        phoneNumber: '+91 98765 43211',
        lastChecked: '1 hour ago',
        status: 'warning',
        metrics: {
          heartRate: 85,
          bloodPressure: '130/85',
          hemoglobin: 10.5,
          fetalMovement: 6,
          contractions: 2,
        },
      },
      {
        id: '3',
        email: 'mother3@example.com',
        phoneNumber: '+91 98765 43212',
        lastChecked: '30 minutes ago',
        status: 'normal',
        metrics: {
          heartRate: 71,
          bloodPressure: '118/78',
          hemoglobin: 11.5,
          fetalMovement: 10,
          contractions: 1,
        },
      },
    ];
    setMothers(mockMothers);
    if (mockMothers.length > 0) {
      setSelectedMotherId(mockMothers[0].id);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const selectedMother = mothers.find((m) => m.id === selectedMotherId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'border-red-200 bg-red-50 dark:bg-red-950/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20';
      default:
        return 'border-green-200 bg-green-50 dark:bg-green-950/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <span className="px-2 py-1 text-xs bg-red-600 text-white rounded">Critical</span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded">Warning</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">Normal</span>;
    }
  };

  if (!user) return null;

  const chartData = [
    { name: 'HR', value: selectedMother?.metrics.heartRate || 0 },
    { name: 'FM', value: selectedMother?.metrics.fetalMovement || 0 },
    { name: 'CT', value: (selectedMother?.metrics.contractions || 0) * 10 },
    { name: 'HB', value: (selectedMother?.metrics.hemoglobin || 0) * 10 },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-secondary" />
            <div>
              <h1 className="text-2xl font-bold">ASHA Worker Portal</h1>
              <p className="text-sm text-muted-foreground">ID: {user.uniqueId || 'N/A'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Assigned Mothers List */}
        <div className="grid lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Assigned Mothers</CardTitle>
              <CardDescription>{mothers.length} mothers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mothers.map((mother) => (
                <button
                  key={mother.id}
                  onClick={() => setSelectedMotherId(mother.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedMotherId === mother.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm">{mother.email}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {mother.phoneNumber}
                      </p>
                    </div>
                    {getStatusBadge(mother.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Checked: {mother.lastChecked}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {selectedMother && (
            <div className="lg:col-span-3 space-y-6">
              {/* Status Alert */}
              <Card className={getStatusColor(selectedMother.status)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {selectedMother.status === 'critical' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : selectedMother.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Heart className="w-5 h-5 text-green-600" />
                      )}
                      {selectedMother.email}
                    </CardTitle>
                    {getStatusBadge(selectedMother.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Phone:</span> {selectedMother.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium">Last Check:</span> {selectedMother.lastChecked}
                  </p>
                </CardContent>
              </Card>

              {/* Vital Signs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedMother.metrics.heartRate} BPM</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedMother.metrics.bloodPressure}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Hemoglobin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedMother.metrics.hemoglobin} g/dL</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fetal Movement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedMother.metrics.fetalMovement}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full">Log Visit</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Mothers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mothers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Normal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {mothers.filter((m) => m.status === 'normal').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Healthy condition</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Requires Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {mothers.filter((m) => m.status !== 'normal').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Warning or critical</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
