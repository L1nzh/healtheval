'use client';

import { useApp } from '@/context/AppContext';
import { convertToCSV, downloadCSV } from '@/utils/csvExporter';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Submission } from '@/types';

// Simple password protection (use more secure method in production)
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'healtheval';


export default function AdminPage() {
  // const { submissions } = useApp(); // deprecated
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [serverSubmissions, setServerSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSubmissions = async () => {
        try {
          const res = await fetch('/api/submissions');
          if (!res.ok) {
            throw new Error('Failed to fetch submissions');
          }
          const data = await res.json();
          setServerSubmissions(data);
        } catch (err) {
          console.error('Error fetching submissions:', err);
          alert('Failed to load data. Please try again.');
        }
      };
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  const exportAnnotators = () => {
    const annotators = Array.from(
      new Map(serverSubmissions.map(sub => [sub.personalInfo.annotatorId, sub.personalInfo])).values()
    );
    
    const csv = convertToCSV(annotators);
    downloadCSV(csv, 'annotators.csv');
  };

  const exportResults = () => {
    const results = serverSubmissions.map((submission, formId) => {
      const { response1, response2 } = submission.evaluation;
      const { annotatorId } = submission.personalInfo;
      const timestamp = submission.timestamp;

      const result = {
        annotatorId,
        formId: formId + 1, //start from 1
        timestamp,
        response1_helpfulness: response1.helpfulness,
        response1_clarity: response1.clarity,
        response1_reassurance: response1.reassurance,
        response1_feasibility: response1.feasibility,
        response1_medicalAccuracy: response1.medicalAccuracy,
        response2_helpfulness: response2.helpfulness,
        response2_clarity: response2.clarity,
        response2_reassurance: response2.reassurance,
        response2_feasibility: response2.feasibility,
        response2_medicalAccuracy: response2.medicalAccuracy,
      };

      return result;
    });

    const csv = convertToCSV(results);
    downloadCSV(csv, 'evaluation_results.csv');
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Return to Home
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Submission Statistics</h2>
        <p className="text-gray-700">Total submissions: {serverSubmissions.length}</p>
        <p className="text-gray-700">
          Number of annotators: {new Set(serverSubmissions.map(s => s.personalInfo.annotatorId)).size}
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={exportAnnotators}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export Annotator Info (CSV)
        </button>
        <button
          onClick={exportResults}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export Evaluation Results (CSV)
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        {serverSubmissions.length === 0 ? (
          <p>No submission data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Annotator ID</th>
                  <th className="py-2 text-left">Submission Time</th>
                </tr>
              </thead>
              <tbody>
                {serverSubmissions
                  .slice(0, 10)
                  .map((sub, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{sub.personalInfo.annotatorId}</td>
                      <td className="py-2">
                        {new Date(sub.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}