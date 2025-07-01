import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client";
import { useUser } from '../UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  // Plug login handler
  async function handlePlugLogin() {
    if (window.ic && window.ic.plug) {
      try {
        const connected = await window.ic.plug.requestConnect();
        if (connected) {
          const principal = await window.ic.plug.getPrincipal();
          login(); // set loggedIn true
          navigate('/home');
        } else {
          alert("Plug login failed or was cancelled.");
        }
      } catch (e) {
        alert("Plug login error: " + e.message);
      }
    } else {
      alert("Plug wallet is not installed. Please install it from https://plugwallet.ooo/");
    }
  }

  // Internet Identity login handler
  async function handleInternetIdentityLogin() {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        login(); // set loggedIn true
        navigate('/home');
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Header */}
      <header className="w-full py-4 px-8 bg-white rounded-b-2xl shadow-sm flex items-center">
        <img src="/logo2.svg" alt="SocialVerse Logo" className="h-7 w-7 mr-2" />
        <span className="font-bold text-lg text-gray-800">SocialVerse</span>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <div className="w-full flex justify-center mb-6">
            <div className="bg-blue-600 rounded-lg flex items-center justify-center w-48 h-32">
              {/* Placeholder for phone/heart icon */}
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                <rect x="12" y="6" width="24" height="36" rx="4" fill="white" fillOpacity="0.1" />
                <rect x="12" y="6" width="24" height="36" rx="4" stroke="white" strokeWidth="2" />
                <circle cx="24" cy="20" r="5" stroke="white" strokeWidth="2" />
                <rect x="20" y="32" width="8" height="3" rx="1.5" fill="white" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Join SocialVerse</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Connect with friends and the world around you.</p>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center mb-3 transition"
            onClick={handlePlugLogin}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
            Log in with Plug
          </button>
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg flex items-center justify-center mb-4 transition"
            onClick={handleInternetIdentityLogin}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><circle cx="12" cy="8" r="1" /></svg>
            Log in with Internet Identity
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            By continuing, you agree to SocialVerse's{' '}
            <Link to="#" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
            <Link to="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-6">
        © 2023 SocialVerse. All rights reserved.
      </footer>
    </div>
  );
};

export default Login; 