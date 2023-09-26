export interface DragonT {
  name: string
  artist: string
  imgURL: string
}

export const dragons: DragonT[] = [
  {
    name: "Rendezvous",
    artist: "Ethan Byte",
    imgURL:
      "/dragons/0c1987f8-42aa-46d8-9d2d-98e5b7bb5d7f.png",
  },
  {
    name: "Async Awakenings",
    artist: "Nina Netcode",
    imgURL:
      "/dragons/8e25da39-6895-4ad4-88b2-34a31ac1bfa4.png",
  },
  {
    name: "The Art of Reusability",
    artist: "Lena Logic",
    imgURL:
      "/dragons/41a691af-f4c3-4242-a223-5b0796b603ec.png",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    imgURL:
      "/dragons/65f6e1c0-f76d-4a1e-869e-dfa6011eaeea.png",
  },
  {
    name: "Thinking Components",
    artist: "Lena Logic",
    imgURL:
      "/dragons/8599b949-2f76-4ec5-91b6-1a9a6fae3867.png",
  },
]

export const sidebarLinks = [
  {
    imgURL: '/assets/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/assets/community.svg',
    route: '/table',
    label: 'Table',
  },
  {
    imgURL: '/assets/community.svg',
    route: '/form',
    label: 'Form',
  },
  {
    imgURL: '/assets/create.svg',
    route: '/register',
    label: 'Register',
  },
  {
    imgURL: '/assets/create.svg',
    route: '/login',
    label: 'Login',
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
