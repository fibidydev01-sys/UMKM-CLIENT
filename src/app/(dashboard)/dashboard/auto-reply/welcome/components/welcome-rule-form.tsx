'use client';

import { useState, useRef, useEffect } from 'react';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { useSampleOrder } from '@/hooks/use-orders';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AutoReplyRule } from '@/types/chat';

// ==========================================
// WELCOME MESSAGE RULE FORM
// ==========================================

const DEFAULT_TEMPLATE = `Halo {{name}}! 👋

Terima kasih sudah menghubungi kami.

Ada yang bisa kami bantu? Silakan sampaikan kebutuhan Anda, kami siap membantu! 😊`;

const VARIABLES = [
  { key: '{{name}}', label: 'NAMA', description: 'Nama customer (jika tersedia)' },
  { key: '{{phone}}', label: 'TELEPON', description: 'Nomor WhatsApp customer' },
];

interface Props {
  rule?: AutoReplyRule | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WelcomeRuleForm({ rule, open, onClose, onSuccess }: Props) {
  const { createRule, updateRule, isSaving } = useAutoReply();
  const { sampleData } = useSampleOrder();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const isEdit = !!rule;

  // Helper: Check if variable exists in message
  const hasVariable = (varKey: string) => {
    return message.includes(varKey);
  };

  // Helper: Get active variables in message
  const getActiveVariables = () => {
    return VARIABLES.filter((v) => message.includes(v.key));
  };

  // Helper: Convert HTML content to message format
  const getMessageFromEditor = () => {
    if (!editorRef.current) return '';

    const clonedContent = editorRef.current.cloneNode(true) as HTMLElement;

    // Replace chip spans with {{variable}} format
    clonedContent.querySelectorAll('[data-variable]').forEach((chip) => {
      const varKey = chip.getAttribute('data-variable');
      const textNode = document.createTextNode(varKey || '');
      chip.parentNode?.replaceChild(textNode, chip);
    });

    return clonedContent.innerText.trim();
  };

  // Helper: Insert variable chip at cursor
  const insertVariableChip = (variable: typeof VARIABLES[0]) => {
    if (!editorRef.current) return;
    if (hasVariable(variable.key)) return;

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
      // If no selection or selection outside editor, append to end
      editorRef.current.focus();
      const newRange = document.createRange();
      newRange.selectNodeContents(editorRef.current);
      newRange.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }

    // Create chip element
    const chip = document.createElement('span');
    chip.setAttribute('data-variable', variable.key);
    chip.setAttribute('contenteditable', 'false');
    chip.className = 'inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium cursor-default';
    chip.innerHTML = `<span>${variable.label}</span>`;

    // Insert chip
    const currentRange = window.getSelection()?.getRangeAt(0);
    if (currentRange) {
      currentRange.deleteContents();
      currentRange.insertNode(chip);

      // Move cursor after chip
      currentRange.setStartAfter(chip);
      currentRange.setEndAfter(chip);
      selection?.removeAllRanges();
      selection?.addRange(currentRange);
    }

    // Update message state
    updateMessageFromEditor();
    editorRef.current?.focus();
  };

  // Helper: Update message state from editor
  const updateMessageFromEditor = () => {
    const msg = getMessageFromEditor();
    setMessage(msg);
  };

