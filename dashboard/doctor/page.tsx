'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, LogOut, Stethoscope, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

interface PatientRecord {
  id: string;
  motherEmail: string;
  ashaWorker: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  nextAppointment: string;
  notes: string;
  metrics: {
    heartRate: number;
    bloodPressure: string;
    hemoglobin: number;
    fetalMovement: number;
    contractions: number;
  };
  history: Array<{
    date: string;
    heartRate: number;
    bloodPressure: string;
    hemoglobin: number;
  }>;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [filteredStatus, setFilteredStatus] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      const parsed = JSON.parse(userData);
      if (parsed.role !== 'doctor') {
        router.push('/login');
        return;
      }

      setUser(parsed);
      loadPatients();
    };

    checkAuth();
  }, [router]);

  const loadPatients = () => {
    // Mock data - replace with actual API call
    const mockPatients: PatientRecord[] = [
      {
        id: '1',
        motherEmail: 'mother1@example.com',
        ashaWorker: 'ASHA-12345',
        status: 'normal',
        lastUpdated: '2 hours ago',
        nextAppointment: '2024-02-15',
        notes: 'Routine prenatal checkup. All vitals normal.',
        metrics: {
          heartRate: 72,
          bloodPressure: '120/80',
          hemoglobin: 11.2,
          fetalMovement: 8,
          contractions: 0,
        },
        history: [
          { date: '2024-01-15', heartRate: 71, bloodPressure: '119/79', hemoglobin: 11.1 },
          { date: '2024-01-22', heartRate: 72, bloodPressure: '120/80', hemoglobin: 11.2 },
          { date: '2024-01-29', heartRate: 72, bloodPressure: '120/80', hemoglobin: 11.2 },
        ],
      },
      {
        id: '2',
        motherEmail: 'mother2@example.com',
        ashaWorker: 'ASHA-12346',
        status: 'warning',
        lastUpdated: '1 hour ago',
        nextAppointment: '2024-02-10',
        notes: 'Elevated blood pressure. Recommend reduced activity.',
        metrics: {
          heartRate: 85,
          bloodPressure: '130/85',
          hemoglobin: 10.5,
          fetalMovement: 6,
          contractions: 2,
        },
        history: [
          { date: '2024-01-15', heartRate: 80, bloodPressure: '125/82', hemoglobin: 10.8 },
          { date: '2024-01-22', heartRate: 82, bloodPressure: '127/84', hemoglobin: 10.6 },
          { date: '2024-01-29', heartRate: 85, bloodPressure: '130/85', hemoglobin: 10.5 },
        ],
      },
      {
        id: '3',
        motherEmail: 'mother3@example.com',
        ashaWorker: 'ASHA-12347',
        status: 'critical',
        lastUpdated: '30 minutes ago',
        nextAppointment: '2024-02-05',
        notes: 'Low hemoglobin levels. Prescribed iron supplement.',
        metrics: {
          heartRate: 90,
          bloodPressure: '135/90',
          hemoglobin: 9.2,
          fetalMovement: 4,
          contractions: 3,
        },
        history: [
          { date: '2024-01-15', heartRate: 88, bloodPressure: '132/88', hemoglobin: 9.8 },
          { date: '2024-01-22', heartRate: 89, bloodPressure: '134/89', hemoglobin: 9.5 },
          { date: '2024-01-29', heartRate: 90, bloodPressure: '135/90', hemoglobin: 9.2 },
        ],
      },
    ];
    setPatients(mockPatients);
    if (mockPatients.length > 0) {
      setSelectedPatientId(mockPatients[0].id);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const filteredPatients = patients.filter(
    (p) => filteredStatus === 'all' || p.status === filteredStatus
  );

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

  const historyChartData = selectedPatient?.history || [];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
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
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Normal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {patients.filter((p) => p.status === 'normal').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {patients.filter((p) => p.status === 'warning').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {patients.filter((p) => p.status === 'critical').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Patient List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">My Patients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilteredStatus('all')}
                  className={`px-2 py-1 text-xs rounded ${
                    filteredStatus === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilteredStatus('critical')}
                  className={`px-2 py-1 text-xs rounded ${
                    filteredStatus === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'border border-border'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setFilteredStatus('warning')}
                  className={`px-2 py-1 text-xs rounded ${
                    filteredStatus === 'warning'
                      ? 'bg-yellow-600 text-white'
                      : 'border border-border'
                  }`}
                >
                  Warning
                </button>
              </div>

              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedPatientId === patient.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm">{patient.motherEmail}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        ASHA: {patient.ashaWorker}
                      </p>
                    </div>
                    {getStatusBadge(patient.status)}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Patient Details */}
          {selectedPatient && (
            <div className="lg:col-span-3 space-y-6">
              {/* Status Card */}
              <Card className={getStatusColor(selectedPatient.status)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {selectedPatient.status === 'critical' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : selectedPatient.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Heart className="w-5 h-5 text-green-600" />
                      )}
                      {selectedPatient.motherEmail}
                    </CardTitle>
                    {getStatusBadge(selectedPatient.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium">ASHA Worker:</span> {selectedPatient.ashaWorker}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span> {selectedPatient.lastUpdated}
                  </p>
                  <p>
                    <span className="font-medium">Next Appointment:</span>{' '}
                    {selectedPatient.nextAppointment}
                  </p>
                  <div>
                    <p className="font-medium mb-1">Clinical Notes:</p>
                    <p className="text-muted-foreground italic">{selectedPatient.notes}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedPatient.metrics.heartRate} BPM</div>
                    <p className="text-xs text-muted-foreground mt-1">Normal: 60-100</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedPatient.metrics.bloodPressure}</div>
                    <p className="text-xs text-muted-foreground mt-1">Normal: {'<'}120/80</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Hemoglobin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedPatient.metrics.hemoglobin} g/dL</div>
                    <p className="text-xs text-muted-foreground mt-1">Normal: 11.0-14.0</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fetal Movement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedPatient.metrics.fetalMovement}</div>
                    <p className="text-xs text-muted-foreground mt-1">Expected: 8-10+</p>
                  </CardContent>
                </Card>
              </div>

              {/* History Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics Trend</CardTitle>
                  <CardDescription>Last 3 measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="hemoglobin" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-4">
                <Button className="w-full">Write Prescription</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Send Message
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Schedule Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
