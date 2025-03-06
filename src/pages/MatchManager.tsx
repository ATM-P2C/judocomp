import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, RotateCcw, ChevronLeft, Save, 
  Plus, Minus, Award, Clock, AlertTriangle
} from 'lucide-react';

const MatchManager = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);
  const [time, setTime] = useState(240); // 4 minutes en secondes
  const [isRunning, setIsRunning] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [penalties1, setPenalties1] = useState(0);
  const [penalties2, setPenalties2] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [winMethod, setWinMethod] = useState<string | null>(null);
  const [showTimeAdjust, setShowTimeAdjust] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simuler le chargement des données du match
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const mockMatch = {
      id: matchId,
      category: 'Minimes -46kg',
      round: 'Demi-finale',
      competitor1: {
        id: 1,
        name: 'Lucas Martin',
        club: 'Judo Club Paris',
      },
      competitor2: {
        id: 2,
        name: 'Thomas Dubois',
        club: 'Judo Club Marseille',
      },
      tatami: 'Tatami 1',
      status: 'in_progress',
    };
    
    setMatch(mockMatch);
  }, [matchId]);

  // Gestion du chronomètre
  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setTimeout(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Logique de fin de match par temps écoulé
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, time]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(240); // 4 minutes
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (seconds: number) => {
    setTime(prevTime => Math.max(0, prevTime + seconds));
  };

  const addScore = (competitor: number, points: number) => {
    if (competitor === 1) {
      setScore1(prevScore => prevScore + points);
      if (points === 10) { // Ippon
        endMatch(match.competitor1.name, 'Ippon');
      }
    } else {
      setScore2(prevScore => prevScore + points);
      if (points === 10) { // Ippon
        endMatch(match.competitor2.name, 'Ippon');
      }
    }
  };

  const removeScore = (competitor: number, points: number) => {
    if (competitor === 1) {
      setScore1(prevScore => Math.max(0, prevScore - points));
    } else {
      setScore2(prevScore => Math.max(0, prevScore - points));
    }
  };

  const addPenalty = (competitor: number) => {
    if (competitor === 1) {
      const newPenalties = penalties1 + 1;
      setPenalties1(newPenalties);
      if (newPenalties === 3) { // Hansoku-make
        endMatch(match.competitor2.name, 'Hansoku-make');
      }
    } else {
      const newPenalties = penalties2 + 1;
      setPenalties2(newPenalties);
      if (newPenalties === 3) { // Hansoku-make
        endMatch(match.competitor1.name, 'Hansoku-make');
      }
    }
  };

  const removePenalty = (competitor: number) => {
    if (competitor === 1) {
      setPenalties1(prevPenalties => Math.max(0, prevPenalties - 1));
    } else {
      setPenalties2(prevPenalties => Math.max(0, prevPenalties - 1));
    }
  };

  const endMatch = (winnerName: string, method: string) => {
    setIsRunning(false);
    setWinner(winnerName);
    setWinMethod(method);
  };

  const saveMatch = () => {
    // Dans une application réelle, vous enverriez les résultats à l'API
    console.log('Match sauvegardé', {
      matchId,
      score1,
      score2,
      penalties1,
      penalties2,
      winner,
      winMethod,
      timeRemaining: time,
    });
    
    // Rediriger vers la page des matchs
    navigate('/matches');
  };

  if (!match) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/matches')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux combats
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion du combat</h1>
          <p className="text-sm text-gray-500">
            {match.category} • {match.round} • {match.tatami}
          </p>
        </div>
        <div>
          <button
            onClick={saveMatch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Chronomètre */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold mb-4 font-mono">
              {formatTime(time)}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleTimer}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Démarrer
                  </>
                )}
              </button>
              <button
                onClick={resetTimer}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </button>
              <button
                onClick={() => setShowTimeAdjust(!showTimeAdjust)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Clock className="h-4 w-4 mr-2" />
                Ajuster
              </button>
            </div>

            {showTimeAdjust && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ajuster le temps</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => adjustTime(-10)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    -10s
                  </button>
                  <button
                    onClick={() => adjustTime(-30)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    -30s
                  </button>
                  <button
                    onClick={() => adjustTime(10)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    +10s
                  </button>
                  <button
                    onClick={() => adjustTime(30)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    +30s
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tableau de score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Compétiteur 1 */}
        <div className={`bg-white shadow rounded-lg overflow-hidden ${winner === match.competitor1.name ? 'ring-2 ring-green-500' : ''}`}>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{match.competitor1.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{match.competitor1.club}</p>
              
              <div className="text-5xl font-bold mb-6">{score1}</div>
              
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-4">
                <button
                  onClick={() => addScore(1, 1)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  +1
                </button>
                <button
                  onClick={() => addScore(1, 7)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  +7
                </button>
                <button
                  onClick={() => addScore(1, 10)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  +10
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-6">
                <button
                  onClick={() => removeScore(1, 1)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  -1
                </button>
                <button
                  onClick={() => removeScore(1, 7)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  -7
                </button>
                <button
                  onClick={() => removeScore(1, 10)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  -10
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-medium text-gray-700">Pénalités:</h3>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-full border ${
                        i < penalties1 ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-100 border-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => addPenalty(1)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Pénalité
                </button>
                <button
                  onClick={() => removePenalty(1)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Pénalité
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compétiteur 2 */}
        <div className={`bg-white shadow rounded-lg overflow-hidden ${winner === match.competitor2.name ? 'ring-2 ring-green-500' : ''}`}>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{match.competitor2.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{match.competitor2.club}</p>
              
              <div className="text-5xl font-bold mb-6">{score2}</div>
              
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-4">
                <button
                  onClick={() => addScore(2, 1)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  +1
                </button>
                <button
                  onClick={() => addScore(2, 7)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  +7
                </button>
                <button
                  onClick={() => addScore(2, 10)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  +10
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-6">
                <button
                  onClick={() => removeScore(2, 1)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  -1
                </button>
                <button
                  onClick={() => removeScore(2, 7)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  -7
                </button>
                <button
                  onClick={() => removeScore(2, 10)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  -10
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-medium text-gray-700">Pénalités:</h3>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-full border ${
                        i < penalties2 ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-100 border-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => addPenalty(2)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Pénalité
                </button>
                <button
                  onClick={() => removePenalty(2)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Pénalité
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions de fin de match */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fin du combat</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => endMatch(match.competitor1.name, 'Décision')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Award className="h-4 w-4 mr-2" />
              Victoire {match.competitor1.name}
            </button>
            
            <button
              onClick={() => endMatch(match.competitor2.name, 'Décision')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Award className="h-4 w-4 mr-2" />
              Victoire {match.competitor2.name}
            </button>
          </div>
          
          {winner && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start">
                <Award className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Combat terminé</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Victoire de <strong>{winner}</strong> par {winMethod}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchManager;