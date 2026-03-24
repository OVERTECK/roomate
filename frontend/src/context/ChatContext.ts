'use client';

import React, { createContext } from 'react';
import { ChatContextType } from '@/types/chatTypes';

export const ChatContext = createContext<ChatContextType>(
    {} as ChatContextType
);