  // Helper: Render message with chips in editor
  const renderMessageWithChips = (text: string) => {
    if (!editorRef.current) return;

    let html = text;

    // Replace {{variable}} with chip HTML
    VARIABLES.forEach((variable) => {
      const regex = new RegExp(variable.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const chipHtml = `<span data-variable="${variable.key}" contenteditable="false" class="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium cursor-default"><span>${variable.label}</span></span>`;
      html = html.replace(regex, chipHtml);
    });

    editorRef.current.innerHTML = html || '<br>';
  };

  // Initialize form
  useEffect(() => {
    if (open) {
      if (rule) {
        setName(rule.name);
        setMessage(rule.responseMessage);
        setTimeout(() => renderMessageWithChips(rule.responseMessage), 0);
      } else {
        setName('Welcome Message');
        setMessage(DEFAULT_TEMPLATE);
        setTimeout(() => renderMessageWithChips(DEFAULT_TEMPLATE), 0);
      }
    }
  }, [open, rule]);

  // Handle editor content changes
  const handleEditorInput = () => {
    updateMessageFromEditor();
  };

  // Handle backspace to delete chips
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range && range.collapsed) {
        // Check if cursor is right after a chip
        const cursorNode = range.startContainer;
        const cursorOffset = range.startOffset;

        if (cursorNode.nodeType === Node.TEXT_NODE && cursorOffset === 0) {
          const prevSibling = cursorNode.previousSibling;
          if (prevSibling && (prevSibling as HTMLElement).hasAttribute?.('data-variable')) {
            e.preventDefault();
            prevSibling.remove();
            updateMessageFromEditor();
            return;
          }
        } else if (cursorNode.nodeType === Node.ELEMENT_NODE) {
          const element = cursorNode as HTMLElement;
          const prevChild = element.childNodes[cursorOffset - 1];
          if (prevChild && (prevChild as HTMLElement).hasAttribute?.('data-variable')) {
            e.preventDefault();
            prevChild.remove();
            updateMessageFromEditor();
            return;
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      return;
    }

    const data = {
      name: name.trim(),
      triggerType: 'WELCOME' as const,
      responseMessage: message,
      isActive: true,
      // Priority and delay will be auto-assigned by backend (100, 2s)
    };

    try {
      if (isEdit && rule) {
        await updateRule(rule.id, data);
      } else {
        await createRule(data);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error already handled by hook (toast)
    }
  };

  const handleClose = () => {
    setName('');
    setMessage('');
    onClose();
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleClose}>
      <Drawer.Portal>
        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        {/* Content */}
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'max-h-[92vh] outline-none',
            'flex flex-col'
          )}
          aria-describedby="drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {isEdit ? 'Edit' : 'Create'} Welcome Message
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="drawer-description">
              Buat pesan sambutan otomatis yang akan dikirim saat customer menghubungi bisnis Anda untuk pertama kalinya
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b shrink-0">
            <h2 className="font-semibold text-lg">{isEdit ? 'Edit' : 'Create'} Welcome Message</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Buat pesan sambutan otomatis yang akan dikirim saat customer menghubungi bisnis Anda untuk pertama kalinya
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-4 space-y-6 py-6">
            {/* Auto-assigned Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Auto-assigned by system:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Priority:</strong> 100 (Highest - sent first before other rules)</li>
                    <li>• <strong>Delay:</strong> 2s (Quick response for first contact)</li>
                    <li>• <strong>Trigger:</strong> Customer sends first message via WhatsApp</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Rule Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Rule Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Welcome Message"
                required
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Nama untuk identifikasi rule ini
              </p>
            </div>

            {/* Message Template */}
            <div className="space-y-3">
              <Label htmlFor="message">
                Message Template <span className="text-red-500">*</span>
              </Label>

              {/* Add Variable Buttons */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Tambah Variabel:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {VARIABLES.map((variable) => {
                    const isUsed = hasVariable(variable.key);
                    return (
                      <Button
                        key={variable.key}
                        type="button"
                        variant={isUsed ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => insertVariableChip(variable)}
                        disabled={isUsed}
                        title={isUsed ? `${variable.label} sudah digunakan` : variable.description}
                        className="h-7 text-xs"
                      >
                        {variable.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                onKeyDown={handleEditorKeyDown}
                className="min-h-[250px] p-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background"
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                suppressContentEditableWarning
              />

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Klik variabel di atas untuk menambahkan ke pesan. Variabel akan otomatis diganti dengan data customer saat pesan dikirim.
              </p>
            </div>

            {/* Message Preview */}
            {message && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Preview (Real Data):
                </Label>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                  <pre className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-sans">
                    {message
                      .replace(/\{\{name\}\}/g, sampleData.name)
                      .replace(/\{\{phone\}\}/g, sampleData.phone)}
                  </pre>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  * Preview dengan data real dari order terbaru Anda
                </p>
              </div>
            )}
            </div>

            {/* Footer inside form */}
            <div className="px-4 py-4 border-t bg-background shrink-0 sticky bottom-0">
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name.trim() || !message.trim() || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{isEdit ? 'Update' : 'Create'} Rule</>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Floating Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition-colors z-20"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
