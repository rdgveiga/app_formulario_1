import React, { useState } from 'react';
import { RespondiLogo } from './Icons';

interface OnboardingPageProps {
  onBack: () => void;
  onFinish: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onBack, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "1º qual sua pergunta?",
      description: "Escreva sua pergunta no centro da página. Escolha o tipo no menu suspenso.",
      // Using placeholders as local assets are not available
      image: "https://placehold.co/600x340/f9fafb/9ca3af?text=Passo+1:+Criar+Pergunta", 
      buttonText: "Próximo (1/3) →"
    },
    {
      id: 2,
      title: "2º Adicione mais perguntas",
      description: "Clique em adicionar campo na esquerda. Você pode reordenar arrastando um bloco.",
      image: "https://placehold.co/600x340/f9fafb/9ca3af?text=Passo+2:+Adicionar+Campos", 
      buttonText: "Próximo (2/3) →"
    },
    {
      id: 3,
      title: "3º Veja uma prévia ou publique o formulário",
      description: "Veja como seu formulário vai ficar. Se preferir, publique e compartilhe o link.",
      image: "https://placehold.co/600x340/f9fafb/9ca3af?text=Passo+3:+Publicar", 
      buttonText: "Iniciar meu formulário"
    }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const activeStep = steps.find(s => s.id === currentStep)!;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-inter">
      {/* Header */}
      <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center">
            <div className="cursor-pointer" onClick={onBack}>
                <RespondiLogo className="w-[120px] h-[30px]" />
            </div>
        </div>
        <div>
              <button 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 -mt-20">
        <div className="w-full max-w-[600px] text-center animate-fade-in">
           {/* Main Title */}
           <div className="mb-8">
              <h2 className="text-[28px] font-bold text-gray-900 leading-tight">Como criar seu formulário</h2>
           </div>

           {/* Step Content */}
           <div className="bg-transparent">
              <div className="mb-4">
                 <h2 className="text-[20px] font-bold text-gray-900 mb-2">{activeStep.title}</h2>
                 <p className="text-[15px] text-gray-600 max-w-md mx-auto leading-relaxed">{activeStep.description}</p>
              </div>

              <div className="mb-4 flex justify-center">
                 <img 
                    src={activeStep.image} 
                    alt={`Step ${currentStep}`} 
                    className="rounded-lg shadow-sm border border-gray-200 max-w-full h-auto object-cover bg-white"
                    style={{ maxHeight: '300px', width: '100%' }}
                 />
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={handleNext}
                  className="bg-[#111827] hover:bg-black text-white font-medium py-3 px-8 rounded shadow-sm hover:shadow transition duration-150 text-[15px] min-w-[200px]"
                >
                  {activeStep.buttonText}
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;