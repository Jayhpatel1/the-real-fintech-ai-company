import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
  read: boolean;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage: Message | null;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
        chat.lastMessage = action.payload.message;
      }
      if (state.activeChat && state.activeChat.id === action.payload.chatId) {
        state.activeChat.messages.push(action.payload.message);
        state.activeChat.lastMessage = action.payload.message;
      }
    },
  },
});

export const { setChats, setActiveChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;