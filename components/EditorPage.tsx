import React, { useState, useRef, useEffect } from 'react';

interface EditorPageProps {
  formTitle: string;
  initialTab?: string;
  onBack: () => void;
}

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  required: boolean;
  options?: string[]; // For multiple choice
  listOptions?: string; // For list selection
  uploadedFile?: File | null; // For file upload
}

// Answer Interface
interface Answer {
    id: number;
    date: string;
    duration: string;
    answers: Record<string, string>;
}

const EditorPage: React.FC<EditorPageProps> = ({ formTitle, initialTab = 'editor', onBack }) => {
  // Use the prop to set initial state
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // --- GLOBAL FORM STATE ---
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSharePopover, setShowSharePopover] = useState(false);
  
  // Generate consistent URL
  const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const shareUrl = `https://form.respondido.app/${slug || 'meu-formulario'}-${Math.floor(Math.random() * 1000)}`;

  // --- STATE FOR EDITOR TAB ---
  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: '1', 
      type: 'Nome próprio', 
      title: 'Qual é o seu nome?', 
      description: '', 
      required: true 
    },
    { 
        id: '2', 
        type: 'E-mail', 
        title: 'Qual seu melhor e-mail?', 
        description: '', 
        required: true 
    },
    { 
        id: '3', 
        type: 'Escala de satisfação', 
        title: 'Como você avalia nosso serviço?', 
        description: '', 
        required: false 
    },
    { 
      id: 'end', 
      type: 'Agradecimento', 
      title: 'Obrigado por participar!', 
      description: '', 
      required: false 
    }
  ]);
  const [activeQuestionId, setActiveQuestionId] = useState<string>('1');
  const [newOptionInput, setNewOptionInput] = useState('');
  
  // Ref for the file input in the editor preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE FOR OPTIONS TAB ---
  const [settingsTitle, setSettingsTitle] = useState(formTitle);
  // Default Colors
  const [buttonColor, setButtonColor] = useState('#2979FF'); // Blue
  const [questionColor, setQuestionColor] = useState('#263238'); // Dark Gray
  const [answerColor, setAnswerColor] = useState('#2979FF'); // Blue
  const [bgColor, setBgColor] = useState('#ffffff'); // White
  
  // Images
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [font, setFont] = useState('Lato');
  const [borderRadius, setBorderRadius] = useState(2); // 0 to 8
  const [removeBranding, setRemoveBranding] = useState(false);

  // --- STATE FOR SHARE TAB ---
  const [embedMode, setEmbedMode] = useState('regular'); // regular, fullscreen, buttonLink, buttonModal
  const [embedWidth, setEmbedWidth] = useState('100');
  const [embedWidthUnit, setEmbedWidthUnit] = useState('%');
  const [embedHeight, setEmbedHeight] = useState('500');
  const [embedHeightUnit, setEmbedHeightUnit] = useState('px');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // --- STATE FOR ANSWERS TAB ---
  const [answersView, setAnswersView] = useState<'summary' | 'individual'>('summary');
  const [answersList, setAnswersList] = useState<Answer[]>([]);
  const [viewsCount, setViewsCount] = useState(0);
  const [startsCount, setStartsCount] = useState(0);


  // --- HELPER FUNCTIONS FOR EDITOR ---
  const activeQuestion = questions.find(q => q.id === activeQuestionId) || questions[0];
  const activeIndex = questions.findIndex(q => q.id === activeQuestionId);

  const updateActiveQuestion = (updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === activeQuestionId ? { ...q, ...updates } : q));
  };

  const addQuestion = () => {
    const newId = Date.now().toString();
    const newQuestion: Question = {
      id: newId,
      type: 'Resposta curta',
      title: 'Nova pergunta...',
      description: '',
      required: false
    };
    const lastIsThankYou = questions[questions.length - 1].type === 'Agradecimento';
    let newQuestions = [...questions];
    if (lastIsThankYou) {
        newQuestions.splice(newQuestions.length - 1, 0, newQuestion);
    } else {
        newQuestions.push(newQuestion);
    }
    setQuestions(newQuestions);
    setActiveQuestionId(newId);
  };

  const addQuestionAtIndex = (index: number) => {
    const newId = Date.now().toString();
    const newQuestion: Question = {
      id: newId,
      type: 'Resposta curta',
      title: 'Nova pergunta...',
      description: '',
      required: false
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions);
    setActiveQuestionId(newId);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const removeActiveQuestion = () => {
    if (questions.length <= 1) return; 
    const newQuestions = questions.filter(q => q.id !== activeQuestionId);
    setQuestions(newQuestions);
    const prevIndex = Math.max(0, activeIndex - 1);
    setActiveQuestionId(newQuestions[prevIndex].id);
  };

  const handleNextQuestion = () => {
    if (activeIndex < questions.length - 1) {
      setActiveQuestionId(questions[activeIndex + 1].id);
    }
  };

  const handlePrevQuestion = () => {
    if (activeIndex > 0) {
      setActiveQuestionId(questions[activeIndex - 1].id);
    }
  };

  const addOption = () => {
    if (!newOptionInput.trim()) return;
    const currentOptions = activeQuestion.options || ['Opção 1'];
    updateActiveQuestion({ options: [...currentOptions, newOptionInput] });
    setNewOptionInput('');
  };

  const removeOption = (idxToRemove: number) => {
    const currentOptions = activeQuestion.options || [];
    updateActiveQuestion({ options: currentOptions.filter((_, idx) => idx !== idxToRemove) });
  };

  const updateOptionText = (idxToUpdate: number, text: string) => {
    const currentOptions = activeQuestion.options || [];
    const newOptions = [...currentOptions];
    newOptions[idxToUpdate] = text;
    updateActiveQuestion({ options: newOptions });
  };

  // --- ACTIONS ---
  
  const handlePublish = () => {
      setIsPublishing(true);
      // Simulate API call
      setTimeout(() => {
          setIsPublished(true);
          setIsPublishing(false);
          setShowSharePopover(true); // Open the share popup on success
      }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // --- FILE UPLOAD HANDLERS FOR EDITOR CONTENT ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateActiveQuestion({ uploadedFile: e.target.files[0] });
    }
  };

  const removeUploadedFile = () => {
    updateActiveQuestion({ uploadedFile: null });
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // --- IMAGE UPLOAD HANDLERS FOR SETTINGS ---
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setBackgroundImage(ev.target?.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setLogoImage(ev.target?.result as string);
          };
          reader.readAsDataURL(file);
      }
  };


  // --- RENDERERS ---

  // Helper to get font family style
  const getFontFamily = (fontName: string) => {
      switch(fontName) {
          case 'Lato': return 'Lato, sans-serif';
          case 'Roboto': return 'Roboto, sans-serif';
          case 'Open Sans': return 'Open Sans, sans-serif';
          default: return 'Inter, sans-serif';
      }
  };

  const renderInputArea = () => {
    // Dynamic Styles based on Settings
    const inputStyle = { color: answerColor, borderColor: buttonColor };
    const placeholderClass = `placeholder-opacity-50`; // We can't dynamically style placeholder color easily in inline styles without CSS vars, so we keep it subtle.
    const buttonStyle = { backgroundColor: buttonColor, borderRadius: `${borderRadius * 4}px` };

    switch (activeQuestion.type) {
      case 'Resposta curta':
      case 'Nome próprio':
        return (
          <div className="border-b-2 w-full py-2" style={{ borderBottomColor: buttonColor }}>
            <input 
              type="text" 
              disabled
              style={{ color: answerColor }}
              className={`w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed ${placeholderClass}`}
              placeholder="Sua resposta..."
            />
          </div>
        );
      case 'Texto longo':
        return (
          <div className="border-b-2 border-gray-200 w-full py-2">
            <textarea disabled rows={1} className="w-full bg-transparent text-xl text-gray-400 placeholder-gray-300 border-none p-0 focus:ring-0 cursor-not-allowed resize-none" placeholder="Sua resposta..." />
          </div>
        );
      case 'E-mail':
        return (
          <div className="border-b-2 w-full py-2" style={{ borderBottomColor: buttonColor }}>
            <input type="email" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed" placeholder="exemplo@exemplo.com" />
          </div>
        );
      case 'Telefone':
        return (
          <div className="border-b-2 w-full py-2 flex items-center gap-3" style={{ borderBottomColor: buttonColor }}>
            <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
               <img src="https://flagcdn.com/w40/br.png" alt="Brazil Flag" className="w-6 h-auto rounded-sm shadow-sm opacity-80" />
               <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
            </div>
            <input type="text" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed" placeholder="( 00 ) 00000-0000" />
          </div>
        );
      case 'Data':
        return (
          <div className="border-b-2 w-full py-2" style={{ borderBottomColor: buttonColor }}>
            <input type="text" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed uppercase" placeholder="DD / MM / AAAA" />
          </div>
        );
      case 'Calendly':
        return (
          <div className="w-full flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
             <div className="flex items-center gap-2 mb-4">
                <div className="text-[#006BFF] font-bold text-2xl flex items-center gap-1">
                    <span className="text-3xl">C</span> Calendly
                </div>
             </div>
             <p className="text-sm text-gray-600 text-center mb-6 max-w-lg">A integração com o Calendly permite que você tenha um calendário no seu formulário.</p>
             <div className="flex w-full max-w-md gap-2">
                <input type="text" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600 placeholder-gray-400" placeholder="https://calendly.com/xxxx" />
                <button className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">Adicionar</button>
             </div>
          </div>
        );
      case 'Link':
        return (
          <div className="border-b-2 w-full py-2" style={{ borderBottomColor: buttonColor }}>
            <input type="text" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed" placeholder="https://exemplo.com" />
          </div>
        );
      case 'Documento de identidade':
      case 'CPF':
      case 'CNPJ':
      case 'Número':
      case 'Valor monetário':
        return (
            <div className="border-b-2 w-full py-2" style={{ borderBottomColor: buttonColor }}>
                <input type="text" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed" placeholder={activeQuestion.type === 'Valor monetário' ? 'R$ 0,00' : '...'} />
            </div>
        );
      case 'Endereço':
        return (
          <div className="border-b-2 w-full py-2 flex items-center gap-2" style={{ borderBottomColor: buttonColor }}>
             <input type="text" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed" placeholder="CEP" />
             <div className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> Endereço internacional
             </div>
          </div>
        );
      case 'Múltipla escolha':
        const options = activeQuestion.options || ['exemplo 1', 'exemplo 2', 'exemplo 3'];
        return (
            <div className="w-full space-y-3">
                {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-md transition-colors group" style={{ borderColor: buttonColor, backgroundColor: `${buttonColor}10` }}>
                        <div className="w-6 h-6 rounded border bg-white flex items-center justify-center text-xs font-bold uppercase shrink-0" style={{ borderColor: buttonColor, color: buttonColor }}>{String.fromCharCode(65 + idx)}</div>
                        <input type="text" value={opt} onChange={(e) => updateOptionText(idx, e.target.value)} style={{ color: answerColor }} className="flex-1 text-base font-medium bg-transparent border-none focus:ring-0 p-0" />
                        <button onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1" title="Remover opção">
                            <svg className="w-4 h-4" viewBox="0 0 448 512" fill="currentColor"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                        </button>
                    </div>
                ))}
                <div className="relative">
                    <input type="text" value={newOptionInput} onChange={(e) => setNewOptionInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addOption()} className="w-full p-3 border border-dashed border-gray-300 rounded-md text-gray-600 text-sm hover:bg-gray-50 focus:bg-white focus:outline-none transition-colors placeholder-gray-400 pl-4" placeholder="Novo item..." />
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={addOption} style={buttonStyle} className="text-white text-sm font-medium px-6 py-2 shadow-sm opacity-90 hover:opacity-100 transition-opacity">Adicionar</button>
                </div>
            </div>
        );
      case 'Seleção de lista':
        return (
            <div className="w-full">
                <div className="relative border-b-2 border-gray-200 py-2 mb-6">
                    <div className="flex justify-between items-center text-gray-400 text-xl px-2">
                        <span className="font-light">Selecione</span>
                        <svg className="w-4 h-4" viewBox="0 0 448 512" fill="currentColor"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                    </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500">Adicione um item por linha.</p>
                        <div className="flex gap-3 text-xs font-medium" style={{ color: buttonColor }}>
                            <button className="hover:underline">Estados</button>
                            <button className="hover:underline">Países</button>
                            <button className="hover:underline">Área de atuação</button>
                        </div>
                    </div>
                    <textarea className="w-full h-32 text-sm border border-gray-300 rounded p-3 focus:outline-none resize-none text-gray-700" value={activeQuestion.listOptions || `exemplo 1\nexemplo 2\nexemplo 3`} onChange={(e) => updateActiveQuestion({ listOptions: e.target.value })}></textarea>
                    <div className="flex justify-start mt-3">
                        <button className="text-xs font-medium border px-3 py-1.5 rounded transition-colors" style={{ color: buttonColor, borderColor: buttonColor, backgroundColor: 'transparent' }}>Atualizar itens</button>
                    </div>
                </div>
            </div>
        );
      case 'Escala de satisfação':
        return (
            <div className="w-full">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-4 pt-2 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <div key={num} className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 border rounded flex items-center justify-center font-medium hover:bg-opacity-10 cursor-pointer transition-colors shadow-sm" style={{ borderColor: buttonColor, color: buttonColor, borderRadius: `${borderRadius * 2}px` }}>{num}</div>
                    ))}
                </div>
                <div className="flex justify-between text-xs px-1" style={{ color: `${buttonColor}80` }}><span>Legenda</span><span>Legenda</span><span>Legenda</span></div>
            </div>
        );
      case 'Seleção de imagem':
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="aspect-square bg-opacity-10 border rounded-md flex flex-col items-center justify-center gap-3 p-4 cursor-pointer transition-colors group relative" style={{ backgroundColor: `${buttonColor}10`, borderColor: `${buttonColor}40` }}>
                        <div className="w-12 h-12 rounded-full bg-opacity-20 flex items-center justify-center mb-1 group-hover:bg-opacity-30 transition-colors" style={{ backgroundColor: `${buttonColor}20` }}>
                             <svg className="w-6 h-6" style={{ color: buttonColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <div className="text-center"><span className="text-xs block mb-1 opacity-60" style={{ color: buttonColor }}>Selecione um arquivo</span><span className="text-sm font-medium" style={{ color: answerColor }}>exemplo {item}</span></div>
                        <div className="absolute top-3 left-3 w-6 h-6 bg-white rounded border flex items-center justify-center text-xs font-bold shadow-sm" style={{ borderColor: `${buttonColor}40`, color: buttonColor }}>{String.fromCharCode(64 + item)}</div>
                    </div>
                ))}
            </div>
        );
      case 'Arquivo anexo':
        return (
            <div className="w-full flex flex-col items-center justify-center py-6">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                {activeQuestion.uploadedFile ? (
                    <div className="flex items-center gap-3 p-4 border rounded-lg w-full max-w-sm" style={{ borderColor: `${buttonColor}40`, backgroundColor: `${buttonColor}10` }}>
                        <svg className="w-8 h-8" style={{ color: buttonColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{activeQuestion.uploadedFile.name}</p>
                            <p className="text-xs text-gray-500">{(activeQuestion.uploadedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button onClick={removeUploadedFile} className="text-gray-400 hover:text-red-500 transition-colors p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                ) : (
                    <button onClick={triggerFileUpload} className="flex items-center gap-2 font-medium border rounded-md px-6 py-3 transition-colors shadow-sm" style={{ color: buttonColor, borderColor: `${buttonColor}60`, backgroundColor: 'transparent' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Selecione um arquivo
                    </button>
                )}
            </div>
        );
      case 'Termos de uso':
        return (
            <div className="w-full space-y-6">
                <div className="text-gray-400 text-sm leading-relaxed border-l-2 border-gray-200 pl-4">Adicione os termos de uso ou outro texto legal aqui...<br/>.......<br/>.....<br/>...</div>
                <div className="flex gap-3">
                    <button style={buttonStyle} className="text-white px-6 py-2 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Eu aceito</button>
                    <button className="bg-white border px-6 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm" style={{ color: buttonColor, borderColor: `${buttonColor}40`, borderRadius: `${borderRadius * 4}px` }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Não aceito</button>
                </div>
            </div>
        );
      case 'Mensagem':
        return (<div className="w-full flex justify-center py-4"><button style={buttonStyle} className="text-white px-10 py-3 font-medium text-sm hover:opacity-90 transition-opacity shadow-sm">Continuar →</button></div>);
      case 'Boas-vindas':
        return (<div className="w-full flex justify-center py-4"><button style={buttonStyle} className="text-white px-10 py-3 font-medium text-sm hover:opacity-90 transition-opacity shadow-sm">Começar →</button></div>);
      case 'Agradecimento':
        return (<div className="flex flex-col items-center gap-6 text-center py-8"><div style={{ color: questionColor }}><svg className="w-20 h-20 rotate-12" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></div></div>);
      default:
        return (<div className="border-b-2 w-full py-2" style={{ borderBottomColor: buttonColor }}><input type="text" disabled style={{ color: answerColor }} className="w-full bg-transparent text-xl border-none p-0 focus:ring-0 cursor-not-allowed" placeholder="Sua resposta..." /></div>);
    }
  };

  const renderOptionsTab = () => {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Configurações</h1>
            
            <div className="space-y-8">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Título do formulário:</label>
                    <div className="relative">
                        <input type="text" value={settingsTitle} onChange={(e) => setSettingsTitle(e.target.value)} maxLength={60} className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-blue-500 transition-colors text-gray-800" placeholder="Sua resposta..." />
                        <span className="absolute right-0 bottom-2 text-xs text-gray-400">{settingsTitle.length}/60</span>
                    </div>
                </div>

                {/* Style Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Personalizar estilo</h2>
                    <p className="text-sm text-gray-500 mb-6">Adicione o seu logotipo e cores personalizadas.</p>

                    <div className="space-y-4">
                        {[
                            { label: 'Cor do botão:', val: buttonColor, set: setButtonColor },
                            { label: 'Cor da pergunta:', val: questionColor, set: setQuestionColor },
                            { label: 'Cor da resposta:', val: answerColor, set: setAnswerColor },
                            { label: 'Cor de fundo:', val: bgColor, set: setBgColor }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">{item.label}</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm overflow-hidden relative">
                                        <input 
                                            type="color" 
                                            value={item.val} 
                                            onChange={(e) => item.set(e.target.value)}
                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                        />
                                    </div>
                                    <input type="text" value={item.val} onChange={(e) => item.set(e.target.value)} className="w-24 border border-gray-200 rounded px-2 py-1 text-sm text-gray-600 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem de fundo:</label>
                        <p className="text-xs text-gray-500 mb-3">Essa imagem irá aparecer no fundo do seu formulário. cuidado com o contraste.</p>
                        
                        <input 
                            type="file" 
                            ref={bgInputRef} 
                            onChange={handleBackgroundUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        
                        {backgroundImage ? (
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-12 rounded border border-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
                                <button onClick={() => setBackgroundImage(null)} className="text-red-500 text-sm hover:underline">Remover imagem</button>
                            </div>
                        ) : (
                            <button onClick={() => bgInputRef.current?.click()} className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 border border-blue-200 rounded px-4 py-2 hover:bg-blue-100 transition-colors text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 215c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71L280 392c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-214.1-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 103c9.4-9.4 24.6-9.4 33.9 0L385 215z"></path></svg>
                                Selecione um arquivo
                            </button>
                        )}
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Logotipo</label>
                        <p className="text-xs text-gray-500 mb-3">Se desejar, adicione um logotipo. Ele aparece no topo do formulário.</p>
                        
                        <input 
                            type="file" 
                            ref={logoInputRef} 
                            onChange={handleLogoUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        
                        {logoImage ? (
                            <div className="flex items-center gap-4">
                                <img src={logoImage} alt="Logo" className="h-10 w-auto border border-gray-200 rounded p-1" />
                                <button onClick={() => setLogoImage(null)} className="text-red-500 text-sm hover:underline">Remover logo</button>
                            </div>
                        ) : (
                            <button onClick={() => logoInputRef.current?.click()} className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 border border-blue-200 rounded px-4 py-2 hover:bg-blue-100 transition-colors text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 215c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71L280 392c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-214.1-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 103c9.4-9.4 24.6-9.4 33.9 0L385 215z"></path></svg>
                                Selecione um arquivo
                            </button>
                        )}
                    </div>

                    <div className="mt-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fonte</label>
                        <p className="text-xs text-gray-500 mb-3">+80 fontes diferentes para você escolher</p>
                        <div className="relative">
                            <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full appearance-none border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white">
                                <option>Lato</option>
                                <option>Inter</option>
                                <option>Roboto</option>
                                <option>Open Sans</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"><svg className="w-3 h-3" viewBox="0 0 448 512" fill="currentColor"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bordas</label>
                        <p className="text-xs text-gray-500 mb-3">Bordas mais redondas ou quadradas?</p>
                        <div className="flex items-center gap-4">
                            <input type="range" min="0" max="8" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                            <button className="px-4 py-2 border border-gray-300 text-sm text-gray-700 bg-white transition-all" style={{ borderRadius: `${borderRadius * 4}px` }}>Botão de exemplo</button>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Remover a marca Respondido <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">PRO</span></label>
                            <p className="text-xs text-gray-500 mt-1">Não exibe a nossa mensagem ao final do formulário.</p>
                        </div>
                        <button onClick={() => setRemoveBranding(!removeBranding)} className={`w-10 h-5 rounded-full relative transition-colors ${removeBranding ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${removeBranding ? 'left-6' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderShareTab = () => {
    
    const handleSocialShare = (platform: string) => {
        let url = '';
        const text = `Confira meu formulário: ${formTitle}`;
        switch(platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
                break;
        }
        if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    const handleGenerateCode = () => {
        let code = '';
        if (embedMode === 'regular') {
            code = `<iframe src="${shareUrl}" width="${embedWidth}${embedWidthUnit}" height="${embedHeight}${embedHeightUnit}" frameborder="0" style="border:0; border-radius: 8px;"></iframe>`;
        } else if (embedMode === 'fullscreen') {
            code = `<style>body,html{margin:0;padding:0;height:100%;overflow:hidden;}</style><iframe src="${shareUrl}" width="100%" height="100%" frameborder="0" style="border:0; position:absolute; top:0; left:0;"></iframe>`;
        } else {
             code = `<a href="${shareUrl}" target="_blank" style="background-color: ${buttonColor}; color: #fff; padding: 12px 24px; border-radius: ${borderRadius * 4}px; text-decoration: none; font-family: ${font}, sans-serif;">Abrir Formulário</a>`;
        }
        setGeneratedCode(code);
        setShowEmbedCode(true);
    };

    return (
       <div className="flex flex-col md:flex-row h-full overflow-hidden">
           {/* Options Column */}
           <div className="w-full md:w-1/2 lg:w-5/12 p-6 md:p-8 overflow-y-auto border-r border-gray-200 bg-white">
               {/* Link Section */}
               <div className="mb-8">
                   <h3 className="text-lg font-bold text-gray-900 mb-1">Link</h3>
                   <p className="text-sm text-gray-500 mb-4">Envie esse link por e-mail, ou compartilhe nas suas redes sociais.</p>
                   
                   {/* Warning Box - Only show if NOT published */}
                   {!isPublished && (
                       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex gap-3">
                            <div className="text-yellow-600 mt-0.5">
                                <svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                            </div>
                            <div className="text-sm text-yellow-800">
                                <span className="font-medium">Existe um rascunho não publicado</span>
                                <div className="text-xs mt-1 text-yellow-700">Este formulário possui uma versão mais recente que ainda não foi publicada.</div>
                            </div>
                       </div>
                   )}

                   {/* URL Input */}
                   <div className="flex gap-2 mb-4">
                       <div className="relative flex-1 group">
                            <input type="text" readOnly value={shareUrl} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-600 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors cursor-text" onClick={(e) => e.currentTarget.select()} />
                       </div>
                       <button onClick={handleCopyLink} className={`text-white text-sm font-medium px-4 py-2 rounded-md transition-all flex items-center gap-2 ${copySuccess ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}>
                           {copySuccess ? (
                               <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Copiado!
                               </>
                           ) : (
                               <>
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9 2 2 4-4" /></svg>
                               Copiar
                               </>
                           )}
                       </button>
                   </div>

                   {/* Social Buttons */}
                   <div className="flex gap-2">
                       <button onClick={() => handleSocialShare('facebook')} className="p-2 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-gray-600 transition-colors" title="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg></button>
                       <button onClick={() => handleSocialShare('twitter')} className="p-2 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-400 text-gray-600 transition-colors" title="Twitter / X"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg></button>
                       <button onClick={() => handleSocialShare('linkedin')} className="p-2 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-gray-600 transition-colors" title="LinkedIn"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg></button>
                       <button onClick={() => handleSocialShare('whatsapp')} className="p-2 border border-gray-300 rounded hover:bg-green-50 hover:border-green-300 hover:text-green-600 text-gray-600 transition-colors" title="WhatsApp"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></button>
                   </div>
               </div>

               {/* Embed Section */}
               <div className="mb-8 pt-8 border-t border-gray-100">
                   <h2 className="text-xl font-bold text-gray-900 mb-1">Código de incorporação</h2>
                   <p className="text-sm text-gray-500 mb-6">Adicionar o formulário no seu site</p>
                   
                   <div className="mb-4">
                       <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Modo de exibição</label>
                       <div className="relative">
                           <select 
                               value={embedMode}
                               onChange={(e) => { setEmbedMode(e.target.value); setShowEmbedCode(false); }}
                               className="w-full appearance-none border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
                           >
                               <option value="regular">Normal</option>
                               <option value="fullscreen">Tela cheia</option>
                               <option value="buttonLink">Botão com link</option>
                               <option value="buttonModal">Botão para janela</option>
                           </select>
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                               <svg className="w-3 h-3" viewBox="0 0 448 512" fill="currentColor"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                           </div>
                       </div>
                   </div>

                   {embedMode === 'regular' && (
                       <div className="grid grid-cols-2 gap-4 mb-6">
                           <div>
                               <label className="block text-xs font-semibold text-gray-700 mb-2">Largura</label>
                               <div className="flex">
                                   <input type="text" value={embedWidth} onChange={(e) => setEmbedWidth(e.target.value)} className="w-full border border-gray-300 rounded-l py-2 px-3 text-sm focus:outline-none focus:border-blue-500 border-r-0" />
                                   <div className="relative w-20">
                                       <select value={embedWidthUnit} onChange={(e) => setEmbedWidthUnit(e.target.value)} className="w-full appearance-none border border-gray-300 rounded-r py-2 px-2 text-sm bg-gray-50 focus:outline-none text-center">
                                           <option>%</option>
                                           <option>px</option>
                                       </select>
                                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                           <svg className="w-2 h-2" viewBox="0 0 448 512" fill="currentColor"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-gray-700 mb-2">Altura</label>
                               <div className="flex">
                                   <input type="text" value={embedHeight} onChange={(e) => setEmbedHeight(e.target.value)} className="w-full border border-gray-300 rounded-l py-2 px-3 text-sm focus:outline-none focus:border-blue-500 border-r-0" />
                                   <div className="relative w-20">
                                       <select value={embedHeightUnit} onChange={(e) => setEmbedHeightUnit(e.target.value)} className="w-full appearance-none border border-gray-300 rounded-r py-2 px-2 text-sm bg-gray-50 focus:outline-none text-center">
                                           <option>px</option>
                                           <option>%</option>
                                       </select>
                                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                           <svg className="w-2 h-2" viewBox="0 0 448 512" fill="currentColor"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}
                   
                   {!showEmbedCode ? (
                        <button onClick={handleGenerateCode} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 text-sm shadow-sm transition-colors">
                            Gerar código
                        </button>
                   ) : (
                       <div className="space-y-3 animate-fade-in">
                           <textarea readOnly value={generatedCode} className="w-full h-32 border border-gray-300 rounded-md p-3 text-xs font-mono text-gray-600 bg-gray-50 focus:outline-none resize-none" onClick={(e) => e.currentTarget.select()}></textarea>
                           <div className="flex gap-2">
                               <button onClick={() => { navigator.clipboard.writeText(generatedCode); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center gap-2">
                                   {copySuccess ? 'Copiado!' : 'Copiar código'}
                               </button>
                               <button onClick={() => setShowEmbedCode(false)} className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2">
                                   Fechar
                               </button>
                           </div>
                       </div>
                   )}
               </div>
           </div>

           {/* Preview Column */}
           <div className="hidden md:block md:w-1/2 lg:w-7/12 bg-gray-50 p-8 flex flex-col items-center justify-center border-t border-gray-200 md:border-t-0">
                <div className="w-full max-w-lg">
                    <div className="text-gray-500 text-sm font-medium mb-4 text-center">Exemplo de como ficará no seu site</div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6 space-y-4 relative min-h-[400px]">
                        {/* Fake Site Content */}
                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        
                        {/* The Form Embed Representation */}
                        <div className="mt-8 mb-8 flex justify-center items-center" style={{ fontFamily: getFontFamily(font) }}>
                            
                            {embedMode === 'regular' && (
                                <div className="bg-opacity-90 rounded-md flex flex-col items-center justify-center text-white text-xs font-medium tracking-wide shadow-sm w-full h-64 transition-all" style={{ backgroundColor: buttonColor, borderRadius: `${borderRadius * 4}px`, width: embedWidthUnit === '%' ? `${embedWidth}%` : '100%' }}>
                                    <span className="text-lg opacity-90 mb-2">Formulário Incorporado</span>
                                    <span className="opacity-70 px-4 text-center">O formulário aparecerá aqui dentro do seu conteúdo.</span>
                                </div>
                            )}

                            {embedMode === 'fullscreen' && (
                                <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${buttonColor}20` }}>
                                             <svg className="w-8 h-8" style={{ color: buttonColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Modo Tela Cheia</h3>
                                        <p className="text-sm text-gray-500 mt-2">O formulário ocupará 100% da tela do visitante.</p>
                                    </div>
                                    <div className="w-full h-full absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundColor: buttonColor }}></div>
                                </div>
                            )}

                            {(embedMode === 'buttonLink' || embedMode === 'buttonModal') && (
                                <div className="py-12 text-center">
                                    <button style={{ backgroundColor: buttonColor, borderRadius: `${borderRadius * 4}px`, color: '#fff', fontFamily: getFontFamily(font) }} className="px-6 py-3 font-medium shadow-sm hover:opacity-90 transition-opacity">
                                        Abrir Formulário
                                    </button>
                                    <p className="text-xs text-gray-400 mt-4">
                                        {embedMode === 'buttonLink' ? 'Abre em nova aba' : 'Abre em uma janela modal (popup)'}
                                    </p>
                                </div>
                            )}

                        </div>
                        
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
           </div>
       </div>
    );
  };

  const renderAnswersTab = () => {
    // Determine completed count from real data
    const completedCount = answersList.length;
    // Simple logic: views > starts > completed
    const currentViews = viewsCount + completedCount; // Simplified for demo
    const currentStarts = startsCount + completedCount;
    const completionRate = currentStarts > 0 ? ((completedCount / currentStarts) * 100).toFixed(1) + '%' : '0%';

    const stats = {
      views: currentViews,
      starts: currentStarts,
      completed: completedCount,
      completionRate: completionRate
    };

    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">Resultados</h2>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <div className="flex bg-gray-100 p-1 rounded-md">
                 <button 
                   onClick={() => setAnswersView('summary')}
                   className={`px-3 py-1 text-sm font-medium rounded-sm transition-all ${answersView === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Resumo
                 </button>
                 <button 
                   onClick={() => setAnswersView('individual')}
                   className={`px-3 py-1 text-sm font-medium rounded-sm transition-all ${answersView === 'individual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Respostas
                 </button>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                disabled={answersList.length === 0}
                className={`flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 bg-white shadow-sm transition-colors ${answersList.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 Exportar
              </button>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
           <div className="max-w-5xl mx-auto">
              
              {/* Big Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 {[
                   { label: 'Visualizações', value: stats.views, icon: 'eye' },
                   { label: 'Iniciadas', value: stats.starts, icon: 'play' },
                   { label: 'Respostas', value: stats.completed, icon: 'check' },
                   { label: 'Taxa de conclusão', value: stats.completionRate, icon: 'chart' }
                 ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</span>
                       <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{stat.label}</span>
                    </div>
                 ))}
              </div>

              {answersList.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                           <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9 2 2 4-4" />
                           </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Você ainda não tem respostas</h3>
                      <p className="text-gray-500 mb-6 text-sm max-w-sm">Compartilhe o seu formulário para começar a coletar dados. As respostas aparecerão aqui.</p>
                      
                      <button onClick={() => setActiveTab('compartilhar')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded shadow-sm transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        Compartilhar agora
                      </button>
                  </div>
              ) : (
                  <div>
                      {/* Render list of answers here */}
                      <p>Lista de respostas...</p>
                  </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-inter">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-14 px-4 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-4 w-1/4">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <span className="font-semibold text-gray-800 truncate text-sm">{formTitle}</span>
            </div>
            
            <div className="flex-1 flex justify-center">
                <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {['editor', 'respostas', 'configuracoes', 'compartilhar'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="w-1/4 flex justify-end items-center gap-2">
                 <button className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors" title="Visualizar">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 </button>
                 <button 
                    onClick={handlePublish}
                    disabled={isPublished}
                    className={`text-xs font-bold px-4 py-2 rounded shadow-sm transition-all uppercase ${isPublished ? 'bg-gray-100 text-green-600 cursor-default' : 'bg-black text-white hover:bg-gray-800'}`}
                 >
                    {isPublishing ? 'Publicando...' : (isPublished ? 'Publicado' : 'Publicar')}
                 </button>
            </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden relative">
            {activeTab === 'editor' && (
                <div className="flex h-full">
                   {/* Sidebar: List of questions */}
                   <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shrink-0">
                       <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                           <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Perguntas</span>
                           <span className="text-xs font-semibold text-gray-400">{questions.length}</span>
                       </div>
                       <div className="flex-1 overflow-y-auto p-2 space-y-1">
                           {questions.map((q, idx) => (
                               <div 
                                   key={q.id}
                                   onClick={() => setActiveQuestionId(q.id)}
                                   className={`p-3 rounded-md text-sm cursor-pointer border transition-all flex items-center gap-3 ${activeQuestionId === q.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}
                               >
                                   <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeQuestionId === q.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                       {idx + 1}
                                   </div>
                                   <span className={`truncate flex-1 ${activeQuestionId === q.id ? 'font-medium text-blue-900' : 'text-gray-600'}`}>
                                       {q.title || 'Sem título'}
                                   </span>
                                   {q.required && <span className="text-red-400 text-[10px]">*</span>}
                               </div>
                           ))}
                       </div>
                       <div className="p-3 border-t border-gray-200 bg-gray-50">
                           <button onClick={addQuestion} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded hover:bg-gray-50 transition-colors text-sm shadow-sm">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Adicionar
                           </button>
                       </div>
                   </div>

                   {/* Main Area: Question Editor */}
                   <div className="flex-1 bg-gray-50 overflow-y-auto p-8 flex justify-center">
                       <div className="w-full max-w-2xl space-y-4">
                           {/* Editor Card */}
                           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                               {/* Question Controls Header */}
                               <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                                   <div className="flex items-center gap-2 text-gray-400">
                                       <button onClick={handlePrevQuestion} className="hover:text-gray-700"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                                       <button onClick={handleNextQuestion} className="hover:text-gray-700"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                                   </div>
                                   <div className="flex items-center gap-4">
                                       <div className="flex items-center gap-2">
                                           <label className="text-xs font-semibold text-gray-600">Obrigatória</label>
                                           <button 
                                               onClick={() => updateActiveQuestion({ required: !activeQuestion.required })}
                                               className={`w-8 h-4 rounded-full relative transition-colors ${activeQuestion.required ? 'bg-blue-600' : 'bg-gray-300'}`}
                                           >
                                               <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${activeQuestion.required ? 'left-4.5' : 'left-0.5'}`} style={{ left: activeQuestion.required ? '18px' : '2px' }}></div>
                                           </button>
                                       </div>
                                       <div className="h-4 w-px bg-gray-300"></div>
                                       <button onClick={removeActiveQuestion} className="text-gray-400 hover:text-red-500 transition-colors" title="Excluir">
                                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                       </button>
                                   </div>
                               </div>

                               <div className="p-8">
                                   {/* Question Type Selector */}
                                   <div className="mb-6">
                                       <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tipo da pergunta</label>
                                       <div className="relative">
                                           <select 
                                               value={activeQuestion.type}
                                               onChange={(e) => updateActiveQuestion({ type: e.target.value })}
                                               className="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline text-sm font-medium text-gray-700"
                                           >
                                               <optgroup label="Texto">
                                                   <option>Resposta curta</option>
                                                   <option>Texto longo</option>
                                                   <option>Nome próprio</option>
                                                   <option>E-mail</option>
                                               </optgroup>
                                               <optgroup label="Escolha">
                                                   <option>Múltipla escolha</option>
                                                   <option>Seleção de lista</option>
                                                   <option>Seleção de imagem</option>
                                               </optgroup>
                                               <optgroup label="Avaliação">
                                                   <option>Escala de satisfação</option>
                                               </optgroup>
                                                <optgroup label="Dados">
                                                   <option>Telefone</option>
                                                   <option>Data</option>
                                                   <option>CPF</option>
                                                   <option>Endereço</option>
                                                   <option>Link</option>
                                                   <option>Valor monetário</option>
                                                   <option>Arquivo anexo</option>
                                               </optgroup>
                                                <optgroup label="Mensagens">
                                                   <option>Boas-vindas</option>
                                                   <option>Mensagem</option>
                                                   <option>Agradecimento</option>
                                               </optgroup>
                                                <optgroup label="Integrações">
                                                   <option>Calendly</option>
                                               </optgroup>
                                           </select>
                                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                           </div>
                                       </div>
                                   </div>

                                   {/* Title Input */}
                                   <div className="mb-2">
                                       <input 
                                           type="text" 
                                           value={activeQuestion.title} 
                                           onChange={(e) => updateActiveQuestion({ title: e.target.value })}
                                           className="w-full text-xl font-bold text-gray-800 placeholder-gray-300 border-none p-0 focus:ring-0"
                                           placeholder="Digite sua pergunta aqui..."
                                       />
                                   </div>

                                   {/* Description Input */}
                                   <div className="mb-6">
                                       <input 
                                           type="text" 
                                           value={activeQuestion.description || ''} 
                                           onChange={(e) => updateActiveQuestion({ description: e.target.value })}
                                           className="w-full text-sm text-gray-500 placeholder-gray-300 border-none p-0 focus:ring-0"
                                           placeholder="Adicione uma descrição (opcional)"
                                       />
                                   </div>

                                   {/* Render the specific input preview */}
                                   <div className="pt-2 pb-4">
                                       {renderInputArea()}
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
            )}
            {activeTab === 'respostas' && renderAnswersTab()}
            {activeTab === 'configuracoes' && renderOptionsTab()}
            {activeTab === 'compartilhar' && renderShareTab()}
        </main>

        {/* Share Popover - Show after publishing */}
        {showSharePopover && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Formulário Publicado!</h3>
                    <p className="text-gray-600 mb-6">Seu formulário está no ar e pronto para receber respostas.</p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => { setShowSharePopover(false); setActiveTab('compartilhar'); }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Ver opções de compartilhamento
                        </button>
                        <button 
                            onClick={() => setShowSharePopover(false)}
                            className="w-full bg-transparent text-gray-500 font-medium py-2 px-4 hover:text-gray-700 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default EditorPage;