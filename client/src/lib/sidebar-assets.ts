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
  search: { light: '/custom-icons/search.svg', dark: '/custom-icons/search.svg' },
  chat:   { light: '/custom-icons/new chat.svg',   dark: '/custom-icons/new chat.svg' },
  voice:  { light: voiceLight, dark: voiceDark },
  imagine:{ light: '/custom-icons/imagine studio.svg', dark: '/custom-icons/imagine studio.svg' },
  history:{ light: historyLight, dark: historyDark },
  close:  { light: '/sidebar-close-light.png', dark: '/sidebar-close-dark.png' },
  ownMode:{ light: '/custom-icons/owl mode.svg', dark: '/custom-icons/owl mode.svg' },
  // Tab icons
  ask:    { light: '/custom-icons/ask tab.svg',           dark: '/custom-icons/ask tab.svg'           },
  nomad:  { light: '/custom-icons/nomad.svg',             dark: '/custom-icons/nomad.svg'             },
  minds:  { light: '/custom-icons/blinga minds.svg',      dark: '/custom-icons/blinga minds.svg'      },
  games:  { light: '/custom-icons/blinga games.svg',      dark: '/custom-icons/blinga games.svg'      },
  labs:   { light: '/custom-icons/blinga labs.svg',       dark: '/custom-icons/blinga labs.svg'       },
  presentations: { light: '/custom-icons/presentation studio.svg', dark: '/custom-icons/presentation studio.svg' },
  motion: { light: '/custom-icons/motion studio.svg',     dark: '/custom-icons/motion studio.svg'     },
} as const;
