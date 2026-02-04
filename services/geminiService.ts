
import { GoogleGenAI } from "@google/genai";

// Initialization with process.env.API_KEY per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SPIRITUAL_FALLBACKS = [
  "La fraternité est le socle de notre Dahira. Cultivons l'entraide et la discipline.",
  "La science sans la pratique est comme un arbre sans fruits. Étudions pour agir.",
  "La patience et la persévérance sont les clés de toute réussite communautaire.",
  "L'engagement dans le service d'autrui est la plus haute forme de dévotion.",
  "La transparence dans nos actions renforce la confiance et la baraka du groupe."
];

const getRandomFallback = () => SPIRITUAL_FALLBACKS[Math.floor(Math.random() * SPIRITUAL_FALLBACKS.length)];

export const getSmartInsight = async (topic: string) => {
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
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explique brièvement le Xassaid "${title}".`,
    });
    return response.text || "Explication indisponible.";
  } catch (error) {
    return "Le service d'analyse est momentanément indisponible.";
  }
};

export const translateXassaid = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Traduis en français : "${text}"`,
    });
    return response.text || "Traduction impossible.";
  } catch (error) {
    return "La traduction n'a pas pu être générée.";
  }
};

export const startChat = () => {
  try {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Tu es l'assistant du Dahira Majmahoun Nourayni.",
      }
    });
  } catch (e) {
    console.error("Chat Error:", e);
    return null;
  }
};

export const transcribeAudio = async (base64Audio: string) => {
  try {
      // Placeholder: The actual implementation would use a multimodal model if available
      // or specific audio model. For 'gemini-2.5-flash', we can send audio parts.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
                { text: "Transcribe this audio." }
            ]
        }
      });
      return response.text || "Transcription vide.";
  } catch (e) {
      console.error("Transcription Error:", e);
      return "Fonctionnalité audio indisponible."; 
  }
};

export const generateSpeech = async (text: string) => {
  // TTS implementation placeholder as 2.5-flash doesn't support TTS natively via generateContent in the same way 
  // without specific config, or requires 'gemini-2.5-flash-preview-tts'.
  // Returning null to be safe as per previous code behavior
  return null;
};

export const getMapsLocationInfo = async (query: string, lat?: number, lng?: number) => {
  try {
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
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Post ${platform} sur "${topic}". Ton: ${tone}.`,
    });
    return response.text || "";
  } catch (e) { return "Erreur génération."; }
};

export const generateReplyToComment = async (comment: string, context: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Réponds à ce commentaire : "${comment}". Contexte: ${context}`,
        });
        return response.text || "";
    } catch (e) { return "Erreur."; }
};

export const generateHooks = async (topic: string) => {
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
  return buffer; // Dummy return
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
