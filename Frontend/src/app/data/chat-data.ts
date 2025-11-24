// src/app/data/chat-data.ts

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  type: 'individual' | 'group';
}

export const DUMMY_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey! Did you see the new design mockups?',
    timestamp: '2 min ago',
    unreadCount: 3,
    isOnline: true,
    isFavorite: true,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '2',
    name: 'Development Team',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Michael: The build is ready for testing',
    timestamp: '15 min ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'group'
  },
  {
    id: '3',
    name: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Thanks for your help with the code review!',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isOnline: true,
    isFavorite: true,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Can we reschedule the meeting?',
    timestamp: '2 hours ago',
    unreadCount: 1,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '5',
    name: 'Marketing Team',
    avatar: 'https://i.pravatar.cc/150?img=6',
    lastMessage: 'Lisa: Campaign results look great! 🎉',
    timestamp: '3 hours ago',
    unreadCount: 5,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'group'
  },
  {
    id: '6',
    name: 'James Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=7',
    lastMessage: 'The project timeline looks good to me',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    isFavorite: true,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '7',
    name: 'Design Review',
    avatar: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'Sophie: I\'ve updated the color palette',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'group'
  },
  {
    id: '8',
    name: 'Rachel Green',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'Looking forward to our collaboration!',
    timestamp: '2 days ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '9',
    name: 'Project Alpha',
    avatar: 'https://i.pravatar.cc/150?img=10',
    lastMessage: 'Tom: Sprint planning is scheduled for Monday',
    timestamp: '2 days ago',
    unreadCount: 2,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'group'
  },
  {
    id: '10',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?img=11',
    lastMessage: 'Great work on the presentation!',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: true,
    isFavorite: false,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '11',
    name: 'Support Team',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Anna: Ticket #1234 has been resolved',
    timestamp: '4 days ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'group'
  },
  {
    id: '12',
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?img=13',
    lastMessage: 'See you at the conference next week!',
    timestamp: '5 days ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: true,
    isArchived: false,
    type: 'individual'
  },
  {
    id: '13',
    name: 'Finance Department',
    avatar: 'https://i.pravatar.cc/150?img=14',
    lastMessage: 'Robert: Q4 reports are ready for review',
    timestamp: '1 week ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: false,
    type: 'group'
  },
  {
    id: '14',
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=15',
    lastMessage: 'Thanks for the feedback!',
    timestamp: '1 week ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: true,
    type: 'individual'
  },
  {
    id: '15',
    name: 'HR Announcements',
    avatar: 'https://i.pravatar.cc/150?img=16',
    lastMessage: 'Jennifer: New policy updates available',
    timestamp: '2 weeks ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: true,
    type: 'group'
  },
   {
    id: 'x9h2l0aibot',
    name: 'Aria',
    avatar: 'https://www.google.com/imgres?q=avatar%20ui%20image&imgurl=https%3A%2F%2Fwww.shutterstock.com%2Fimage-illustration%2F3d-illustration-smiling-happy-hipster-260nw-1882751569.jpg&imgrefurl=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fux-avatar&docid=1ypn5P-HzhKAWM&tbnid=DyH5lGvInT4BQM&vet=12ahUKEwiC9PusnIORAxXfxjgGHcRKEVIQM3oECGYQAA..i&w=325&h=280&hcb=2&ved=2ahUKEwiC9PusnIORAxXfxjgGHcRKEVIQM3oECGYQAA',
    lastMessage: 'Jennifer: New policy updates available',
    timestamp: '2 weeks ago',
    unreadCount: 0,
    isOnline: false,
    isFavorite: false,
    isArchived: true,
    type: 'individual'
  }
];