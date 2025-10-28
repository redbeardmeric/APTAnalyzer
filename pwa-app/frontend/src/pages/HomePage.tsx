import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import SelectionPanel from '../components/Selection/SelectionPanel';
import ResultsPanel from '../components/Analysis/ResultsPanel';
import { useAppStore } from '../store/useAppStore';
import api from '../api/client';
import type { Tactic, Technique, Software } from '../types';

export default function HomePage() {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showResults = useAppStore((state) => state.showResults);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tacticsData, techniquesData, softwareData] = await Promise.all([
          api.getTactics(),
          api.getTechniques(),
          api.getSoftware(),
        ]);

        setTactics(tacticsData);
        setTechniques(techniquesData);
        setSoftware(softwareData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark-muted">Loading MITRE ATT&CK data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="card p-8 max-w-md">
            <h2 className="text-xl font-bold text-danger mb-4">Error Loading Data</h2>
            <p className="text-dark-muted mb-4">{error}</p>
            <p className="text-sm text-dark-muted">
              Make sure the backend server is running at{' '}
              <code className="bg-dark-bg px-2 py-1 rounded">http://localhost:3001</code>
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-full">
        <SelectionPanel tactics={tactics} techniques={techniques} software={software} />
        {showResults && <ResultsPanel />}
      </div>
    </Layout>
  );
}
