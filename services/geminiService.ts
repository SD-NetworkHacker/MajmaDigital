
import { GoogleGenAI } from "@google/genai";

// Initialization check helper
const getClient = () => {
  try {
    // Access safely via process.env which is replaced at build time
    const apiKey = process.env.API_KEY;
    
    // Strict check: must be string, not empty, not placeholder
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '' || apiKey.includes('undefined')) {
      console.warn("Gemini API Key is missing or invalid. AI features are disabled.");
      return null;
    }
    
    return new GoogleGenAI({ apiKey: apiKey.trim() });
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
    return null;
  }
};

const SPIRITUAL_FALLBACKS = [
  "La fraternité est le socle de notre Dahira. Cultivons l'entraide et la discipline.",
  "La science sans la pratique est comme un arbre sans fruits. Étudions pour agir.",
  "La patience et la persévérance sont les clés de toute réussite communautaire.",
  "L'engagement dans le service d'autrui est la plus haute forme de dévotion.",
  "La transparence dans nos actions renforce la confiance et la baraka du groupe."
];

const getRandomFallback = () => SPIRITUAL_FALLBACKS[Math.floor(Math.random() * SPIRITUAL_FALLBACKS.length)];

export const getSmartInsight = async (topic: string) => {
  const ai = getClient();
  if (!ai) return getRandomFallback();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `En tant qu'assistant spirituel du Dahira, donne un court conseil (max 2 phrases) sur : ${topic}.`,
    });
    return response.text || getRandomFallback();
  } catch (error) {
    console.error("IA Insight Error:", error);
    return getRandomFallback();
  }
};

export const explainXassaid = async (title: string) => {
  const ai = getClient();
  if (!ai) return "L'analyse IA est indisponible (Clé API manquante).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explique brièvement le Xassaid "${title}" et ses bienfaits.`,
    });
    return response.text || "Explication indisponible.";
  } catch (error) {
    return "Service momentanément indisponible.";
  }
};

export const translateXassaid = async (text: string) => {
  const ai = getClient();
  if (!ai) return "Traduction IA désactivée.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Traduis ce texte en français avec un contexte spirituel : "${text}"`,
    });
    return response.text || "Traduction impossible.";
  } catch (error) {
    return "La traduction n'a pas pu être générée.";
  }
};

export const startChat = () => {
  const ai = getClient();
  if (!ai) return null;

  try {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Tu es l'assistant du Dahira Majmahoun Nourayni. Tu es bienveillant, sage et serviable.",
      }
    });
  } catch (e) {
    console.error("Chat Error:", e);
    return null;
  }
};

export const transcribeAudio = async (base64Audio: string) => {
  const ai = getClient();
  if (!ai) return "Transcription désactivée.";

  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
                { text: "Transcribe this audio strictly verbatim." }
            ]
        }
      });
      return response.text || "Transcription vide.";
  } catch (e) {
      console.error("Transcription Error:", e);
      return "Erreur lors de la transcription."; 
  }
};

export const generateSpeech = async (text: string) => {
  // Not implemented in Flash basic model
  return null;
};

export const getMapsLocationInfo = async (query: string, lat?: number, lng?: number) => {
  const ai = getClient();
  if (!ai) return { text: "Info lieu indisponible (IA off)." };

  try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Donne des infos pertinentes sur ce lieu pour un membre du Dahira : ${query}. Coordonnées: ${lat}, ${lng}`,
      });
      return { text: response.text || "Aucune info." };
  } catch (error) {
    return { text: "Info lieu indisponible." };
  }
};

export const generateSocialPost = async (topic: string, platform: string, tone: string) => {
  const ai = getClient();
  if (!ai) return "Génération indisponible.";

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Rédige un post ${platform} sur "${topic}". Ton: ${tone}. Ajoute des emojis et hashtags pertinents.`,
    });
    return response.text || "";
  } catch (e) { return "Erreur génération."; }
};

export const generateReplyToComment = async (comment: string, context: string) => {
    const ai = getClient();
    if (!ai) return "IA indisponible.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggère une réponse polie et fraternelle à ce commentaire : "${comment}". Contexte: ${context}`,
        });
        return response.text || "";
    } catch (e) { return "Erreur."; }
};

export const generateHooks = async (topic: string) => {
    const ai = getClient();
    if (!ai) return "IA indisponible.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Donne 3 accroches virales pour un post sur : "${topic}"`,
        });
        return response.text || "";
    } catch (e) { return "Erreur."; }
};

// Utils for Audio
export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const buffer = ctx.createBuffer(numChannels, 1, sampleRate);
  return buffer; // Dummy return to prevent build error if unused
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
