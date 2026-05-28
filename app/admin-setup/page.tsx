'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, CheckCircle, XCircle, Database, Shield, User } from 'lucide-react'

interface CheckResult {
  name: string
  status: 'loading' | 'success' | 'error' | 'info'
  message: string
  details?: string
}

export default function AdminSetupCheck() {
  const [checks, setChecks] = useState<CheckResult[]>([
    { name: 'Supabase Connection', status: 'loading', message: 'Checking...' },
    { name: 'Admin Users Table', status: 'loading', message: 'Checking...' },
    { name: 'Owner Account', status: 'loading', message: 'Checking...' },
    { name: 'Current User', status: 'loading', message: 'Checking...' },
  ])
  const [sqlScript, setSqlScript] = useState('')

  useEffect(() => {
    runChecks()
  }, [])

  const runChecks = async () => {
    const supabase = createClient()
    
    if (!supabase) {
      updateCheck(0, 'error', 'Supabase not configured', 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are missing')
      updateCheck(1, 'error', 'Cannot check', 'Supabase not connected')
      updateCheck(2, 'error', 'Cannot check', 'Supabase not connected')
      updateCheck(3, 'error', 'Cannot check', 'Supabase not connected')
      return
    }

    updateCheck(0, 'success', 'Supabase connected', 'Environment variables are set')

    // Check admin_users table
    const { data: tableData, error: tableError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1)

    if (tableError) {
      updateCheck(1, 'error', 'admin_users table missing or inaccessible', tableError.message)
      updateCheck(2, 'error', 'Cannot check', 'Table does not exist')
      setSqlScript(generateSQLScript())
    } else {
      updateCheck(1, 'success', 'admin_users table exists', 'Table is accessible')

      // Check owner account
      const { data: ownerData, error: ownerError } = await supabase
        .from('admin_users')
        .select('email, role')
        .eq('role', 'owner')
        .single()

      if (ownerError || !ownerData) {
        updateCheck(2, 'error', 'No owner account found', 'salsbury.law@icloud.com needs to be added as owner')
        setSqlScript(generateSQLScript())
      } else {
        updateCheck(2, 'success', `Owner: ${ownerData.email}`, `Role: ${ownerData.role}`)
      }
    }

    // Check current user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', user.email)
        .single()
      
      if (adminData) {
        updateCheck(3, 'success', `Signed in: ${user.email}`, `Role: ${adminData.role}`)
      } else {
        updateCheck(3, 'error', `Signed in: ${user.email}`, 'NOT an admin - needs to be added to admin_users table')
      }
    } else {
      updateCheck(3, 'info', 'Not signed in', 'Sign in to check admin status')
    }
  }

  const updateCheck = (index: number, status: CheckResult['status'], message: string, details?: string) => {
    setChecks(prev => {
      const newChecks = [...prev]
      newChecks[index] = { ...newChecks[index], status, message, details }
      return newChecks
    })
  }

  const generateSQLScript = () => {
    return `-- Run this in Supabase SQL Editor to fix admin access

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add owner user (salsbury.law@icloud.com)
INSERT INTO admin_users (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'salsbury.law@icloud.com',
  'owner',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
  SET role = 'owner', updated_at = NOW();

-- 3. Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Add policies
DROP POLICY IF EXISTS "Allow public to check admin status" ON admin_users;
DROP POLICY IF EXISTS "Allow admin full access on admin_users" ON admin_users;

CREATE POLICY "Allow public to check admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin full access on admin_users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.role IN ('admin', 'owner')
    )
  );

-- 5. Verify
SELECT * FROM admin_users;`
  }

  const getIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      case 'info': return <User className="w-5 h-5 text-blue-500" />
      default: return <AlertTriangle className="w-5 h-5 text-amber-500" />
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1714] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C8A46B]/10 flex items-center justify-center mx-auto mb-4 border border-[#C8A46B]/30">
            <Shield className="w-8 h-8 text-[#C8A46B]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F6F0E8] mb-2">Admin Setup Check</h1>
          <p className="text-[#B8A89A]">Verify your admin authentication is configured correctly</p>
        </div>

        <div className="space-y-4 mb-8">
          {checks.map((check, i) => (
            <div key={i} className="bg-[#241B18] rounded-xl p-5 border border-[#3A2A24]">
              <div className="flex items-start gap-4">
                {getIcon(check.status)}
                <div className="flex-1">
                  <h3 className="font-medium text-[#F6F0E8] mb-1">{check.name}</h3>
                  <p className={`text-sm ${check.status === 'error' ? 'text-red-400' : check.status === 'success' ? 'text-green-400' : 'text-[#B8A89A]'}`}>
                    {check.message}
                  </p>
                  {check.details && (
                    <p className="text-xs text-[#8B5E3C] mt-1">{check.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sqlScript && (
          <div className="bg-[#241B18] rounded-xl border border-[#3A2A24] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1E1714] border-b border-[#3A2A24]">
              <Database className="w-4 h-4 text-[#C8A46B]" />
              <span className="text-sm font-medium text-[#C8A46B]">Fix Script - Run in Supabase SQL Editor</span>
            </div>
            <pre className="p-4 text-xs text-[#CDBDAF] overflow-x-auto whitespace-pre-wrap font-mono">
              {sqlScript}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(sqlScript)}
              className="w-full py-2 bg-[#1E6B73] hover:bg-[#4C9AA3] text-[#F6F0E8] text-sm font-medium transition-colors"
            >
              Copy SQL to Clipboard
            </button>
          </div>
        )}

        <div className="mt-8 text-center space-y-2">
          <a href="/login" className="text-[#C8A46B] hover:text-[#4C9AA3] text-sm">
            → Go to Login
          </a>
          <br />
          <a href="/" className="text-[#8B5E3C] hover:text-[#C8A46B] text-sm">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}
