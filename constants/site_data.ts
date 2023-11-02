import { parseIntSafe } from "@/lib/utils";

export const APP_WIDTH_MIN = 350;
export const chainTypeDefault = 'evm'
export const nftIdMin = 0;
export const nftIdMax = 9;
export type DragonT = {
  id: number;
  price: number
  name: string
  artist: string
  category: string
  description: string
  imgURL: string
}
//export type nftT = Pick<DragonT, "id"> & Partial<DragonT>
export type nftT = Partial<DragonT> & { id: number }
export const extractNftIds = (nfts: nftT[]) => {
  const nftIdArray = nfts.map(item => parseIntSafe(item.id))
  return nftIdArray;
}

export type contractT = {
  address: string
  name: string
  symbol: string
}
export const localDp6contracts: contractT[] = [
  {
    name: "usdt", symbol: "usdt", address: "0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6",
  },
]
export const sepoliaDp6contracts: contractT[] = [
  {
    name: "usdt", symbol: "usdt", address: "",
  },
]
export const soldout = "/kisspng-sold512x375.png";
export const dragons: DragonT[] = [
  {
    id: 0, name: "Rendezvous", price: 100,
    artist: "Ethan Byte", category: "dragon",
    description: "will meet you at unexpected times...",
    imgURL:
      "/dragons/0c1987f8-42aa-46d8-9d2d-98e5b7bb5d7f.png",
  },
  {
    id: 1, name: "Awakenings", price: 200,
    artist: "Nina Netcode", category: "dragon", description: "to appear soon",
    imgURL:
      "/dragons/8e25da39-6895-4ad4-88b2-34a31ac1bfa4.png",
  },
  {
    id: 2, name: "Wolf Dragon", price: 300,
    artist: "Lena Logic", category: "dragon", description: "can tear anything apart",
    imgURL:
      "/dragons/41a691af-f4c3-4242-a223-5b0796b603ec.png",
  },
  {
    id: 3, name: "Predator Dragon", price: 400,
    artist: "Beth Binary", category: "dragon", description: "can hunt anything down",
    imgURL:
      "/dragons/65f6e1c0-f76d-4a1e-869e-dfa6011eaeea.png",
  },
  {
    id: 4, name: "Mystical Dragon", price: 500,
    artist: "Lena Logic", category: "dragon", description: "can wield mystical powers",
    imgURL:
      "/dragons/8599b949-2f76-4ec5-91b6-1a9a6fae3867.png",
  },
  {
    id: 5, name: "Water Dragon", price: 600,
    artist: "Lena Logic", category: "dragon", description: "can dive into the sea",
    imgURL:
      "/dragons/a4a4b0a8-f0a8-4bb7-9b72-c43153390d47.png",
  },
  {
    id: 6, name: "Eagle Dragon", price: 700,
    artist: "Lena Logic", category: "dragon", description: "can fly into the sky",
    imgURL:
      "/dragons/b45006c8-2a7a-4950-89f8-bded7fc4dcad.png",
  },
]

export const sidebarLinks = [
  {
    imgURL: '/assets/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/assets/create.svg',
    route: '/web3',
    label: 'Web3',
  },
  {
    imgURL: '/assets/community.svg',
    route: '/table',
    label: 'Table',
  },
  {
    imgURL: '/assets/members.svg',
    route: '/collections',
    label: 'Collections',
  },
  {
    imgURL: '/assets/profile.svg',
    route: '/login',
    label: 'Login/Register',
  },
  {
    imgURL: '/assets/profile.svg',
    route: '/chart',
    label: 'Chart',
  },
  {
    imgURL: '/assets/community.svg',
    route: '/contact-us',
    label: 'Contact Us',
  },
];
/**
  {
    imgURL: '/assets/search.svg',
    route: '/search',
    label: 'Search',
  },
  {
    imgURL: '/assets/heart.svg',
    route: '/activity',
    label: 'Activity',
  },
 */
export const profileTabs = [
  { value: 'threads', label: 'Threads', icon: '/assets/reply.svg' },
  { value: 'replies', label: 'Replies', icon: '/assets/members.svg' },
  { value: 'tagged', label: 'Tagged', icon: '/assets/tag.svg' },
];

export const communityTabs = [
  { value: 'threads', label: 'Threads', icon: '/assets/reply.svg' },
  { value: 'members', label: 'Members', icon: '/assets/members.svg' },
  { value: 'requests', label: 'Requests', icon: '/assets/request.svg' },
];
