/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import { LogIn, UserPlus, FileLock, HelpCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import pokesLogo from "../assets/images/pokes_logo_1780062027808.png";

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Remember me states and automatic loading
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem("pokes_remember_me") === "true";
  });
  
  // Custom states to force re-render or manage saved user
  const [savedEmail, setSavedEmail] = useState<string | null>(() => localStorage.getItem("pokes_saved_email"));
  const savedName = localStorage.getItem("pokes_saved_name") || "Treinador";
  const savedPassword = localStorage.getItem("pokes_saved_password");
  
  // Custom states for validation feedback
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Initialize simulated local storage database for users if not present
  const getUsersFromStorage = (): User[] => {
    const raw = localStorage.getItem("pokes_registered_users");
    if (!raw) {
      // Default initial test user: eu@eu.com / 1234
      const defaultUser: User & { password?: string } = {
        email: "eu@eu.com",
        name: "Treinador Master",
        password: "1234",
      };
      localStorage.setItem("pokes_registered_users", JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(raw);
  };

  const persistUserToStorage = (newUser: User & { password?: string }) => {
    const users = getUsersFromStorage();
    users.push(newUser);
    localStorage.setItem("pokes_registered_users", JSON.stringify(users));
  };

  // Direct login with saved email credentials
  const handleSavedLogin = () => {
    const storedEmail = localStorage.getItem("pokes_saved_email");
    const storedName = localStorage.getItem("pokes_saved_name") || "Treinador";
    if (storedEmail) {
      setSuccessFeedback(`Acesso rápido! Bem-vindo de volta, ${storedName}!`);
      setTimeout(() => {
        onLoginSuccess({ email: storedEmail, name: storedName });
      }, 600);
    }
  };

  // Explicitly saves the current email and signs in automatically
  const handleSaveEmailAndAutoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);
    setSuccessFeedback(null);

    const targetEmail = email.trim();
    if (!targetEmail) {
      setErrorFeedback("Por favor, digite seu e-mail para que possamos salvá-lo.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setErrorFeedback("Por favor, digite um e-mail válido.");
      return;
    }

    const users = getUsersFromStorage();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (foundUser) {
      // User found, save credentials
      localStorage.setItem("pokes_remember_me", "true");
      localStorage.setItem("pokes_saved_email", foundUser.email);
      localStorage.setItem("pokes_saved_name", foundUser.name);
      localStorage.setItem("pokes_saved_password", foundUser.password || "1234");
      
      setRememberMe(true);
      setSavedEmail(foundUser.email);

      setSuccessFeedback(`E-mail salvo com sucesso! Entrando automaticamente como ${foundUser.name}...`);
      setTimeout(() => {
        onLoginSuccess({ email: foundUser.email, name: foundUser.name });
      }, 750);
    } else {
      // User not found, perform seamless dynamic auto-registration for optimal UX
      const defaultName = "Treinador " + targetEmail.split("@")[0];
      const newUser = { email: targetEmail.toLowerCase(), name: defaultName, password: "1234" };
      persistUserToStorage(newUser);

      localStorage.setItem("pokes_remember_me", "true");
      localStorage.setItem("pokes_saved_email", newUser.email);
      localStorage.setItem("pokes_saved_name", newUser.name);
      localStorage.setItem("pokes_saved_password", "1234");
      
      setRememberMe(true);
      setSavedEmail(newUser.email);

      setSuccessFeedback(`E-mail salvo e novo Treinador cadastrado! Entrando automaticamente...`);
      setTimeout(() => {
        onLoginSuccess({ email: newUser.email, name: newUser.name });
      }, 750);
    }
  };

  // Handle Login Action
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);
    setSuccessFeedback(null);

    if (!email || !password) {
      setErrorFeedback("Por favor, preencha todos os campos.");
      return;
    }

    const users = getUsersFromStorage();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      if (rememberMe) {
        localStorage.setItem("pokes_remember_me", "true");
        localStorage.setItem("pokes_saved_email", foundUser.email);
        localStorage.setItem("pokes_saved_name", foundUser.name);
        localStorage.setItem("pokes_saved_password", foundUser.password || "1234");
      } else {
        localStorage.removeItem("pokes_remember_me");
        localStorage.removeItem("pokes_saved_email");
        localStorage.removeItem("pokes_saved_name");
        localStorage.removeItem("pokes_saved_password");
      }

      setSuccessFeedback(`Bem-vindo de volta, ${foundUser.name}!`);
      setTimeout(() => {
        onLoginSuccess({ email: foundUser.email, name: foundUser.name });
      }, 800);
    } else {
      setErrorFeedback("E-mail ou senha incorretos. Tente 'eu@eu.com' com '1234'!");
    }
  };

  // Handle Registration Action
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);
    setSuccessFeedback(null);

    if (!email || !password || !name) {
      setErrorFeedback("Deseja capturar um usuário? Preencha todos os campos, incluindo o nome.");
      return;
    }

    // Quick regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorFeedback("Por favor, forneça um endereço de e-mail válido.");
      return;
    }

    if (password.length < 4) {
      setErrorFeedback("A senha precisa conter pelo menos 4 caracteres.");
      return;
    }

    const users = getUsersFromStorage();
    const alreadyExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (alreadyExists) {
      setErrorFeedback("Esse e-mail já está cadastrado em nossa Pokédex de usuários.");
      return;
    }

    // Save and switch back to Login Mode
    const newUser = { email: email.toLowerCase(), name, password };
    persistUserToStorage(newUser);
    
    setSuccessFeedback("Usuário cadastrado com sucesso! Já pode realizar o login.");
    setIsRegisterMode(false);
    // Clear registration specific fields
    setPassword("");
  };

  // Auto fill test credentials helper
  const handleAutoFillTestAccount = () => {
    setEmail("eu@eu.com");
    setPassword("1234");
    setErrorFeedback(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4" id="login-container">
      {/* Visual Header / Brand Logotype */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative w-32 h-32 mb-4 p-2 bg-gradient-to-tr from-poke-red to-zinc-950 rounded-full shadow-lg border-2 border-poke-red flex items-center justify-center overflow-hidden transition-transform duration-500 hover:rotate-12 group">
          <img
            src={pokesLogo}
            referrerPolicy="no-referrer"
            alt="Logotipo PokéTarefas"
            className="w-full h-full object-cover rounded-full select-none"
            id="app-login-logo"
          />
          <div className="absolute inset-0 bg-poke-red opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
        </div>
        
        <h1 translate="no" className="notranslate font-display text-4xl lg:text-5xl font-black tracking-wider text-poke-red flex items-center gap-1">
          POKÉTAREFAS
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-sans mt-2 tracking-wide">
          Sua Pokédex de Listas de Tarefas Operacional
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-poke-black-card border-3 border-zinc-900 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl transition-colors duration-300 relative overflow-hidden">
        {/* Upper colored Pokeball-inspired header ribbon indicator */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-poke-red via-rose-500 to-zinc-900" />
        
        <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-6">
          {isRegisterMode ? (
            <>
              <UserPlus className="w-6 h-6 text-poke-red" />
              <span>Novo Treinador</span>
            </>
          ) : (
            <>
              <LogIn className="w-6 h-6 text-poke-red" />
              <span>Acessar Painel</span>
            </>
          )}
        </h2>

        {savedEmail && !isRegisterMode && (
          <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border-2 border-emerald-500/40 flex flex-col items-center gap-2 shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider font-mono">
              ★ Usuário Salvo Detectado ★
            </span>
            <div className="text-xs leading-normal">
              <span className="font-bold text-zinc-800 dark:text-zinc-100 block">{savedName}</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[10px]">{savedEmail}</span>
            </div>
            
            <button
              type="button"
              onClick={handleSavedLogin}
              className="w-full mt-1.5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              id="saved-auto-login-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar Automaticamente</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("pokes_saved_email");
                localStorage.removeItem("pokes_saved_name");
                localStorage.removeItem("pokes_saved_password");
                setSavedEmail(null);
              }}
              className="text-[10.5px] text-zinc-400 dark:text-zinc-500 hover:text-poke-red hover:underline transition-colors cursor-pointer mt-1"
            >
              Limpar dados salvos
            </button>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit} className="space-y-5">
          {errorFeedback && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed">
              {errorFeedback}
            </div>
          )}

          {successFeedback && (
            <div className="p-3 bg-emerald-50 dark:bg-[#065F46]/20 border border-emerald-200 dark:border-[#065F46]/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium leading-relaxed animate-pulse">
              {successFeedback}
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label htmlFor="reg-name" className="block text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Nome do Treinador
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Ex: Gabriel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-poke-black rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-poke-red text-zinc-800 dark:text-zinc-100 transition-colors placeholder-zinc-400 text-sm font-sans"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="block text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="treinador@pokes.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-poke-black rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-poke-red text-zinc-800 dark:text-zinc-100 transition-colors placeholder-zinc-400 text-sm font-sans"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="login-password" className="block text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                Senha
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-zinc-50 dark:bg-poke-black rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-poke-red text-zinc-800 dark:text-zinc-100 transition-colors placeholder-zinc-400 text-sm font-sans"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none p-1"
                title={showPassword ? "Ocultar Senha" : "Mostrar Senha"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isRegisterMode && (
            <div className="flex items-center gap-2 py-1 select-none">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => {
                  setRememberMe(e.target.checked);
                  localStorage.setItem("pokes_remember_me", e.target.checked ? "true" : "false");
                }}
                className="w-4.5 h-4.5 rounded text-poke-red focus:ring-0 cursor-pointer accent-poke-red"
              />
              <label htmlFor="remember-me" className="text-xs text-zinc-650 dark:text-zinc-400 font-bold cursor-pointer">
                Lembrar e-mail e entrar automático
              </label>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-poke-red hover:bg-poke-red-hover active:scale-95 text-white font-display font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            id="auth-submit-btn"
          >
            {isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Capturar Nova Conta</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Iniciar Jornada</span>
              </>
            )}
          </button>

          {!isRegisterMode && (
            <button
              type="button"
              onClick={handleSaveEmailAndAutoLogin}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-3 border border-emerald-500/20 animate-fade-in"
              id="save-and-autologin-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse animate-duration-1000" />
              <span>Salvar E-mail e Entrar Automático</span>
            </button>
          )}
        </form>

        {/* Predefined values loader helper */}
        {!isRegisterMode && (
          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-center">
            <button
              onClick={handleAutoFillTestAccount}
              className="inline-flex items-center gap-2 text-xs font-medium text-poke-red hover:text-poke-red-hover hover:underline transition-colors focus:outline-none cursor-pointer"
              title="Preenche automaticamente com as credenciais de teste fornecidas"
            >
              <FileLock className="w-3.5 h-3.5" />
              <span>Usar Conta de Teste (eu@eu.com)</span>
            </button>
          </div>
        )}

        {/* Change mode footer */}
        <div className="mt-6 text-center text-xs font-sans text-zinc-500 dark:text-zinc-400">
          {isRegisterMode ? (
            <p>
              Já possui registro?{" "}
              <button
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorFeedback(null);
                }}
                className="font-bold text-poke-red hover:underline focus:outline-none ml-1 cursor-pointer"
              >
                Acesse aqui
              </button>
            </p>
          ) : (
            <p>
              Novo no aplicativo?{" "}
              <button
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorFeedback(null);
                }}
                className="font-bold text-poke-red hover:underline focus:outline-none ml-1 cursor-pointer"
              >
                Cadastre-se aqui
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Guide details block */}
      <div className="mt-6 text-center bg-zinc-50 dark:bg-poke-black-card/40 border border-zinc-100 dark:border-zinc-900 p-4 rounded-2xl flex items-start gap-3 justify-center max-w-sm mx-auto text-zinc-400 dark:text-zinc-500">
        <HelpCircle className="w-5 h-5 text-poke-red shrink-0 mt-0.5" />
        <p className="text-left leading-normal text-xs font-semibold">
          Conta de teste:<br />
          E-mail: <span className="text-zinc-700 dark:text-zinc-300 font-mono">eu@eu.com</span><br />
          Senha: <span className="text-zinc-700 dark:text-zinc-300 font-mono">1234</span>
        </p>
      </div>
    </div>
  );
};
