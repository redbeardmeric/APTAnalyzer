import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ChevronRight } from 'lucide-react';
import { getPercentageColor, formatPercentage } from '../../lib/utils';
import type { AnalysisResult } from '../../types';

export default function ResultsPanel() {
  const navigate = useNavigate();
  const { analysisResults, isAnalyzing } = useAppStore();

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark-text text-lg">Analyzing threat patterns...</p>
          <p className="text-dark-muted text-sm">Ranking APT groups by match percentage</p>
        </div>
      </div>
    );
  }

  if (!analysisResults || analysisResults.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg">
        <div className="text-center max-w-md">
          <p className="text-dark-muted">No results to display</p>
        </div>
      </div>
    );
  }

  // Group results by tier
  const tiers = {
    '90%+': analysisResults.filter((r) => r.matchPercentage >= 90),
    '80-89%': analysisResults.filter((r) => r.matchPercentage >= 80 && r.matchPercentage < 90),
    '70-79%': analysisResults.filter((r) => r.matchPercentage >= 70 && r.matchPercentage < 80),
    '60-69%': analysisResults.filter((r) => r.matchPercentage >= 60 && r.matchPercentage < 70),
    '50-59%': analysisResults.filter((r) => r.matchPercentage >= 50 && r.matchPercentage < 60),
  };

  return (
    <div className="flex-1 bg-dark-bg overflow-y-auto scrollbar-thin">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
          <p className="text-dark-muted">
            Found {analysisResults.length} potential APT group{analysisResults.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(tiers).map(([tier, results]) => {
            if (results.length === 0) return null;

            return (
              <div key={tier}>
                <h3 className="text-lg font-bold mb-3 text-dark-text">{tier} Match</h3>
                <div className="space-y-3">
                  {results.map((result) => (
                    <ResultCard key={result.groupId} result={result} navigate={navigate} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  result: AnalysisResult;
  navigate: (path: string) => void;
}

function ResultCard({ result, navigate }: ResultCardProps) {
  const percentageColor = getPercentageColor(result.matchPercentage);

  return (
    <div
      className="card p-4 cursor-pointer hover:border-primary transition-colors"
      onClick={() => navigate(`/group/${result.groupId}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-bold">{result.groupName}</h4>
            <span className={`text-2xl font-bold ${percentageColor}`}>
              {formatPercentage(result.matchPercentage)}
            </span>
          </div>

          <div className="space-y-2">
            {result.matchedTechniques.length > 0 && (
              <div>
                <div className="text-xs text-dark-muted mb-1">
                  Matched Techniques ({result.matchedTechniques.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.matchedTechniques.slice(0, 5).map((tech, i) => (
                    <span key={i} className="badge-primary text-xs">
                      {tech}
                    </span>
                  ))}
                  {result.matchedTechniques.length > 5 && (
                    <span className="badge-primary text-xs">
                      +{result.matchedTechniques.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {result.matchedSoftware.length > 0 && (
              <div>
                <div className="text-xs text-dark-muted mb-1">
                  Matched Software ({result.matchedSoftware.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.matchedSoftware.slice(0, 5).map((sw, i) => (
                    <span key={i} className="badge-warning text-xs">
                      {sw}
                    </span>
                  ))}
                  {result.matchedSoftware.length > 5 && (
                    <span className="badge-warning text-xs">
                      +{result.matchedSoftware.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <ChevronRight className="text-dark-muted flex-shrink-0 ml-4" size={20} />
      </div>
    </div>
  );
}
