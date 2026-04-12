export interface UserType {
  id: string;
  name: string;
  email: string;
  type: "Individual" | "Professional";
  subscription: "Active" | "Expired" | "Free Trail" | "Cancelled";
  status: "Active" | "Inactive";
  joinedDate: string;
}

export const USERS_DATA: UserType[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "2",
    name: "Esther Howard",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Expired",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "3",
    name: "Brooklyn Simmons",
    email: "olco@example.com",
    type: "Professional",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "4",
    name: "Jenny Wilson",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Free Trail",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "5",
    name: "Guy Hawkins",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "6",
    name: "Wade Warren",
    email: "olco@example.com",
    type: "Professional",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "7",
    name: "Jacob Jones",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Cancelled",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "8",
    name: "Darlene Robertson",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "9",
    name: "Annette Black",
    email: "olco@example.com",
    type: "Professional",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "10",
    name: "Floyd Miles",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Expired",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "11",
    name: "Devon Lane",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
  {
    id: "12",
    name: "Eleanor Pena",
    email: "olco@example.com",
    type: "Individual",
    subscription: "Active",
    status: "Active",
    joinedDate: "2023-10-12",
  },
];
