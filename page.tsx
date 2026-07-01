'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Users, ShieldCheck } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">MomCare</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground">
          Maternal Health Monitoring
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Real-time health monitoring for pregnant mothers with seamless doctor and health worker coordination
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/register?role=mother">
            <Button size="lg" className="px-8">
              Register as Mother
            </Button>
          </Link>
          <Link href="/register?role=asha">
            <Button size="lg" variant="secondary" className="px-8">
              Register as Health Worker
            </Button>
          </Link>
          <Link href="/register?role=doctor">
            <Button size="lg" variant="secondary" className="px-8">
              Register as Doctor
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-8 border border-border">
            <Heart className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
            <p className="text-muted-foreground">
              Track vital signs including heart rate, blood pressure, hemoglobin levels, fetal movement, and contractions in real-time
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border">
            <Users className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">Care Coordination</h3>
            <p className="text-muted-foreground">
              Connect with your assigned doctor and health worker for comprehensive prenatal care
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border">
            <ShieldCheck className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Emergency Support</h3>
            <p className="text-muted-foreground">
              Instantly alert your healthcare providers in case of emergencies with one tap
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-muted-foreground">
        <p>&copy; 2024 MomCare. All rights reserved. Dedicated to maternal health.</p>
      </footer>
    </main>
  );
}
