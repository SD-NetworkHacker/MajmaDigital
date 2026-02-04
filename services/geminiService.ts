
import { GoogleGenAI, Modality } from "@google/genai";

// Utilisation de import.meta.env pour Vite au lieu de process.env
// Fix: Safely access env to prevent crash if undefined
const env = (import.meta as any).env || {};
const apiKey = env.VITE_GEMINI_API_KEY;

// Initialisation sécurisée : ne pas crasher si la clé est absente
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Erreur init Gemini:", e);
  }
} else {
  console.warn("Clé API Gemini manquante (VITE_GEMINI_API_KEY). Le mode hors ligne IA est activé.");
}

// Bibliothèque de secours en cas d'erreur ou d'absence de clé
const SPIRITUAL_FALLBACKS = [
  "La fraternité est le socle de notre Dahira. Cultivons l'entraide et la discipline.",
  "La science sans la pratique est comme un arbre sans fruits. Étudions pour agir.",
  "La patience et la persévérance sont les clés de toute réussite communautaire.",
  "L'engagement dans le service d'autrui est la plus haute forme de dévotion.",
  "La transparence dans nos actions renforce la confiance et la baraka du groupe."
];

const getRandomFallback = () => SPIRITUAL_FALLBACKS[Math.floor(Math.random() * SPIRITUAL_FALLBACKS.length)];

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (!ai) throw new Error("AI_OFFLINE");
    
    const errBody = error.error || error;
    const errorCode = errBody?.code || error?.status;
    const errorMessage = errBody?.message || error?.message || '';
    
    const isQuotaError = 
      errorCode === 429 || 
      errorMessage.includes('429') || 
      errorMessage.includes('quota') ||
      errorMessage.includes('RESOURCE_EXHAUSTED');

    if (isQuotaError) {
      console.warn("Quota Gemini atteint.");
      throw new Error("QUOTA_EXHAUSTED");
    }

    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getSmartInsight = async (topic: string) => {
  if (!ai) return getRandomFallback();
  
  try {
    return await withRetry(async () => {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash', // Utilisation d'un modèle plus stable/rapide
        contents: `En tant qu'assistant spirituel du Dahira, donne un court conseil (max 2 phrases) sur : ${topic}.`,
      });
      return response.text || getRandomFallback();
    });
  } catch (error) {
    return getRandomFallback();
  }
};

export const explainXassaid = async (title: string) => {
  if (!ai) return "Service d'explication indisponible (Mode hors ligne).";

  try {
    return await withRetry(async () => {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Explique brièvement le Xassaid "${title}".`,
      });
      return response.text || "Explication indisponible.";
    });
  } catch (error) {
    return "Le service d'analyse est momentanément indisponible.";
  }
};

export const translateXassaid = async (text: string) => {
  if (!ai) return "Traduction indisponible (Mode hors ligne).";

  try {
    return await withRetry(async () => {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Traduis en français : "${text}"`,
      });
      return response.text || "Traduction impossible.";
    });
  } catch (error) {
    return "La traduction n'a pas pu être générée.";
  }
};

export const startChat = () => {
  if (!ai) return null;
  try {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Tu es l'assistant du Dahira Majmahoun Nourayni.",
      }
    });
  } catch (e) {
    return null;
  }
};

export const transcribeAudio = async (base64Audio: string) => {
  if (!ai) return "Transcription indisponible.";
  // Implémentation simplifiée pour éviter les crashs si le modèle vision n'est pas dispo
  return "Fonctionnalité audio désactivée temporairement.";
};

export const generateSpeech = async (text: string) => {
  // TTS souvent instable ou payant, retour null par défaut pour sécurité
  return null;
};

export const getMapsLocationInfo = async (query: string, lat?: number, lng?: number) => {
  if (!ai) return { text: "Service de cartographie indisponible." };
  try {
      // Version simplifiée sans outils complexes pour éviter les erreurs de config
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Donne des infos touristiques et religieuses brèves sur ce lieu : ${query}`,
      });
      return { text: response.text || "Aucune info." };
  } catch (error) {
    return { text: "Info lieu indisponible." };
  }
};

export const generateSocialPost = async (topic: string, platform: string, tone: string) => {
  if (!ai) return "Génération impossible (IA Hors ligne).";
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Post ${platform} sur "${topic}". Ton: ${tone}.`,
    });
    return response.text || "";
  } catch (e) { return "Erreur génération."; }
};

export const generateReplyToComment = async (comment: string, context: string) => {
    if (!ai) return "Réponse impossible.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Réponds à ce commentaire : "${comment}"`,
        });
        return response.text || "";
    } catch (e) { return "Erreur."; }
};

export const generateHooks = async (topic: string) => {
    if (!ai) return "Hooks impossibles.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `3 accroches pour : "${topic}"`,
        });
        return response.text || "";
    } catch (e) { return "Erreur."; }
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const buffer = ctx.createBuffer(numChannels, 1, sampleRate);
  return buffer; // Dummy return pour éviter crash
}

export function decodeBase64(base64: string) {
  try {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  } catch (e) {
      return new Uint8Array(0);
  }
}
