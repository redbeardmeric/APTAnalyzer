import { useState, useEffect } from 'react';
import { Search, X, Play, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import api from '../../api/client';
import type { Tactic, Technique, Software } from '../../types';

interface SelectionPanelProps {
  tactics: Tactic[];
  techniques: Technique[];
  software: Software[];
}

export default function SelectionPanel({ tactics, techniques, software }: SelectionPanelProps) {
  const [selectedTactic, setSelectedTactic] = useState<string>('');
  const [filteredTechniques, setFilteredTechniques] = useState<Technique[]>(techniques);
  const [techniqueSearch, setTechniqueSearch] = useState('');
  const [softwareSearch, setSoftwareSearch] = useState('');

  const {
    selectedTechniques,
    selectedSoftware,
    threshold,
    potentialMatches,
    addTechnique,
    removeTechnique,
    addSoftware,
    removeSoftware,
    clearAll,
    setThreshold,
    setPotentialMatches,
    setAnalysisResults,
    setIsAnalyzing,
    setShowResults,
  } = useAppStore();

  // Filter techniques by tactic
  useEffect(() => {
    if (selectedTactic === '') {
      setFilteredTechniques(techniques);
    } else {
      const tactic = tactics.find((t) => t.shortname === selectedTactic);
      if (tactic) {
        setFilteredTechniques(
          techniques.filter((tech) => tech.tactics.includes(tactic.shortname))
        );
      }
    }
  }, [selectedTactic, techniques, tactics]);

  // Update potential matches count
  useEffect(() => {
    const updateCount = async () => {
      if (selectedTechniques.length === 0 && selectedSoftware.length === 0) {
        setPotentialMatches(0);
        return;
      }

      try {
        const count = await api.countMatches({
          techniques: selectedTechniques,
          software: selectedSoftware,
          threshold,
        });
        setPotentialMatches(count);
      } catch (err) {
        console.error('Error counting matches:', err);
      }
    };

    updateCount();
  }, [selectedTechniques, selectedSoftware, threshold, setPotentialMatches]);

  const handleAnalyze = async () => {
    if (selectedTechniques.length === 0 && selectedSoftware.length === 0) {
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await api.analyze({
        techniques: selectedTechniques,
        software: selectedSoftware,
        threshold,
      });
      setAnalysisResults(response.results);
    } catch (err) {
      console.error('Error analyzing:', err);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    clearAll();
    setShowResults(false);
    setSelectedTactic('');
    setTechniqueSearch('');
    setSoftwareSearch('');
  };

  const filteredSoftwareList = software.filter((sw) =>
    sw.name.toLowerCase().includes(softwareSearch.toLowerCase())
  );

  const searchedTechniques = filteredTechniques.filter((tech) =>
    tech.name.toLowerCase().includes(techniqueSearch.toLowerCase())
  );

  return (
    <div className="w-96 bg-dark-surface border-r border-dark-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-xl font-bold mb-2">Selection</h2>
        <p className="text-sm text-dark-muted">
          Select observed techniques and software to identify potential APT groups
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Tactic Selector */}
        <div className="p-4 border-b border-dark-border">
          <label className="block text-sm font-medium mb-2">Filter by Tactic</label>
          <select
            value={selectedTactic}
            onChange={(e) => setSelectedTactic(e.target.value)}
            className="select"
          >
            <option value="">All Techniques</option>
            {tactics.map((tactic) => (
              <option key={tactic.id} value={tactic.shortname}>
                {tactic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Techniques */}
        <div className="p-4 border-b border-dark-border">
          <label className="block text-sm font-medium mb-2">Techniques</label>
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search techniques..."
              value={techniqueSearch}
              onChange={(e) => setTechniqueSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
            {searchedTechniques.map((technique) => (
              <button
                key={technique.id}
                onClick={() => addTechnique(technique.name)}
                disabled={selectedTechniques.includes(technique.name)}
                className="w-full text-left px-3 py-2 rounded hover:bg-dark-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <div className="font-medium">{technique.name}</div>
                <div className="text-xs text-dark-muted">{technique.externalId}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Software */}
        <div className="p-4 border-b border-dark-border">
          <label className="block text-sm font-medium mb-2">Software</label>
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search software..."
              value={softwareSearch}
              onChange={(e) => setSoftwareSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
            {filteredSoftwareList.map((sw) => (
              <button
                key={sw.id}
                onClick={() => addSoftware(sw.name)}
                disabled={selectedSoftware.includes(sw.name)}
                className="w-full text-left px-3 py-2 rounded hover:bg-dark-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <div className="font-medium">{sw.name}</div>
                <div className="text-xs text-dark-muted">
                  {sw.type} • {sw.externalId}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Items */}
        {(selectedTechniques.length > 0 || selectedSoftware.length > 0) && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Selected</label>
              <button
                onClick={clearAll}
                className="text-xs text-danger hover:underline inline-flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear All
              </button>
            </div>

            {selectedTechniques.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-dark-muted mb-1">Techniques:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedTechniques.map((tech) => (
                    <span
                      key={tech}
                      className="badge-primary inline-flex items-center gap-1 cursor-pointer hover:bg-primary/20"
                      onClick={() => removeTechnique(tech)}
                    >
                      {tech}
                      <X size={12} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSoftware.length > 0 && (
              <div>
                <div className="text-xs text-dark-muted mb-1">Software:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSoftware.map((sw) => (
                    <span
                      key={sw}
                      className="badge-warning inline-flex items-center gap-1 cursor-pointer hover:bg-warning/20"
                      onClick={() => removeSoftware(sw)}
                    >
                      {sw}
                      <X size={12} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Threshold and Analyze */}
      <div className="p-4 border-t border-dark-border bg-dark-bg">
        {/* Threshold Slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Match Threshold</label>
            <span className="text-sm font-bold text-primary">{threshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-dark-muted mt-1">
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Potential Matches */}
        <div className="mb-4 p-3 bg-dark-surface rounded-lg">
          <div className="text-sm text-dark-muted">Potential Matches above {threshold}%</div>
          <div className="text-2xl font-bold text-primary">{potentialMatches}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={
              (selectedTechniques.length === 0 && selectedSoftware.length === 0) ||
              potentialMatches === 0
            }
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
          >
            <Play size={16} />
            Analyze
          </button>
          <button onClick={handleReset} className="btn-secondary">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
