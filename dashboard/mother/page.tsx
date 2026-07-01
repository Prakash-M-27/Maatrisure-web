'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, AlertTriangle, LogOut, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface HealthMetrics {
  timestamp: string;
  heartRate: number;
  bloodPressure: string;
  fetalMovement: number;
  contractions: number;
  hemoglobin: number;
}

interface ConnectedProvider {
  id: string;
  name: string;
  role: string;
  uniqueId: string;
}

export default function MotherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [connectedProviders, setConnectedProviders] = useState<ConnectedProvider[]>([]);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [asha, setAshaInput] = useState('');
  const [doctor, setDoctorInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      const parsed = JSON.parse(userData);
      if (parsed.role !== 'mother') {
        router.push('/login');
        return;
      }

      setUser(parsed);
      loadMetrics();
      loadConnectedProviders();
    };

    checkAuth();
  }, [router]);

  const loadMetrics = () => {
    // Mock data - replace with actual API call
    const mockMetrics: HealthMetrics[] = [
      {
        timestamp: '09:00 AM',
        heartRate: 72,
        bloodPressure: '120/80',
        fetalMovement: 8,
        contractions: 0,
        hemoglobin: 11.2,
      },
      {
        timestamp: '12:00 PM',
        heartRate: 75,
        bloodPressure: '118/78',
        fetalMovement: 10,
        contractions: 1,
        hemoglobin: 11.2,
      },
      {
        timestamp: '03:00 PM',
        heartRate: 73,
        bloodPressure: '119/79',
        fetalMovement: 9,
        contractions: 0,
        hemoglobin: 11.3,
      },
      {
        timestamp: '06:00 PM',
        heartRate: 76,
        bloodPressure: '121/81',
        fetalMovement: 11,
        contractions: 2,
        hemoglobin: 11.3,
      },
    ];
    setMetrics(mockMetrics);
    setLoading(false);
  };

  const loadConnectedProviders = () => {
    // Mock data - replace with actual API call
    setConnectedProviders([]);
  };

  const handleEmergency = async () => {
    console.log('[v0] Emergency button clicked');
    setShowEmergencyAlert(true);
    setTimeout(() => setShowEmergencyAlert(false), 5000);

    // In production, this would send alerts to connected providers
    // await fetch('/api/emergency/alert', { method: 'POST', ... })
  };

  const handleConnectProvider = async (type: 'asha' | 'doctor') => {
    const uniqueId = type === 'asha' ? asha : doctor;
    if (!uniqueId) {
      setError(`Please enter ${type} ID`);
      return;
    }

    // In production: fetch('/api/connect-provider', { ... })
    console.log(`[v0] Connecting to ${type} with ID: ${uniqueId}`);
    setError('');

    if (type === 'asha') {
      setAshaInput('');
    } else {
      setDoctorInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  const latestMetrics = metrics[metrics.length - 1] || {};
  const chartData = metrics.map((m) => ({
    time: m.timestamp,
    HR: m.heartRate,
    HB: m.hemoglobin * 10, // Scale for visibility
  }));

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
              <p className="text-sm text-muted-foreground">Mother Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Emergency Button */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400">Emergency Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleEmergency}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                EMERGENCY - ALERT PROVIDERS
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Click to immediately alert your assigned doctor and health worker
              </p>
            </CardContent>
          </Card>

          {/* Monitor Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Monitor Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">System Status:</span>
                  <span className="font-semibold text-green-600">Active</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Connected Devices:</span>
                  <span className="font-semibold">IoT Sensors</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="font-semibold">Now</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {showEmergencyAlert && (
          <Alert className="border-red-600 bg-red-50 dark:bg-red-950/30">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-400">
              Emergency alert sent to your assigned doctor and health worker!
            </AlertDescription>
          </Alert>
        )}

        {/* Connect Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Connect with Healthcare Providers</CardTitle>
            <CardDescription>Enter unique IDs to connect with your doctor and health worker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Health Worker (ASHA) ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ASHA-xxxxx"
                    value={asha}
                    onChange={(e) => setAshaInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <Button onClick={() => handleConnectProvider('asha')} size="sm">
                    Connect
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Doctor ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="DOCTOR-xxxxx"
                    value={doctor}
                    onChange={(e) => setDoctorInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <Button onClick={() => handleConnectProvider('doctor')} size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>

            {connectedProviders.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Connected Providers</h4>
                {connectedProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex justify-between items-center p-3 bg-primary/10 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.role}</p>
                    </div>
                    <span className="text-xs font-mono text-primary">{provider.uniqueId}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{latestMetrics.heartRate || '-'} BPM</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="HR" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{latestMetrics.bloodPressure || '-'} mmHg</div>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Normal Range:</span>
                  <span>{'<'}120/80</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-600 font-semibold">Healthy</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fetal Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{latestMetrics.fetalMovement || '-'} Movements</div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="HR" fill="#3b82f6" stroke="#1e40af" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contractions & Hemoglobin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Contractions per Hour</p>
                <p className="text-3xl font-bold">{latestMetrics.contractions || '0'}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Hemoglobin Level</p>
                <p className="text-3xl font-bold">{latestMetrics.hemoglobin || '-'} g/dL</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Normal: 11.0-14.0 g/dL during pregnancy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
