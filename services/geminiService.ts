import { GoogleGenAI, Type } from "@google/genai";
import type { SymptomData, Locale } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const langMap: Record<Locale, string> = {
    es: 'Spanish',
    en: 'English',
    fr: 'French',
    it: 'Italian',
    zh: 'Mandarin Chinese'
};

const symptomSchema = {
    type: Type.OBJECT,
    properties: {
        symptomTitle: { type: Type.STRING, description: "The clear and concise name of the symptom/illness. Example: 'Bronchitis', 'Diabetes'." },
        definition: { type: Type.STRING, description: "A brief explanation of the symptom/illness to confirm it's the correct entry." },
        technicalInfo: {
            type: Type.OBJECT,
            description: "Technical details from biodecoding.",
            properties: {
                embryonicLayer: { type: Type.STRING, description: "The related embryonic layer (Ectoderm, Mesoderm, Endoderm)." },
                conflictType: { type: Type.STRING, description: "The type of biological conflict (e.g., separation, devaluation, territory)." },
                diseasePhaseBehavior: { type: Type.STRING, description: "Behavior in phases: sympathicotonia (active phase) and vagotonia (repair phase)." }
            },
        },
        biologicalMeaning: { type: Type.STRING, description: "Explanation of the biological 'purpose' of the symptom. The survival purpose of the biological program." },
        conflicts: {
            type: Type.ARRAY,
            description: "List of underlying emotional conflicts. They should be clear and varied.",
            items: { type: Type.STRING }
        }
    },
    required: ["symptomTitle", "definition", "biologicalMeaning", "conflicts"]
};


export const getSymptomInfo = async (symptom: string, locale: Locale): Promise<SymptomData> => {
    const targetLanguage = langMap[locale] || 'Spanish';
    const prompt = `
        Act as an expert in biodecoding. Analyze the following symptom or ailment: "${symptom}".
        Provide a complete and structured decoding. If the term is ambiguous, choose the most common interpretation.
        The tone should be empowering and focused on self-observation. Do not give medical advice.
        Emphasize that the illness is a biological survival program and that conflicts are subjective interpretations.
        Generate the response exclusively in the specified JSON format, with all text content translated to ${targetLanguage}.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: symptomSchema,
                temperature: 0.5,
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as SymptomData;

    } catch (error) {
        console.error("Error fetching symptom info from Gemini:", error);
        throw new Error("Failed to get symptom information from Gemini API.");
    }
};

export const getTechniqueExplanation = async (techniqueName: string, locale: Locale): Promise<string> => {
    const targetLanguage = langMap[locale] || 'Spanish';
    const prompt = `
        Act as a coach in NLP and emotional wellness.
        Explain the following technique clearly, simply, and practically: "${techniqueName}".
        Describe what it is, what it's for, and the basic steps to perform it as a self-help exercise.
        The tone should be educational and motivating. Do not generate titles, only the explanatory text.
        Use line breaks to separate paragraphs and lists.
        The entire response must be in ${targetLanguage}.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        
        return response.text;
        
    } catch (error) {
        console.error("Error fetching technique explanation from Gemini:", error);
        throw new Error("Failed to get technique explanation from Gemini API.");
    }
};