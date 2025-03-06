import React, { useState, useEffect, useRef } from 'react';
import { Search, QrCode, Check, X, Camera } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const Weighing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null);
  const [weight, setWeight] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mock data for demonstration
  const competitors = [
    { id: 1, firstName: 'Lucas', lastName: 'Martin', club: 'Judo Club Paris', ageCategory: 'Minimes', weightCategory: '-46kg', registeredWeight: null, status: 'pending', reference: 'JC-123456' },
    { id: 2, firstName: 'Emma', lastName: 'Bernard', club: 'Judo Club Lyon', ageCategory: 'Benjamins', weightCategory: '-40kg', registeredWeight: '39.2', status: 'confirmed', reference: 'JC-234567' },
    { id: 3, firstName: 'Thomas', lastName: 'Dubois', club: 'Judo Club Marseille', ageCategory: 'Minimes', weightCategory: '-46kg', registeredWeight: '46.8', status: 'changed', reference: 'JC-345678' },
    { id: 4, firstName: 'Léa', lastName: 'Petit', club: 'Judo Club Bordeaux', ageCategory: 'Benjamins', weightCategory: '-44kg', registeredWeight: null, status: 'pending', reference: 'JC-456789' },
    { id: 5, firstName: 'Maxime', lastName: 'Dupont', club: 'Judo Club Lille', ageCategory: 'Juniors', weightCategory: '-73kg', registeredWeight: '72.5', status: 'confirmed', reference: 'JC-567890' },
    { id: 6, firstName: 'Chloé', lastName: 'Leroy', club: 'Judo Club Toulouse', ageCategory: 'Cadets', weightCategory: '-57kg', registeredWeight: null, status: 'pending', reference: 'JC-678901' },
    { id: 7, firstName: 'Antoine', lastName: 'Moreau', club: 'Judo Club Nice', ageCategory: 'Juniors', weightCategory: '-73kg', registeredWeight: null, status: 'pending', reference: 'JC-789012' },
    { id: 8, firstName: 'Camille', lastName: 'Fournier', club: 'Judo Club Strasbourg', ageCategory: 'Cadets', weightCategory: '-63kg', registeredWeight: '62.1', status: 'confirmed', reference: 'JC-890123' },
  ];

  const filteredCompetitors = competitors.filter(competitor => 
    competitor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nettoyage du flux de la caméra lors du démontage du composant
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleCompetitorSelect = (competitor: any) => {
    setSelectedCompetitor(competitor);
    setWeight(competitor.registeredWeight || '');
    setScannedCode(null);
    stopCamera();
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the competitor's weight in the database
    console.log(`Weight ${weight}kg registered for ${selectedCompetitor.firstName} ${selectedCompetitor.lastName}`);
    // Reset form
    setSelectedCompetitor(null);
    setWeight('');
    setScannedCode(null);
  };

  const requestCameraPermission = async () => {
    try {
      // Vérifier si la caméra est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Votre navigateur ne prend pas en charge l'accès à la caméra");
        return;
      }

      // Demander la permission d'utiliser la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setCameraPermission('granted');
      setCameraStream(stream);
      
      // Connecter le flux vidéo à l'élément vidéo
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setScanning(true);
      startQRCodeScanning();
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra:", err);
      setCameraPermission('denied');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setScanning(false);
  };

  const startQRCodeScanning = () => {
    // Simuler la détection d'un QR code après un délai
    // Dans une application réelle, vous utiliseriez une bibliothèque comme jsQR
    const scanInterval = setInterval(() => {
      if (!scanning || !videoRef.current || !canvasRef.current) {
        clearInterval(scanInterval);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simuler la détection d'un QR code
        // Dans une application réelle, vous utiliseriez jsQR pour analyser l'image
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        // Pour la démonstration, on simule la détection après 3 secondes
        setTimeout(() => {
          if (scanning) {
            const randomCompetitor = competitors[Math.floor(Math.random() * competitors.length)];
            setScannedCode(randomCompetitor.reference);
            setSelectedCompetitor(randomCompetitor);
            setWeight(randomCompetitor.registeredWeight || '');
            stopCamera();
            clearInterval(scanInterval);
          }
        }, 3000);
      }
    }, 500);
  };

  const handleScanQRCode = () => {
    if (cameraPermission === 'prompt') {
      requestCameraPermission();
    } else if (cameraPermission === 'granted') {
      requestCameraPermission();
    } else {
      alert("L'accès à la caméra a été refusé. Veuillez modifier les paramètres de votre navigateur pour autoriser l'accès à la caméra.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmé</span>;
      case 'changed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Changé</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">En attente</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gestion de la pesée</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competitor Search */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <div className="flex space-x-2">
                <div className="flex-grow relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Rechercher un compétiteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleScanQRCode}
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <span className="animate-pulse">Scan en cours...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Scanner QR
                    </>
                  )}
                </button>
              </div>
            </div>

            {scanning && (
              <div className="mb-4">
                <div className="relative">
                  <video 
                    ref={videoRef} 
                    className="w-full h-64 object-cover rounded-lg"
                    playsInline
                  ></video>
                  <canvas 
                    ref={canvasRef} 
                    className="hidden"
                  ></canvas>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg opacity-70"></div>
                  </div>
                  <button
                    onClick={stopCamera}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-center mt-2 text-gray-600">
                  Placez le QR code dans le cadre pour le scanner
                </p>
              </div>
            )}

            {scannedCode && (
              <div className="mb-4 p-4 bg-green-50 rounded-md flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-green-700">QR Code scanné avec succès</p>
                  <p className="text-sm text-green-600">Référence: {scannedCode}</p>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Club
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Poids
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompetitors.map((competitor) => (
                    <tr 
                      key={competitor.id} 
                      className={selectedCompetitor?.id === competitor.id ? 'bg-indigo-50' : ''}
                      onClick={() => handleCompetitorSelect(competitor)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {competitor.lastName} {competitor.firstName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Réf: {competitor.reference}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{competitor.club}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{competitor.ageCategory} {competitor.weightCategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{competitor.registeredWeight ? `${competitor.registeredWeight} kg` : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(competitor.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleCompetitorSelect(competitor)}
                        >
                          Peser
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weight Registration Form */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Enregistrement du poids</h2>
            
            {selectedCompetitor ? (
              <form onSubmit={handleWeightSubmit}>
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700">Compétiteur sélectionné</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCompetitor.lastName} {selectedCompetitor.firstName}</p>
                    <p className="text-sm text-gray-500">{selectedCompetitor.club}</p>
                    <p className="text-sm text-gray-500">{selectedCompetitor.ageCategory} {selectedCompetitor.weightCategory}</p>
                    
                    <div className="mt-3">
                      <QRCodeGenerator 
                        value={selectedCompetitor.reference} 
                        size={100}
                        className="mx-auto"
                      />
                      <p className="text-xs text-center text-gray-500 mt-1">
                        {selectedCompetitor.reference}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Poids (kg)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.1"
                      id="weight"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      setSelectedCompetitor(null);
                      setWeight('');
                      setScannedCode(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Valider
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Sélectionnez un compétiteur pour enregistrer son poids</p>
                <div className="mt-4">
                  <button
                    onClick={handleScanQRCode}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={scanning}
                  >
                    {scanning ? (
                      <span className="animate-pulse">Scan en cours...</span>
                    ) : (
                      <>
                        <Camera className="h-5 w-5 mr-2 text-indigo-500" />
                        Scanner un QR Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weighing;