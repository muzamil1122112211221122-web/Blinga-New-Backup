import galleryLight from "@assets/gallery_1784832046472.svg";
import galleryDark from "@assets/gallery_2_1784832046466.svg";
import searchLight from "@assets/search-interface-symbol_1784832046471.svg";
import searchDark from "@assets/search-interface-symbol_2_1784832046467.svg";
import editLight from "@assets/edit_1784832046470.svg";
import editDark from "@assets/edit_2_1784832046467.svg";
import voiceLight from "@assets/voice-note_1784832046470.svg";
import voiceDark from "@assets/voice-note_2_1784832046468.svg";
import historyLight from "@assets/search_1784832046469.svg";
import historyDark from "@assets/search_2_1784832046468.svg";
export const SIDEBAR_ASSETS = {
  search: { light: '/custom-icons/search-interface-symbol.png', dark: '/custom-icons/search-interface-symbol.png' },
  chat: { light: '/custom-icons/new chat.png', dark: '/custom-icons/new chat.png' },
  voice: { light: voiceLight, dark: voiceDark }, // keeping original
  imagine: { light: '/custom-icons/image studio (2).png', dark: '/custom-icons/image studio (2).png' },
  history: { light: historyLight, dark: historyDark }, // keeping original
  close: { light: '/sidebar-close-light.png', dark: '/sidebar-close-dark.png' },
  ownMode: { light: '/custom-icons/owl mode.png', dark: '/custom-icons/owl mode.png' },
  // Tab icons
  ask:    { light: '/custom-icons/ask tab.png',    dark: '/custom-icons/ask tab.png'    },
  nomad:  { light: '/custom-icons/nomad.png',  dark: '/custom-icons/nomad.png'  },
  minds:  { light: '/custom-icons/minds.png',  dark: '/custom-icons/minds.png'  },
  games:  { light: '/custom-icons/games.png',  dark: '/custom-icons/games.png'  },
  labs:   { light: '/custom-icons/blinga labs.png',   dark: '/custom-icons/blinga labs.png'   },
  presentations: { light: '/custom-icons/presentation studio.png', dark: '/custom-icons/presentation studio.png' },
  motion: { light: '/custom-icons/video studio.png', dark: '/custom-icons/video studio.png' },
} as const;
