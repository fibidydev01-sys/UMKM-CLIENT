import { api } from './client';
import type { Contact, CreateContactInput, UpdateContactInput } from '@/types/chat';

// ==========================================
// CONTACTS API SERVICE
// ==========================================

interface ContactsListResponse {
  data: Contact[];
}

interface ContactDetailResponse extends Contact {
  conversations?: Array<{
    id: string;
    status: string;
    lastMessageAt: string;
    lastMessageContent?: string;
  }>;
}

export const contactsApi = {
  /**
   * Get all contacts
   */
  getAll: (): Promise<ContactsListResponse> => {
    return api.get<ContactsListResponse>('/contacts');
  },

  /**
   * Get single contact with conversation history
   */
  getById: (id: string): Promise<ContactDetailResponse> => {
    return api.get<ContactDetailResponse>(`/contacts/${id}`);
  },

  /**
   * Create new contact
   */
  create: (data: CreateContactInput): Promise<{ success: boolean; contact: Contact }> => {
    return api.post<{ success: boolean; contact: Contact }>('/contacts', data);
  },

  /**
   * Update contact
   */
  update: (
    id: string,
    data: UpdateContactInput
  ): Promise<{ success: boolean; contact: Contact }> => {
    return api.put<{ success: boolean; contact: Contact }>(`/contacts/${id}`, data);
  },

  /**
   * Delete contact
   */
  delete: (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`/contacts/${id}`);
  },
};
