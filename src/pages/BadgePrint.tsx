import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { useCompetitors } from '../hooks/useCompetitors';

interface BadgePrintProps {
  type: 'competitor' | 'volunteer';
}

const BadgePrint: React.FC<BadgePrintProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { competitors } = useCompetitors();

  // Mock data for volunteers
  const volunteers = [
    { 
      id: '1', 
      firstName: 'Jean', 
      lastName: 'Dupont', 
      club: 'Judo Club Paris', 
      role: 'Arbitre', 
      timeSlots: ['Samedi Matin', 'Samedi Après-midi'],
      points: 15,
      status: 'confirmed',
      reference: 'VOL-123456'
    },
    { 
      id: '2', 
      firstName: 'Marie', 
      lastName: 'Martin', 
      club: 'Judo Club Lyon', 
      role: 'Agent de pesée', 
      timeSlots: ['Dimanche Matin'],
      points: 5,
      status: 'confirmed',
      reference: 'VOL-234567'
    },
  ];

  // Find the entity based on type and id
  const entity = type === 'competitor' 
    ? competitors.find(c => c.id === id)
    : volunteers.find(v => v.id === id);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Badge_${type}_${id}`,
  });

  // Définir la couleur du bandeau en fonction du type
  const headerBgColor = type === 'competitor' ? 'bg-indigo-600' : 'bg-green-600';

  if (!entity) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              onClick={() => navigate(type === 'competitor' ? '/competitors' : '/volunteers')}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Impression de badge</h1>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Aucune donnée trouvée pour ce {type === 'competitor' ? 'compétiteur' : 'bénévole'}.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate(type === 'competitor' ? '/competitors' : '/volunteers')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Impression de badge</h1>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-sm text-gray-500 mb-4">
          Aperçu du badge au format carte de crédit (85.6mm × 54mm). Cliquez sur "Imprimer" pour imprimer le badge.
        </p>

        {/* Badge preview */}
        <div className="flex justify-center">
          <div 
            ref={printRef}
            className="w-[85.6mm] h-[54mm] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
            style={{ pageBreakInside: 'avoid' }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className={`${headerBgColor} text-white p-2 text-center`}>
                <h2 className="text-lg font-bold">JudoComp</h2>
                <p className="text-xs">
                  {type === 'competitor' ? 'Compétiteur' : 'Bénévole'} - {new Date().getFullYear()}
                </p>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-2 flex">
                {/* Left side - QR Code */}
                <div className="w-1/3 flex flex-col items-center justify-center">
                  <QRCodeGenerator 
                    value={type === 'competitor' 
                      ? (entity as any).reference_number || id 
                      : (entity as any).reference
                    } 
                    size={80}
                    className="mb-1"
                  />
                  <p className="text-[7px] text-center text-gray-500">
                    {type === 'competitor' 
                      ? (entity as any).reference_number || id 
                      : (entity as any).reference
                    }
                  </p>
                </div>
                
                {/* Right side - Info */}
                <div className="w-2/3 pl-2 flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-gray-900">
                    {type === 'competitor' 
                      ? `${(entity as any).last_name} ${(entity as any).first_name}`
                      : `${(entity as any).lastName} ${(entity as any).firstName}`
                    }
                  </h3>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {type === 'competitor' 
                      ? `${(entity as any).club?.name || 'Club non spécifié'}`
                      : `${(entity as any).club}`
                    }
                  </p>
                  
                  {type === 'competitor' ? (
                    <>
                      <p className="text-xs text-gray-600 mt-1">
                        {(entity as any).age_category} {(entity as any).weight_category}
                      </p>
                      <p className="text-xs text-gray-600">
                        Ceinture: {(entity as any).belt}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-600 mt-1">
                        Rôle: {(entity as any).role}
                      </p>
                      <p className="text-xs text-gray-600">
                        Créneaux: {(entity as any).timeSlots.join(', ')}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-100 p-1 text-center">
                <p className="text-[8px] text-gray-500">
                  En cas d'urgence: {type === 'competitor' ? (entity as any).emergency_contact : 'Contacter l\'organisation'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgePrint;