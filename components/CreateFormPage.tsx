import React, { useState, useRef } from 'react';
import { RespondidoLogo } from './Icons';

interface CreateFormPageProps {
    onBack: () => void;
    onCreate: (title: string) => void;
}

const CreateFormPage: React.FC<CreateFormPageProps> = ({ onBack, onCreate }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const maxLength = 60;

    const handleCreate = () => {
        if (title.trim().length > 0) {
            onCreate(title);
        } else {
            setError(true);
            inputRef.current?.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (error && e.target.value.trim().length > 0) {
            setError(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-inter">
            {/* Header */}
            <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="flex items-center">
                    <div className="cursor-pointer" onClick={onBack}>
                        <RespondidoLogo className="w-[120px] h-[30px]" />
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
                <div className="w-full max-w-[600px] animate-fade-in">
                    <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 mb-2 font-inter leading-tight">
                        Qual o título do formulário?
                    </h1>
                    <p className="text-[15px] text-gray-600 mb-10">
                        Você pode alterar mais tarde.
                    </p>

                    <div className={`mb-8 relative group ${error ? 'error' : ''}`}>
                        <input 
                            ref={inputRef}
                            type="text" 
                            id="new-form-input"
                            value={title}
                            onChange={handleInputChange}
                            maxLength={maxLength}
                            placeholder=" "
                            className={`block w-full text-lg text-gray-900 bg-transparent border-0 border-b appearance-none focus:outline-none focus:ring-0 py-2.5 px-0 ${
                                error 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-600'
                            }`}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                         <label 
                            htmlFor="new-form-input"
                            className={`absolute duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0 font-normal ${
                                error ? 'text-red-500' : 'text-gray-500'
                            }`}
                        >
                            Digite um título
                        </label>
                        
                        {error && (
                            <div className="text-red-500 text-sm mt-1">
                                Escolha um nome para seu formulário.
                            </div>
                        )}

                        <div className={`text-right text-xs mt-2 ${error ? 'text-red-500' : 'text-gray-400'}`}>
                            {title.length}/{maxLength}
                        </div>
                    </div>

                    <div className="flex">
                        <button 
                            onClick={handleCreate}
                            className={`text-white font-medium py-3 px-8 rounded shadow-sm hover:shadow transition duration-150 text-[15px] flex items-center bg-[#111827] hover:bg-black`}
                        >
                            Criar
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateFormPage;