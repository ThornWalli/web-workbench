export async function getDefaultVoice() {
  await setup();

  const voice = voiceMap.values().find(voice => voice.default);

  if (!voice) {
    throw new Error('No default voice found');
  }

  return voice;
}

export async function getVoiceByName(name: string) {
  await setup();
  const voice = voiceMap.get(name);
  if (voice === undefined) {
    throw new Error(`Voice ${name} not found`);
  }
  return voice;
}

const voiceMap = new Map<string, SpeechSynthesisVoice>(); // = new Map<string, SpeechSynthesisVoice>();

export async function setup() {
  await fillVoiceMap(voiceMap);
}

export function fillVoiceMap(voiceMap: Map<string, SpeechSynthesisVoice>) {
  return new Promise<SpeechSynthesisVoice[]>(resolve => {
    const resolveVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceMap.clear();
      voices.forEach(voice => {
        voiceMap.set(voice.name, voice);
      });
      resolve(Array.from(voiceMap.values()));
    };
    if (window.speechSynthesis.getVoices().length) {
      resolveVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = () => resolveVoices();
    }
  });
}

export const DEFAULT_PRESET_LANGUAGE = 'de-DE';
export const PRESET_LANGUAGES = [
  {
    title: 'English (US)',
    value: 'en-US'
  },
  {
    title: 'English (UK)',
    value: 'en-GB'
  },
  {
    title: 'German (DE)',
    value: 'de-DE'
  },
  {
    title: 'Spanish (ES)',
    value: 'es-ES'
  },
  {
    title: 'French (FR)',
    value: 'fr-FR'
  },
  {
    title: 'Italian (IT)',
    value: 'it-IT'
  },
  {
    title: 'Polish (PL)',
    value: 'pl-PL'
  }
];
