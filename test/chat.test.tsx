import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { ChatInput } from '@/components/chat/ChatInput';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import { MessageList } from '@/components/chat/MessageList';
import ChatPage from '@/pages/ChatPage';
import { MemoryRouter } from 'react-router-dom';

// Mock the API module used by ChatPage
vi.mock('@/lib/api', () => {
  return {
    sendChatMessage: vi.fn(),
    getPersistedThreadId: () => null,
    persistThreadId: () => {},
  };
});

import * as api from '@/lib/api';

describe('Chat components (unit)', () => {
  it('ChatInput calls onChange and onSend via button and Enter', async () => {
    const onChange = vi.fn();
    const onSend = vi.fn();

    // Controlled input change
    const { rerender } = render(
      <ChatInput value="" onChange={onChange} onSend={onSend} />
    );

    const textarea = screen.getByPlaceholderText('Digite sua pergunta sobre o manual...');
    fireEvent.change(textarea, { target: { value: 'olá' } });
    expect(onChange).toHaveBeenCalled();

    // When value prop has content, Enter (without Shift) should trigger onSend
    rerender(<ChatInput value={'olá'} onChange={onChange} onSend={onSend} />);
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onSend).toHaveBeenCalled();
  });

  it('SuggestionChips calls onSelect when a chip is clicked', () => {
    const onSelect = vi.fn();
    render(<SuggestionChips onSelect={onSelect} />);

    const first = screen.getByRole('button', { name: /Como trocar o óleo do motor\?/i });
    fireEvent.click(first);
    expect(onSelect).toHaveBeenCalledWith('Como trocar o óleo do motor?');
  });

  it('MessageList shows welcome text and loading indicator', () => {
    // empty messages
    const { rerender } = render(<MessageList messages={[]} loading={false} />);
    expect(screen.getByText(/Bem-vindo ao Manual Veicular/i)).toBeInTheDocument();

    // loading indicator
    rerender(<MessageList messages={[]} loading={true} />);
    expect(screen.getByText(/Consultando o manual/i)).toBeInTheDocument();
  });
});

describe('ChatPage (integration)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sends message and shows out-of-scope assistant message for unsupported vehicles', async () => {
    const sendMock = vi.spyOn(api, 'sendChatMessage') as unknown as vi.SpyInstance;
    sendMock.mockResolvedValueOnce({
      response: 'irrelevant',
      threadId: 'thread-1',
      citations: [],
      out_of_scope: true,
    });

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText('Digite sua pergunta sobre o manual...');
    fireEvent.change(textarea, { target: { value: 'Pergunta sobre um veículo não suportado' } });

    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/fora do escopo do manual do veículo/i)).toBeInTheDocument();
    });
  });

  it('shows error UI when API throws', async () => {
    const sendMock = vi.spyOn(api, 'sendChatMessage') as unknown as vi.SpyInstance;
    sendMock.mockRejectedValueOnce(new Error('Network failed'));

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText('Digite sua pergunta sobre o manual...');
    fireEvent.change(textarea, { target: { value: 'Qualquer pergunta' } });

    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Network failed/i)).toBeInTheDocument();
      // Also should show assistant error fallback
      expect(screen.getByText(/Desculpe, ocorreu um erro ao processar sua mensagem/i)).toBeInTheDocument();
    });
  });

  it('accepts very long messages and forwards trimmed content to API', async () => {
    const long = 'x'.repeat(2500) + '   ';
    const sendMock = vi.spyOn(api, 'sendChatMessage') as unknown as vi.SpyInstance;
    sendMock.mockResolvedValueOnce({ response: 'ok', threadId: 't2', citations: [] });

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText('Digite sua pergunta sobre o manual...');
    fireEvent.change(textarea, { target: { value: long } });

    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendMock).toHaveBeenCalledWith(long.trim(), null);
    });
  });

  it('clicking a suggestion fills the input', async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    const chip = screen.getByRole('button', { name: /Qual a pressão correta dos pneus\?/i });
    fireEvent.click(chip);

    const textarea = screen.getByPlaceholderText('Digite sua pergunta sobre o manual...');
    expect((textarea as HTMLTextAreaElement).value).toContain('Qual a pressão correta dos pneus?');
  });
});
