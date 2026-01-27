"use client";

import { X, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state when closed, after a delay or immediately?
      // Better to keep success state if they re-open? No, reset if they re-open.
      if (!isOpen) {
          setTimeout(() => {
            setIsSuccess(false);
            setName("");
            setPhone("");
            setError("");
          }, 300);
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/waitlist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        throw new Error('Noget gik galt. Prøv igen senere.');
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Der opstod en fejl. Prøv venligst igen.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Luk"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Tak for din tilmelding!
              </h2>
              <p className="text-slate-600">
                Vi giver dig besked direkte på {phone}, så snart ForbrugerAgenten er klar til dig.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Luk
              </button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Kom på venteliste 🚀
                </h2>
                <p className="text-slate-600">
                  Appen er lige på trapperne! Skriv dig op nu, og få direkte besked når vi lancerer.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Navn
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Dit fulde navn"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Dit mobilnummer"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gemmer...
                    </>
                  ) : (
                    "Giv mig besked"
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Vi sender kun én besked når vi går i luften. Ingen spam.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
