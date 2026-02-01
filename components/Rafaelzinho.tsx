import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './Button';

interface RafaelzinhoProps {
  onClose: () => void;
}

const IMAGES = {
  crossed: 'https://i.imgur.com/rA6rjPV.png',
  pointRight: 'https://i.imgur.com/05HGJe7.png',
  pointUp: 'https://i.imgur.com/XJPfZTC.png',
  waist: 'https://i.imgur.com/1stcsXz.png', // Mãos na cintura
  heart: 'https://i.imgur.com/QkSJibW.png', // Coraçãozinho
};

interface HighlightStyle {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
}

export const Rafaelzinho: React.FC<RafaelzinhoProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
    top: 0, left: 0, width: 0, height: 0, opacity: 0
  });
  
  // UseRef para guardar o timeout do resize e evitar chamadas excessivas
  const resizeTimeoutRef = useRef<number>(0);

  useEffect(() => {
    // Pequeno delay para animação de entrada
    setTimeout(() => setIsVisible(true), 500);
  }, []);

  const steps = [
    {
      text: "Olá! Eu sou o Rafaelzinho. Vou te mostrar como turbinar sua produtividade com este painel!",
      pose: IMAGES.crossed,
      targetId: null // Sem destaque
    },
    {
      text: "Aqui você filtra suas ferramentas. Selecione uma categoria para encontrar rápido o que precisa.",
      pose: IMAGES.pointUp,
      targetId: 'tour-categories'
    },
    {
      text: "Precisa de mais? Adicione novas ferramentas, troque o tema ou busque algo específico aqui.",
      pose: IMAGES.pointUp,
      targetId: 'tour-actions'
    },
    {
      text: "Ao clicar em um card, você abre o Workspace. Lá você pode adicionar até 4 ferramentas na mesma tela!",
      pose: IMAGES.pointRight,
      targetId: 'tour-grid'
    },
    {
      text: "Dica de Mestre: Dentro do Workspace, use o botão de expandir no canto da janela para focar totalmente em uma tarefa.",
      pose: IMAGES.waist,
      targetId: 'tour-grid'
    },
    {
      text: "Prontinho! Tudo configurado com muito carinho. Bom trabalho!",
      pose: IMAGES.heart,
      targetId: null
    }
  ];

  const updateHighlightPosition = () => {
    const currentTargetId = steps[step].targetId;
    
    if (!currentTargetId) {
      setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    const element = document.getElementById(currentTargetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = 12; // Espaço extra ao redor do elemento

      setHighlightStyle({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2),
        opacity: 1
      });
    } else {
      setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
    }
  };

  // Atualiza posição quando o passo muda
  useEffect(() => {
    // Pequeno delay para garantir que o DOM renderizou (útil em transições)
    setTimeout(updateHighlightPosition, 100);
  }, [step]);

  // Atualiza posição no resize da janela
  useEffect(() => {
    const handleResize = () => {
      window.cancelAnimationFrame(resizeTimeoutRef.current);
      resizeTimeoutRef.current = window.requestAnimationFrame(updateHighlightPosition);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize); // Opcional, se o highlight for fixed

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      window.cancelAnimationFrame(resizeTimeoutRef.current);
    };
  }, [step]);


  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setIsVisible(false);
    setHighlightStyle(prev => ({ ...prev, opacity: 0 })); // Esconde highlight
    setTimeout(onClose, 300); // Aguarda animação de saída
  };

  const currentStep = steps[step];

  return (
    <>
      {/* HIGHLIGHT BOX (Camada de destaque) */}
      <div 
        className="fixed z-40 border-4 border-primary rounded-2xl pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] box-border shadow-[0_0_0_9999px_rgba(0,0,0,0.5),0_0_30px_rgba(19,218,135,0.4)]"
        style={{
          top: highlightStyle.top,
          left: highlightStyle.left,
          width: highlightStyle.width,
          height: highlightStyle.height,
          opacity: highlightStyle.opacity,
          // Se opacity for 0, movemos para fora para não bloquear cliques acidentais ou atrapalhar layout
          transform: highlightStyle.opacity === 0 ? 'scale(1.1)' : 'scale(1)'
        }}
      />

      {/* RAFAELZINHO UI */}
      <div className={`fixed bottom-0 left-4 z-50 flex flex-col items-start transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        
        {/* Balão de Fala */}
        <div className="relative mb-2 ml-10 bg-white dark:bg-slate-800 p-5 rounded-2xl rounded-bl-none shadow-2xl border border-slate-200 dark:border-slate-700 max-w-xs animate-[fadeIn_0.3s_ease-out]">
          <button 
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-full p-1 hover:bg-red-100 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
          
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
            {currentStep.text}
          </p>

          {/* Controles do Tour */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <span className="text-xs text-slate-400 font-medium">
              {step + 1} de {steps.length}
            </span>
            <div className="flex gap-2">
              {step > 0 && (
                <button 
                  onClick={handlePrev}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <Button 
                size="sm" 
                onClick={handleNext} 
                className="!px-3 !py-1 text-xs"
              >
                {step === steps.length - 1 ? 'Concluir' : 'Próximo'} 
                {step < steps.length - 1 && <ChevronRight size={14} className="ml-1" />}
              </Button>
            </div>
          </div>

          {/* Seta do Balão */}
          <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white dark:bg-slate-800 border-b border-l border-slate-200 dark:border-slate-700 transform -skew-x-12 rotate-45"></div>
        </div>

        {/* Imagem do Personagem */}
        <div className="relative h-64 w-64 -mb-4 filter drop-shadow-xl transition-transform duration-300 hover:scale-105 origin-bottom">
          <img 
            src={currentStep.pose} 
            alt="Rafaelzinho" 
            className="w-full h-full object-contain"
            // Key ajuda a reiniciar a animação ao trocar de imagem
            key={step} 
          />
        </div>
      </div>
    </>
  );
};