export interface Client {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
}

export const mockClients: Client[] = [
  {
    id: "5",
    name: "Dwight Schrute",

    lastMessage: "Bears. Beets. Battlestar Galactica.",
    timestamp: "2 hrs ago",
  },
  {
    id: "6",
    name: "Andy Bernard",

    lastMessage: "Did you get my voicemail?",
    timestamp: "1 day ago",
  },
  {
    id: "7",
    name: "Stanley Hudson",

    lastMessage: "Is this meeting mandatory?",
    timestamp: "Yesterday",
  },
  {
    id: "8",
    name: "Kevin Malone",

    lastMessage: "I brought snacks.",
    timestamp: "Just now",
  },
  {
    id: "9",
    name: "Angela Martin",

    lastMessage: "This is highly inappropriate.",
    timestamp: "3 hrs ago",
  },
  {
    id: "10",
    name: "Oscar Martinez",

    lastMessage: "Actually, that’s not correct.",
    timestamp: "5 hrs ago",
  },
  {
    id: "11",
    name: "Phyllis Lapin",

    lastMessage: "Close your mouth, sweetie.",
    timestamp: "2 days ago",
  },
  {
    id: "12",
    name: "Ryan Howard",

    lastMessage: "This is a great business idea.",
    timestamp: "Yesterday",
  },
  {
    id: "13",
    name: "Kelly Kapoor",

    lastMessage: "Why didn’t you text me back?",
    timestamp: "Just now",
  },
  {
    id: "14",
    name: "Toby Flenderson",

    lastMessage: "HR needs to talk to you.",
    timestamp: "4 hrs ago",
  },
];

export interface PreHireUser {
  id: string;
  name: string;
  tag: string;
  message: string;
}

export const mockPreHireUsers: PreHireUser[] = [
  {
    id: "ph1",
    name: "David Chen",
    tag: "FAT LOSS",
    message:
      "I've Been Struggling With Late-Night Snacking. How Does Your Program Handle Cravings?",
  },
  {
    id: "ph2",
    name: "Esther Howard",
    tag: "Muscle Gain",
    message:
      "Do I Need A Full Gym Membership For This Or Can I Work From Home?",
  },
  {
    id: "ph3",
    name: "Cameron Williamson",
    tag: "Sleep Recovery",
    message:
      "I've Been Struggling With Late-Night Snacking. How Does Your Program Handle Cravings?",
  },
];
