import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Github, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import type { DataSourceInfo } from '../../types';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataInfo, setDataInfo] = useState<DataSourceInfo | null>(null);

  useEffect(() => {
    const loadDataInfo = async () => {
      try {
        const info = await api.getDataSourceInfo();
        setDataInfo(info);
      } catch (err) {
        console.error('Error loading data info:', err);
      }
    };

    loadDataInfo();
  }, []);

  return (
    <header className="bg-dark-surface border-b border-dark-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Shield className="text-primary" size={32} />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">
                <span className="text-danger">R</span>.
                <span className="text-warning">A</span>.
                <span className="text-primary">P</span>.
                <span className="text-danger">T</span>.
                <span className="text-warning">O</span>.
                <span className="text-primary">R</span>.
              </h1>
              <p className="text-xs text-dark-muted">
                Ranking Advanced Persistent Threat Ontological Report
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate('/')}
                className="text-sm text-dark-muted hover:text-dark-text transition-colors"
              >
                Home
              </button>
            )}

            <a
              href="https://github.com/redbeardmeric/APTAnalyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-dark-text transition-colors"
              title="GitHub Repository"
            >
              <Github size={20} />
            </a>

            <a
              href="https://attack.mitre.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-dark-text transition-colors inline-flex items-center gap-1 text-sm"
              title="MITRE ATT&CK"
            >
              ATT&CK
              <ExternalLink size={14} />
            </a>
          </nav>
        </div>

        {/* Data Source Info */}
        {dataInfo && (
          <div className="mt-3 flex items-center gap-4 text-xs text-dark-muted">
            <span>ATT&CK v{dataInfo.attackVersion}</span>
            <span>•</span>
            <span>{dataInfo.totalGroups} Groups</span>
            <span>•</span>
            <span>{dataInfo.totalTechniques} Techniques</span>
            <span>•</span>
            <span>{dataInfo.totalSoftware} Software</span>
          </div>
        )}
      </div>
    </header>
  );
}
