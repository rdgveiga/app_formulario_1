import React, { useState, useEffect } from 'react';

const NutritionistPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowWhatsapp(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="font-sans text-black bg-white">
      <style>{`
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .bg-texture-hero {
          background-image: url('https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/desktop/3379271_1_176107934068f7f02c77963627518920.png');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .bg-texture-top {
          background-image: url('https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/desktop/3379271_1_176107934068f7f02c7795e857303610.png');
        }
        .faq-content {
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }
        .faq-content.open {
          max-height: 500px;
          opacity: 1;
        }
        .faq-icon {
          transition: transform 0.3s ease;
        }
        .faq-icon.rotate {
          transform: rotate(180deg);
        }
      `}</style>

      <main>
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden font-montserrat">
          {/* Top Bar */}
          <div className="bg-[#57a4a0] w-full py-3 bg-texture-top bg-center px-4 flex justify-center">
            <div className="max-w-5xl w-full text-center">
              <h2 className="text-white font-bold text-xs md:text-xl tracking-wider leading-tight">
                SUA NUTRICIONISTA NA <span className="text-[#b4155a] font-extrabold">TIJUCA</span> E REGIÃO
              </h2>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="relative bg-[#f2f2f2] min-h-[auto] md:min-h-[600px] flex items-center bg-texture-hero pb-12 md:pb-0">
            <div className="max-w-5xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-8 md:gap-16 items-center py-8 md:py-12">
              
              {/* Text Content */}
              <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start order-2 md:order-1">
                <h1 className="text-2xl md:text-[30px] font-bold text-[#57a4a0] leading-tight tracking-wide">
                  ALCANCE O SEU EMAGRECIMENTO DE FORMA LEVE E SEM SACRIFÍCIOS
                </h1>
                
                <div className="space-y-4 text-black font-medium text-base md:text-[16px]">
                  <p>
                    Chega de sofrer com dietas que você acredita que vão te ajudar a emagrecer mas só te levam a um caminho: <b className="text-black">frustração</b>.
                  </p>
                  <p>
                    Através do método que eu desenvolvi tenho ajudado diversas mulheres a emagrecerem de forma definitiva e sem sofrer!
                  </p>
                  <p className="font-bold text-black">
                    Vou te ajudar a conquistar o corpo que tanto sonha!
                  </p>
                </div>

                <div className="mt-4 w-full md:w-auto">
                   <a href="https://api.whatsapp.com/send?phone=5521997514370&text=Ol%C3%A1%20Nutri%2C%20vi%20o%20seu%20v%C3%ADdeo%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20trabalho!" target="_blank" className="inline-flex items-center justify-center bg-[#50bf41] hover:bg-[#45a639] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-sm transform transition-all text-[14px] md:text-[16px] text-center uppercase tracking-normal w-full md:w-auto">
                      ENTRAR EM CONTATO COM A NUTRI
                   </a>
                </div>
                
                <p className="text-xs md:text-[12px] text-gray-500 font-medium">
                  Nutricionista especialista em nutrição clínica e esportiva
                </p>
              </div>

              {/* Image Content */}
              <div className="order-1 md:order-2 relative flex justify-center items-end mt-4 md:mt-0">
                 <img 
                   src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/desktop/3379271_1_176107934068f7f02c7a929008275933.png" 
                   alt="Nutricionista Maria Ribeiro" 
                   className="w-auto h-auto max-h-[300px] md:max-h-[500px] object-contain drop-shadow-xl"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* METHODOLOGY SECTION */}
        <section className="py-12 md:py-20 bg-[#57a4a0] relative overflow-hidden bg-texture-top font-montserrat">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-10 md:mb-16 text-white">
              <h2 className="text-[26px] md:text-[35px] font-bold leading-tight drop-shadow-md">
                Conheça as fases do meu <br className="hidden md:block" /> acompanhamento
              </h2>
              <div className="w-32 md:w-48 h-0.5 bg-white mx-auto mt-4 opacity-70"></div>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Central Line - Desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white -translate-x-1/2"></div>

              {/* Timeline Items */}
              <div className="flex flex-col space-y-8 md:space-y-0">
                
                {/* FASE 1 */}
                <div className="relative w-full md:min-h-[250px] flex items-center group">
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center z-20">
                     <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center bg-[#57a4a0]">
                        <div className="w-full h-0.5 bg-white/60 absolute"></div>
                        <div className="h-full w-0.5 bg-white/60 absolute"></div>
                     </div>
                  </div>
                  <div className="w-full md:w-1/2 flex md:justify-end md:pr-16">
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl relative w-full md:max-w-md mx-auto md:mx-0">
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent right-[-15px] border-l-[15px] border-l-[#b4155a]"></div>
                      <div className="md:hidden absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-[#b4155a]"></div>
                      <h3 className="text-lg md:text-2xl font-bold mb-3 text-[#b4155a] text-center md:text-left">
                        Avaliação e planejamento:
                      </h3>
                      <p className="text-black text-[14px] md:text-[16px] leading-relaxed text-left font-medium">
                        Para iniciar sua transformação, será definido o protocolo conforme seu objetivo e individualidade. Antes mesmo da consulta será enviado um formulário para avaliar seu histórico clínico e alimentar. Nesta fase, faremos um estudo sobre seus hábitos, análise da composição corporal e identificaremos os fatores que estão impedindo de conquistar os resultados que deseja.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FASE 2 */}
                <div className="relative w-full md:min-h-[250px] flex items-center group">
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center z-20">
                     <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center bg-[#57a4a0]">
                        <div className="w-full h-0.5 bg-white/60 absolute"></div>
                        <div className="h-full w-0.5 bg-white/60 absolute"></div>
                     </div>
                  </div>
                  <div className="w-full md:w-1/2 flex md:ml-auto md:justify-start md:pl-16">
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl relative w-full md:max-w-md mx-auto md:mx-0">
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent left-[-15px] border-r-[15px] border-r-[#b4155a]"></div>
                      <div className="md:hidden absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-[#b4155a]"></div>
                      <h3 className="text-lg md:text-2xl font-bold mb-3 text-[#b4155a] text-center md:text-left">
                        Ajuste metabólico:
                      </h3>
                      <p className="text-black text-[14px] md:text-[16px] leading-relaxed text-left font-medium">
                        Um plano alimentar totalmente personalizado para destravar os seus resultados. A dieta será calculada durante a consulta e entregue na mesma hora, podendo iniciar imediatamente seu protocolo. Nessa fase, a meta é começar a habituar o corpo a um padrão alimentar mais saudável e sem restrições, reduzindo inflamações e iniciando o processo de queima de gordura.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FASE 3 */}
                <div className="relative w-full md:min-h-[250px] flex items-center group">
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center z-20">
                     <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center bg-[#57a4a0]">
                        <div className="w-full h-0.5 bg-white/60 absolute"></div>
                        <div className="h-full w-0.5 bg-white/60 absolute"></div>
                     </div>
                  </div>
                  <div className="w-full md:w-1/2 flex md:justify-end md:pr-16">
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl relative w-full md:max-w-md mx-auto md:mx-0">
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent right-[-15px] border-l-[15px] border-l-[#b4155a]"></div>
                      <div className="md:hidden absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-[#b4155a]"></div>
                      <h3 className="text-lg md:text-2xl font-bold mb-3 text-[#b4155a] text-center md:text-left">
                        Evolução:
                      </h3>
                      <p className="text-black text-[14px] md:text-[16px] leading-relaxed text-left font-medium">
                        A partir do plano personalizado, começamos a aprimorar ainda mais suas escolhas alimentares para evoluir seus resultados. Iremos ajustar o plano alimentar com nutrientes que irão potencializar o emagrecimento e o ganho de massa muscular. Nesta fase, o foco é maximizar a definição muscular enquanto continua a queima de gordura.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FASE 4 */}
                <div className="relative w-full md:min-h-[250px] flex items-center group">
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center z-20">
                     <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center bg-[#57a4a0]">
                        <div className="w-full h-0.5 bg-white/60 absolute"></div>
                        <div className="h-full w-0.5 bg-white/60 absolute"></div>
                     </div>
                  </div>
                  <div className="w-full md:w-1/2 flex md:ml-auto md:justify-start md:pl-16">
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl relative w-full md:max-w-md mx-auto md:mx-0">
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent left-[-15px] border-r-[15px] border-r-[#b4155a]"></div>
                      <div className="md:hidden absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-[#b4155a]"></div>
                      <h3 className="text-lg md:text-2xl font-bold mb-3 text-[#b4155a] text-center md:text-left">
                        Manutenção dos resultados:
                      </h3>
                      <p className="text-black text-[14px] md:text-[16px] leading-relaxed text-left font-medium">
                        A fase final é dedicada à manutenção dos resultados obtidos, evitando o “efeito sanfona” que impede de manter os resultados a longo prazo. A dieta é ajustada para um plano de manutenção e os alimentos continuam sendo variados e dentro das suas preferências e individualidades, evitando a monotonia alimentar e te ensinando a ter mais autonomia para fazer boas escolhas.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="mt-12 md:mt-16 flex justify-center w-full">
                 <a 
                  href="https://api.whatsapp.com/send?phone=5521997514370&text=Ol%C3%A1%20Nutri%2C%20vi%20o%20seu%20v%C3%ADdeo%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20trabalho!" 
                  className="bg-[#50bf41] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors uppercase text-sm md:text-base tracking-wide w-full md:w-auto text-center block md:inline-block"
                 >
                    ENTRAR EM CONTATO COM A NUTRI
                 </a>
            </div>

          </div>
        </section>

        {/* TARGET AUDIENCE SECTION */}
        <section className="py-12 md:py-20 bg-[#f2f2f2] bg-texture-hero font-montserrat">
          <div className="container mx-auto px-6">
            
            {/* Main Header */}
            <div className="text-center mb-8 md:mb-12 space-y-1">
              <p className="text-lg md:text-2xl font-bold text-black">
                Tem dúvidas se o
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-[#57a4a0] uppercase tracking-wide drop-shadow-sm">
                ACOMPANHAMENTO
              </h2>
              <p className="text-lg md:text-2xl font-bold text-black">
                 é para você?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* For You Column */}
              <div className="flex flex-col">
                <div className="bg-[#57a4a0] text-white py-4 px-4 md:px-6 text-center font-bold text-base md:text-lg rounded-t-xl shadow-sm">
                  Então, vou te contar para QUEM é:
                </div>
                <div className="bg-white border-2 border-[#089800] rounded-b-xl shadow-xl p-6 md:p-8 flex-1">
                  <ul className="space-y-4 md:space-y-6">
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#089800] flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que deseja eliminar de uma vez por todas da sua vida esse ciclo de emagrece e engorda</p>
                    </li>
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#089800] flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que deseja um acompanhamento mais próximo e que vai te ajudar ao longo do processo</p>
                    </li>
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#089800] flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que deseja recuperar sua autoestima e reduzir as medidas das roupas no seu guarda-roupa</p>
                    </li>
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#089800] flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que luta com a ansiedade mas que não precisa sofrer com sua alimentação para vencer isso</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Not For You Column */}
              <div className="flex flex-col">
                 <div className="bg-[#57a4a0] text-white py-4 px-4 md:px-6 text-center font-bold text-base md:text-lg rounded-t-xl shadow-sm">
                  E para QUEM não é:
                </div>
                <div className="bg-white border-2 border-[#d60000] rounded-b-xl shadow-xl p-6 md:p-8 flex-1">
                  <ul className="space-y-4 md:space-y-6">
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#d60000] flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que quer resultados rápidos e milagrosos mas sem comprometimento</p>
                    </li>
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#d60000] flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que prefere seguir dietas milagrosas e super restritivas mas que não dão resultados de maneira definitiva</p>
                    </li>
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#d60000] flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que não está disposta a fazer uma reeducação alimentar e mudar sua vida e saúde</p>
                    </li>
                    <li className="flex items-start gap-3 md:gap-4">
                      <div className="shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-[#d60000] flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                      </div>
                      <p className="text-[#253328] text-[15px] md:text-[16px] leading-tight font-medium text-left">Você que acredita que um remédio vai ajudar a emagrecer e resolver todos os seus problemas</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 space-y-6">
                <p className="text-[#253328] text-base md:text-xl px-2">
                    Se você é essa pessoa, saiba que o <br className="hidden md:block" />
                    <span className="font-bold text-[#57a4a0]">Acompanhamento</span> é para você!
                </p>
                <div className="flex justify-center w-full">
                    <a href="https://api.whatsapp.com/send?phone=5521997514370&text=Ol%C3%A1%20Nutri%2C%20vi%20o%20seu%20v%C3%ADdeo%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20trabalho!" target="_blank" className="inline-flex items-center justify-center bg-[#50bf41] hover:bg-[#45a639] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-sm transform transition-all text-[14px] md:text-[16px] text-center uppercase tracking-normal w-full md:w-auto px-6 py-4 text-base md:text-lg w-full md:w-auto">
                      ENTRAR EM CONTATO COM A NUTRI
                    </a>
                </div>
            </div>

          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-12 md:py-16 bg-[#57a4a0] bg-texture-top font-montserrat">
          <div className="container mx-auto px-6">
            <h2 className="text-[24px] md:text-[35px] font-normal text-center text-[#f3f3ff] mb-8 md:mb-12 shadow-black drop-shadow-sm leading-tight">
              Confira alguns <span className="font-bold">resultados</span>:
            </h2>
            
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 max-w-5xl mx-auto">
                <div className="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <img src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/mobile/3379271_1_176107934068f7f02c78d946849876383837348.jpg" alt="Resultado 1" className="w-full h-auto block" loading="lazy" />
                </div>
                <div className="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <img src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/mobile/3379271_1_176107934068f7f02c78d946849876388565989.jpg" alt="Resultado 2" className="w-full h-auto block" loading="lazy" />
                </div>
                <div className="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <img src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/mobile/3379271_1_176107934068f7f02c78d946849876387592599.jpg" alt="Resultado 3" className="w-full h-auto block" loading="lazy" />
                </div>
                <div className="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <img src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/mobile/3379271_1_176107934068f7f02c78e506992582073486725.jpg" alt="Resultado 4" className="w-full h-auto block" loading="lazy" />
                </div>
                <div className="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <img src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/mobile/3379271_1_176107934068f7f02c78e506992582071767447.jpg" alt="Resultado 5" className="w-full h-auto block" loading="lazy" />
                </div>
                <div className="break-inside-avoid bg-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <img src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/mobile/3379271_1_176107934068f7f02c78e506992582078752928.jpg" alt="Resultado 6" className="w-full h-auto block" loading="lazy" />
                </div>
            </div>
    
            <div className="mt-12 flex justify-center w-full">
                 <a 
                  href="https://api.whatsapp.com/send?phone=5521997514370&text=Ol%C3%A1%20Nutri%2C%20vi%20o%20seu%20v%C3%ADdeo%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20trabalho!" 
                  className="bg-[#50bf41] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors uppercase text-sm md:text-base text-center w-full md:w-auto block md:inline-block"
                 >
                    ENTRAR EM CONTATO COM A NUTRI
                 </a>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-12 md:py-20 bg-[#f2f2f2] bg-texture-hero font-montserrat">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-8 items-center max-w-6xl mx-auto">
              
              <div className="w-full md:w-1/2 space-y-6 order-2 md:order-1 text-center md:text-left">
                <h2 className="text-2xl md:text-[33px] font-normal leading-tight">
                  <span className="font-bold text-black">PRAZER, ME CHAMO</span> <br/>
                  <span className="font-bold text-[#57a4a0]">MARIA RIBEIRO</span>
                </h2>
    
                <div className="space-y-4 text-black text-[15px] md:text-[16px] leading-relaxed text-justify">
                  <p>
                    Sou nutricionista formada há 12 anos pela Universidade Federal Fluminense (UFF) e pós-graduada em nutrição clínica, esportiva e fitoterapia funcional, além de diversos cursos em modulação e saúde intestinal e mestre em nutrição e estresse pela Universidade do estado do Rio de Janeiro (UERJ).
                  </p>
                  <p>
                    Atuo em consultório há 11 anos, e há 4 anos também de forma online. Sempre fui apaixonada por atividade física e ajudar pessoas a mudarem de vida.
                  </p>
                  <p>
                    Alguns anos atrás descobri uma doença e câncer intestinal, com isso perdi muitos quilos e precisei me recuperar e transformar meu corpo novamente através da alimentação.
                  </p>
                  <p>
                    Sou muito feliz e realizada com o que faço! Vivo o que acredito também na nutrição e alimentação!
                  </p>
                  <p className="font-bold text-black text-center md:text-left">
                    E quero ser a sua última nutricionista!
                  </p>
                </div>
    
                <div className="pt-4 flex justify-center md:justify-start w-full">
                  <a href="https://api.whatsapp.com/send?phone=5521997514370&text=Ol%C3%A1%20Nutri%2C%20vi%20o%20seu%20v%C3%ADdeo%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20trabalho!" target="_blank" className="inline-flex items-center justify-center bg-[#50bf41] hover:bg-[#45a639] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-sm transform transition-all text-[14px] md:text-[16px] text-center uppercase tracking-normal w-full md:w-auto">
                      ENTRAR EM CONTATO COM A NUTRI
                  </a>
                </div>
              </div>
    
              <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
                 <img 
                   src="https://pages.greatpages.com.br/www.nutrimariaribeiro.com.br/1761149268/imagens/desktop/3379271_1_176107934068f7f02c78d26163982269.png" 
                   alt="Maria Ribeiro" 
                   className="relative rounded-xl shadow-[0_0_8px_rgba(87,164,160,1)] w-full max-w-[280px] md:max-w-md object-cover h-auto"
                 />
              </div>
    
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-12 md:py-20 bg-[#57a4a0] relative bg-texture-top font-montserrat">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            
            <div className="text-white flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-[35px] md:text-[50px] font-normal leading-[1.3] text-[#f2f2f2]">
                <b className="font-bold">Ainda ficou com<br/>alguma dúvida?</b>
              </h2>
              <div className="h-0.5 w-40 md:w-60 bg-[#b4155a] my-4 md:my-6"></div>
              <p className="text-[20px] md:text-[22px] text-[#f2f2f2] mb-2 leading-none">
                Perguntas<br/>frequentes
              </p>
              <p className="text-[14px] text-white mt-4">
                 Talvez a resposta esteja aqui ao lado
              </p>
            </div>
    
            <div className="space-y-4 w-full">
              
              {/* FAQ ITEM 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300">
                <button className="w-full flex justify-between items-center p-4 md:p-5 text-left focus:outline-none hover:bg-gray-50" onClick={() => toggleFAQ(1)}>
                  <span className={`font-medium text-[15px] md:text-[16px] pr-4 ${openFaq === 1 ? 'text-[#57a4a0]' : 'text-gray-700'}`}>Onde fica localizado o seu consultório?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`faq-icon shrink-0 ${openFaq === 1 ? 'rotate text-[#57a4a0]' : 'text-gray-400'}`}><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className={`faq-content ${openFaq === 1 ? 'open' : ''}`}>
                  <div className="p-4 md:p-5 pt-0 text-black text-sm md:text-base border-t border-transparent mt-0">
                    Tijuca - Rua Engenheiro Enaldo Cravo Peixoto, 105, sala 508
                  </div>
                </div>
              </div>

              {/* FAQ ITEM 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300">
                <button className="w-full flex justify-between items-center p-4 md:p-5 text-left focus:outline-none hover:bg-gray-50" onClick={() => toggleFAQ(2)}>
                  <span className={`font-medium text-[15px] md:text-[16px] pr-4 ${openFaq === 2 ? 'text-[#57a4a0]' : 'text-gray-700'}`}>Você atende plano de saúde?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`faq-icon shrink-0 ${openFaq === 2 ? 'rotate text-[#57a4a0]' : 'text-gray-400'}`}><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className={`faq-content ${openFaq === 2 ? 'open' : ''}`}>
                  <div className="p-4 md:p-5 pt-0 text-black text-sm md:text-base border-t border-transparent mt-0">
                    Visando oferecer a melhor experiência e os melhores resultados aos meus pacientes, os atendimentos são particulares e 100% individualizados. Mas eu emito recibo em todas as consultas para você solicitar um possível reembolso junto ao seu plano.
                  </div>
                </div>
              </div>

              {/* FAQ ITEM 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300">
                <button className="w-full flex justify-between items-center p-4 md:p-5 text-left focus:outline-none hover:bg-gray-50" onClick={() => toggleFAQ(3)}>
                  <span className={`font-medium text-[15px] md:text-[16px] pr-4 ${openFaq === 3 ? 'text-[#57a4a0]' : 'text-gray-700'}`}>Quais são as formas de pagamento?</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`faq-icon shrink-0 ${openFaq === 3 ? 'rotate text-[#57a4a0]' : 'text-gray-400'}`}><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className={`faq-content ${openFaq === 3 ? 'open' : ''}`}>
                  <div className="p-4 md:p-5 pt-0 text-black text-sm md:text-base border-t border-transparent mt-0">
                    PIX, Cartão de crédito, Débito ou Link de pagamento.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4 bg-texture-hero bg-bottom font-montserrat">
        <div className="container mx-auto px-6 text-center">
          <p className="text-black text-[12px] leading-relaxed">
            Maria Ribeiro, Todos os direitos reservados
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send?phone=5521997514370&text=Ol%C3%A1%20Nutri%2C%20gostaria%20de%20agendar%20uma%20consulta!"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-110 hover:bg-green-600 flex items-center justify-center ${showWhatsapp ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        aria-label="Falar no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      </a>
    </div>
  );
};

export default NutritionistPage;