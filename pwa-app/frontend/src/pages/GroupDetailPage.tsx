import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import api from '../api/client';
import type { Group, Technique, Software, Mitigation } from '../types';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return;

      try {
        setLoading(true);
        const [groupData, techniquesData, softwareData] = await Promise.all([
          api.getGroup(groupId),
          api.getGroupTechniques(groupId),
          api.getGroupSoftware(groupId),
        ]);

        setGroup(groupData);
        setTechniques(techniquesData);
        setSoftware(softwareData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load group data');
        console.error('Error loading group data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark-muted">Loading group details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="card p-8 max-w-md">
            <h2 className="text-xl font-bold text-danger mb-4">Error Loading Group</h2>
            <p className="text-dark-muted mb-4">{error || 'Group not found'}</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary mb-4 inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Analysis
            </button>

            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-dark-muted mb-4">
                    <span className="badge-primary">{group.externalId}</span>
                    {group.url && (
                      <a
                        href={group.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View on MITRE ATT&CK
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {group.aliases && group.aliases.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm text-dark-muted">Also known as: </span>
                      {group.aliases.map((alias, i) => (
                        <span key={i} className="text-sm">
                          {alias}
                          {i < group.aliases!.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-dark-text leading-relaxed">{group.description}</p>
            </div>
          </div>

          {/* Software Used */}
          {software.length > 0 && (
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Software ({software.length})</h2>
              <div className="space-y-4">
                {software.map((sw) => (
                  <div key={sw.id} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{sw.name}</h3>
                      <span className="badge-primary">{sw.type}</span>
                    </div>
                    <p className="text-sm text-dark-muted">{sw.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Techniques Used */}
          {techniques.length > 0 && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Techniques ({techniques.length})</h2>
              <div className="space-y-4">
                {techniques.map((technique) => (
                  <TechniqueCard key={technique.id} technique={technique} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function TechniqueCard({ technique }: { technique: Technique }) {
  const [mitigations, setMitigations] = useState<Mitigation[]>([]);
  const [showMitigations, setShowMitigations] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMitigations = async () => {
    if (mitigations.length > 0) {
      setShowMitigations(!showMitigations);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getTechniqueMitigations(technique.id);
      setMitigations(data);
      setShowMitigations(true);
    } catch (err) {
      console.error('Error loading mitigations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-l-2 border-warning pl-4">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold">{technique.name}</h3>
        <span className="badge-warning">{technique.externalId}</span>
      </div>
      <p className="text-sm text-dark-muted mb-2">{technique.description}</p>
      <button
        onClick={loadMitigations}
        className="text-sm text-primary hover:underline"
        disabled={loading}
      >
        {loading ? 'Loading...' : showMitigations ? 'Hide Mitigations' : 'Show Mitigations'}
      </button>

      {showMitigations && mitigations.length > 0 && (
        <div className="mt-3 pl-4 border-l border-dark-border space-y-2">
          {mitigations.map((mitigation) => (
            <div key={mitigation.id}>
              <h4 className="text-sm font-medium text-primary">{mitigation.name}</h4>
              <p className="text-xs text-dark-muted">{mitigation.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
