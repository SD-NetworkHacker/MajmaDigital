
import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Bibliothèque de secours en cas d'erreur de quota (Fallback)
const SPIRITUAL_FALLBACKS = [
  "La fraternité est le socle de notre Dahira. Cultivons l'entraide et la discipline.",
  "La science sans la pratique est comme un arbre sans fruits. Étudions pour agir.",
  "La patience et la persévérance sont les clés de toute réussite communautaire.",
  "L'engagement dans le service d'autrui est la plus haute forme de dévotion.",
  "La transparence dans nos actions renforce la confiance et la baraka du groupe."
];

const getRandomFallback = () => SPIRITUAL_FALLBACKS[Math.floor(Math.random() * SPIRITUAL_FALLBACKS.length)];

/**
 * Utilitaire de retry avec backoff exponentiel
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Analyse de l'erreur pour détecter les problèmes de quota
    const errBody = error.error || error;
    const errorCode = errBody?.code || error?.status;
    const errorMessage = errBody?.message || error?.message || '';
    
    const isQuotaError = 
      errorCode === 429 || 
      errorMessage.includes('429') || 
      errorMessage.includes('quota') ||
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      (typeof error === 'string' && error.includes('429'));

    // Si quota épuisé, on ne réessaie pas, on renvoie l'erreur pour passer au fallback immédiatement
    if (isQuotaError) {
      console.warn("Quota Gemini atteint. Passage en mode hors-ligne pour l'IA.");
      throw new Error("QUOTA_EXHAUSTED");
    }

    if (retries > 0) {
      // console.warn(`Erreur API (non-quota). Nouvel essai dans ${delay}ms... (${retries} restants)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getSmartInsight = async (topic: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `En tant qu'assistant intelligent du Dahira Majmahoun Nourayni, fournis un court résumé inspirant (maximum 2 phrases) et des conseils sur : ${topic}. Ton ton est spirituel, respectueux et en français.`,
      });
      return response.text || getRandomFallback();
    });
  } catch (error: any) {
    if (error.message !== "QUOTA_EXHAUSTED") console.warn("Gemini Service:", error.message);
    return getRandomFallback();
  }
};

export const explainXassaid = async (title: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Explique brièvement la signification spirituelle et les bienfaits du Xassaid intitulé "${title}" de Cheikh Ahmadou Bamba. Sois précis et utilise un ton respectueux propre au mouridisme.`,
      });
      return response.text || "L'explication profonde de ce texte sacré demande une méditation calme.";
    });
  } catch (error: any) {
    if (error.message !== "QUOTA_EXHAUSTED") console.warn("Gemini Service:", error.message);
    return "Le service d'analyse est momentanément indisponible (Maintenance IA). La récitation reste une source de baraka.";
  }
};

export const translateXassaid = async (text: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Traduis ce texte sacré (Xassaid) de l'arabe/wolof vers un français littéraire et spirituel : \n\n${text}`,
      });
      return response.text || "La traduction est momentanément indisponible.";
    });
  } catch (error) {
    return "La traduction n'a pas pu être générée (Service IA saturé).";
  }
};

export const startChat = () => {
  try {
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Tu es l'assistant spirituel et administratif du Dahira Majmahoun Nourayni. Tu aides les membres avec des questions sur le dahira, le mouridisme, les Xassaids, et l'organisation. Ton ton est respectueux, calme et inspirant. Si tu ne peux pas répondre pour des raisons techniques, excuse-toi humblement.",
      }
    });
  } catch (e) {
    console.warn("Chat init failed due to quota or network.");
    return null;
  }
};

export const transcribeAudio = async (base64Audio: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
              { text: "Transcris précisément cet audio en français. Si c'est du Wolof, traduis-le aussi en français en dessous." }
            ]
          }
        ]
      });
      return response.text || "Transcription impossible.";
    });
  } catch (error) {
    return "Désolé, le service de transcription est actuellement indisponible.";
  }
};

export const generateSpeech = async (text: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Lis ceci avec une voix posée et respectueuse : ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    });
  } catch (error) {
    return null;
  }
};

export const getMapsLocationInfo = async (query: string, lat?: number, lng?: number) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
            }
          }
        }
      });
      return {
        text: response.text || "Informations locales non disponibles.",
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    });
  } catch (error) {
    return { text: "Le service de cartographie intelligente est en maintenance." };
  }
};

// --- NOUVELLES FONCTIONS CM ---

export const generateSocialPost = async (topic: string, platform: string, tone: string = 'Spirituel') => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Agis comme le Community Manager expert du Dahira Majmahoun Nourayni. 
        Rédige un post pour ${platform} sur le sujet : "${topic}".
        
        Ton : ${tone}.
        Structure : Accroche virale, développement inspirant, appel à l'action.
        Inclus : Emojis pertinents, 3-5 hashtags stratégiques.
        Spécificité : Si c'est Instagram/TikTok, propose une idée visuelle ou de scénario vidéo.`,
      });
      return response.text || "Génération du post impossible pour le moment.";
    });
  } catch (error) {
    return "Le service de rédaction IA est en pause (Quota atteint).";
  }
};

export const generateReplyToComment = async (comment: string, context: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Un membre a laissé ce commentaire sur nos réseaux : "${comment}".
        Contexte du post original : "${context}".
        
        Analyse le sentiment (Positif/Négatif/Question/Troll).
        Rédige 3 options de réponse :
        1. Formelle et polie.
        2. Chaleureuse et fraternelle.
        3. Courte et directe.
        Utilise un ton adapté au Dahira.`,
      });
      return response.text || "Analyse impossible.";
    });
  } catch (error) {
    return "Erreur d'analyse (Service indisponible).";
  }
};

export const generateHooks = async (topic: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Génère 5 accroches (Hooks) virales et percutantes pour un post sur "${topic}" destiné à une audience jeune et connectée du Dahira.`,
      });
      return response.text || "Génération d'accroches impossible.";
    });
  } catch (error) {
    return "Erreur de génération (Service indisponible).";
  }
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
