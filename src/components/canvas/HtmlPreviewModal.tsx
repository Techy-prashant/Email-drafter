import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Code, Eye, Monitor, Smartphone } from 'lucide-react';
import { Modal } from '../common/Modal';
import { EmailBlock } from '@/types';

interface HtmlPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailTitle: string;
  subject: string;
  preheader: string;
  blocks: EmailBlock[];
  cardColor?: string;
  maxWidth?: number;
}

export const HtmlPreviewModal: React.FC<HtmlPreviewModalProps> = ({
  isOpen,
  onClose,
  emailTitle,
  subject,
  preheader,
  blocks,
  cardColor = '#141417',
  maxWidth = 600,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Helper to map font family expressions to clean email-safe stacks
  const resolveFontStack = (fontFamily?: string) => {
    if (!fontFamily) return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    
    // Convert CSS variable references to actual font names with web-safe fallbacks
    return fontFamily
      .replace(/var\(--font-inter\)/g, "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
      .replace(/var\(--font-playfair\)/g, "'Playfair Display', Georgia, 'Times New Roman', serif")
      .replace(/var\(--font-cinzel\)/g, "'Cinzel', Georgia, serif")
      .replace(/var\(--font-plus-jakarta\)/g, "'Plus Jakarta Sans', -apple-system, sans-serif")
      .replace(/var\(--font-syne\)/g, "'Syne', -apple-system, sans-serif")
      .replace(/var\(--font-caveat\)/g, "'Caveat', cursive, -apple-system, sans-serif")
      .replace(/var\(--font-space-mono\)/g, "'Space Mono', Courier New, monospace")
      .replace(/var\(--font-jetbrains-mono\)/g, "'JetBrains Mono', Courier New, monospace");
  };

  // Generate pure, email-client safe inline HTML
  const generatedHtml = useMemo(() => {
    const blocksHtml = blocks
      .map((block) => {
        const textDeco = [
          block.styles?.underline ? 'underline' : '',
          block.styles?.strikethrough ? 'line-through' : ''
        ].filter(Boolean).join(' ');

        const fontStack = resolveFontStack(block.styles?.fontFamily);
        const commonFont = `font-family: ${fontStack};`;
        const textAlign = block.styles?.align || 'left';
        const letterSpacing = block.styles?.letterSpacing ? `letter-spacing: ${block.styles.letterSpacing};` : '';
        const textTransform = block.styles?.textTransform ? `text-transform: ${block.styles.textTransform};` : '';

        if (block.type === 'header') {
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : '13px';
          const fontWeight = block.styles?.fontWeight || (block.styles?.bold ? '800' : '700');
          const logoUrl = block.content.logoUrl || 'https://raw.githubusercontent.com/Techy-prashant/images_workIITM/refs/heads/main/Namdapha%20logos/Namdapha_bg_colored_rect.png';
          const logoRadius = block.content.logoRadius ?? 14;
          return `
      <!-- Header with Namdapha House Emblem -->
      <tr>
        <td align="${textAlign}" style="padding: ${block.styles?.paddingTop ?? 24}px 24px ${block.styles?.paddingBottom ?? 14}px 24px; ${commonFont} text-align: ${textAlign};">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${textAlign === 'center' ? 'margin: 0 auto;' : textAlign === 'right' ? 'margin-left: auto;' : ''}">
            <tr>
              <td align="center">
                <img src="${logoUrl}" alt="Namdapha House Logo" width="56" height="56" style="display: block; width: 56px; height: 56px; border-radius: ${logoRadius}px; border: 1px solid #27272A; object-fit: cover; margin-bottom: 12px; background-color: #050507;" />
              </td>
            </tr>
          </table>
          <div style="font-size: ${fontSize}; font-weight: ${fontWeight}; ${letterSpacing || 'letter-spacing: 2px;'} color: ${block.styles?.color || '#E4E4E7'}; ${textTransform || 'text-transform: uppercase;'}">
            ${block.content.text || 'NAMDAPHA HOUSE'}
          </div>
          ${block.content.caption ? `<div style="font-size: 11px; letter-spacing: 1px; color: #71717A; text-transform: uppercase; margin-top: 5px;">${block.content.caption}</div>` : ''}
        </td>
      </tr>`;
        }
        if (block.type === 'heading') {
          const defaultSize = block.content.level === 'h3' ? '18px' : block.content.level === 'h2' ? '22px' : '28px';
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : defaultSize;
          const fontWeight = block.styles?.fontWeight || (block.styles?.bold ? '800' : '700');
          return `
      <!-- Heading -->
      <tr>
        <td align="${textAlign}" style="padding: ${block.styles?.paddingTop ?? 10}px 24px ${block.styles?.paddingBottom ?? 12}px 24px; ${commonFont} text-align: ${textAlign};">
          <h1 style="margin: 0; font-size: ${fontSize}; font-weight: ${fontWeight}; font-style: ${block.styles?.italic ? 'italic' : 'normal'}; text-decoration: ${textDeco || 'none'}; color: ${block.styles?.color || '#FAFAFA'}; line-height: 1.28; ${letterSpacing} ${textTransform}">
            ${block.content.text || ''}
          </h1>
        </td>
      </tr>`;
        }
        if (block.type === 'text') {
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : '15px';
          const lineHeight = block.styles?.lineHeight || 1.65;
          const fontWeight = block.styles?.fontWeight || (block.styles?.bold ? '700' : 'normal');
          return `
      <!-- Text -->
      <tr>
        <td align="${textAlign}" style="padding: ${block.styles?.paddingTop ?? 8}px 24px ${block.styles?.paddingBottom ?? 12}px 24px; font-size: ${fontSize}; line-height: ${lineHeight}; color: ${block.styles?.color || '#D4D4D8'}; font-weight: ${fontWeight}; font-style: ${block.styles?.italic ? 'italic' : 'normal'}; text-decoration: ${textDeco || 'none'}; text-align: ${textAlign}; ${letterSpacing} ${textTransform} ${commonFont}">
          ${block.content.html || ''}
        </td>
      </tr>`;
        }
        if (block.type === 'quote') {
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : '14px';
          const bg = block.styles?.backgroundColor || '#1A1A1E';
          const radius = block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '8px';
          return `
      <!-- Quote -->
      <tr>
        <td style="padding: ${block.styles?.paddingTop ?? 10}px 24px ${block.styles?.paddingBottom ?? 14}px 24px; ${commonFont}">
          <div style="background-color: ${bg}; border-left: 3px solid #71717A; border-radius: ${radius}; padding: 16px 20px;">
            <p style="margin: 0; font-size: ${fontSize}; font-style: italic; color: ${block.styles?.color || '#E4E4E7'}; line-height: 1.6;">
              &ldquo;${block.content.quoteText || ''}&rdquo;
            </p>
            ${block.content.quoteAuthor ? `<div style="margin-top: 8px; font-size: 12px; font-weight: 700; color: #A1A1AA;">— ${block.content.quoteAuthor}</div>` : ''}
          </div>
        </td>
      </tr>`;
        }
        if (block.type === 'badge') {
          const radius = block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '9999px';
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : '11px';
          return `
      <!-- Badge -->
      <tr>
        <td align="${textAlign}" style="padding: ${block.styles?.paddingTop ?? 8}px 24px ${block.styles?.paddingBottom ?? 10}px 24px; text-align: ${textAlign}; ${commonFont}">
          <span style="display: inline-block; background-color: ${block.content.badgeBg || '#27272A'}; color: ${block.content.badgeColor || '#E4E4E7'}; padding: 5px 16px; border-radius: ${radius}; font-size: ${fontSize}; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
            ${block.content.badgeText || ''}
          </span>
        </td>
      </tr>`;
        }
        if (block.type === 'image') {
          return `
      <!-- Image Banner -->
      <tr>
        <td align="center" style="padding: ${block.styles?.paddingTop ?? 14}px 24px ${block.styles?.paddingBottom ?? 18}px 24px;">
          ${block.content.src ? `<img src="${block.content.src}" alt="${block.content.alt || 'Banner'}" width="552" style="max-width: 100%; height: auto; display: block; border-radius: 12px; border: 1px solid #27272A;" />` : ''}
          ${block.content.caption ? `<div style="font-size: 11px; color: #71717A; font-style: italic; text-align: center; margin-top: 6px; ${commonFont}">${block.content.caption}</div>` : ''}
        </td>
      </tr>`;
        }
        if (block.type === 'columns') {
          return `
      <!-- 2 Columns -->
      <tr>
        <td style="padding: ${block.styles?.paddingTop ?? 10}px 24px ${block.styles?.paddingBottom ?? 14}px 24px; ${commonFont}">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td width="48%" valign="top" style="background-color: #1A1A1E; border: 1px solid #27272A; border-radius: 10px; padding: 16px;">
                <div style="font-size: 13px; font-weight: 700; color: #FAFAFA; margin-bottom: 6px;">${block.content.col1Title || ''}</div>
                <div style="font-size: 12px; color: #A1A1AA; line-height: 1.55;">${block.content.col1Text || ''}</div>
              </td>
              <td width="4%">&nbsp;</td>
              <td width="48%" valign="top" style="background-color: #1A1A1E; border: 1px solid #27272A; border-radius: 10px; padding: 16px;">
                <div style="font-size: 13px; font-weight: 700; color: #FAFAFA; margin-bottom: 6px;">${block.content.col2Title || ''}</div>
                <div style="font-size: 12px; color: #A1A1AA; line-height: 1.55;">${block.content.col2Text || ''}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
        }
        if (block.type === 'columns3') {
          return `
      <!-- 3 Columns -->
      <tr>
        <td style="padding: ${block.styles?.paddingTop ?? 10}px 24px ${block.styles?.paddingBottom ?? 14}px 24px; ${commonFont}">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td width="31%" valign="top" style="background-color: #1A1A1E; border: 1px solid #27272A; border-radius: 10px; padding: 14px; text-align: center;">
                <div style="font-size: 12px; font-weight: 700; color: #FAFAFA;">${block.content.col1Title || ''}</div>
                <div style="font-size: 11px; color: #A1A1AA; margin-top: 4px; line-height: 1.45;">${block.content.col1Text || ''}</div>
              </td>
              <td width="3%">&nbsp;</td>
              <td width="31%" valign="top" style="background-color: #1A1A1E; border: 1px solid #27272A; border-radius: 10px; padding: 14px; text-align: center;">
                <div style="font-size: 12px; font-weight: 700; color: #FAFAFA;">${block.content.col2Title || ''}</div>
                <div style="font-size: 11px; color: #A1A1AA; margin-top: 4px; line-height: 1.45;">${block.content.col2Text || ''}</div>
              </td>
              <td width="3%">&nbsp;</td>
              <td width="31%" valign="top" style="background-color: #1A1A1E; border: 1px solid #27272A; border-radius: 10px; padding: 14px; text-align: center;">
                <div style="font-size: 12px; font-weight: 700; color: #FAFAFA;">${block.content.col3Title || ''}</div>
                <div style="font-size: 11px; color: #A1A1AA; margin-top: 4px; line-height: 1.45;">${block.content.col3Text || ''}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
        }
        if (block.type === 'button') {
          const radius = block.content.borderRadius !== undefined ? block.content.borderRadius : 8;
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : '13px';
          const fontWeight = block.styles?.fontWeight || (block.styles?.bold ? '700' : '600');
          return `
      <!-- CTA Button -->
      <tr>
        <td align="${textAlign}" style="padding: ${block.styles?.paddingTop ?? 14}px 24px ${block.styles?.paddingBottom ?? 18}px 24px; text-align: ${textAlign}; ${commonFont}">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" ${block.content.fullWidth ? 'width="100%"' : ''} style="${textAlign === 'center' ? 'margin: 0 auto;' : textAlign === 'right' ? 'margin-left: auto;' : ''}">
            <tr>
              <td align="center" bgcolor="${block.content.buttonColor || '#FAFAFA'}" style="border-radius: ${radius}px;">
                <a href="${block.content.url || '#'}" target="_blank" style="display: inline-block; padding: 12px 30px; font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${block.content.textColor || '#09090B'}; text-decoration: none; border-radius: ${radius}px; letter-spacing: 0.5px; ${commonFont}">
                  ${block.content.buttonText || 'Sign Up Now →'}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
        }
        if (block.type === 'callout') {
          const bg = block.styles?.backgroundColor || '#1A1A1E';
          const radius = block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '10px';
          return `
      <!-- Callout -->
      <tr>
        <td style="padding: ${block.styles?.paddingTop ?? 10}px 24px ${block.styles?.paddingBottom ?? 14}px 24px; ${commonFont}">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="background-color: ${bg}; border: 1px solid #3F3F46; border-radius: ${radius}; padding: 16px 20px;">
                <div style="font-size: 13px; font-weight: 700; color: #FAFAFA; margin-bottom: 5px;">
                  ${block.content.calloutTitle || 'Notice'}
                </div>
                <div style="font-size: 12px; color: #D4D4D8; line-height: 1.55;">
                  ${block.content.calloutText || ''}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
        }
        if (block.type === 'social') {
          return `
      <!-- Social Links -->
      <tr>
        <td align="center" style="padding: ${block.styles?.paddingTop ?? 10}px 24px ${block.styles?.paddingBottom ?? 14}px 24px; ${commonFont}">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding: 0 6px;">
                <a href="#" style="text-decoration: none; display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 6px; background-color: #27272A; color: #D4D4D8; font-size: 12px; font-weight: bold;">🌐</a>
              </td>
              <td style="padding: 0 6px;">
                <a href="#" style="text-decoration: none; display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 6px; background-color: #27272A; color: #D4D4D8; font-size: 12px; font-weight: bold;">📢</a>
              </td>
              <td style="padding: 0 6px;">
                <a href="#" style="text-decoration: none; display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 6px; background-color: #27272A; color: #D4D4D8; font-size: 12px; font-weight: bold;">🏛️</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
        }
        if (block.type === 'divider') {
          return `
      <!-- Divider -->
      <tr>
        <td style="padding: ${block.styles?.paddingTop ?? 12}px 24px ${block.styles?.paddingBottom ?? 12}px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="border-top: 1px solid #27272A; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>`;
        }
        if (block.type === 'spacer') {
          return `
      <!-- Spacer -->
      <tr>
        <td height="${block.content.height || 20}" style="font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>`;
        }
        if (block.type === 'footer') {
          const fontSize = block.styles?.fontSize ? `${block.styles.fontSize}px` : '12px';
          return `
      <!-- Footer -->
      <tr>
        <td align="center" style="padding: ${block.styles?.paddingTop ?? 24}px 24px ${block.styles?.paddingBottom ?? 28}px 24px; border-top: 1px solid #27272A; ${commonFont}">
          <div style="font-size: ${fontSize}; font-weight: 700; color: ${block.styles?.color || '#D4D4D8'};">
            ${block.content.organization || 'Namdapha House Secretariat'}
          </div>
          <div style="font-size: 11px; color: #71717A; margin-top: 4px;">
            ${block.content.address || 'Hostel Zone, IIT Madras, Chennai 600036'}
          </div>
          <div style="font-size: 10px; color: #52525B; font-style: italic; margin-top: 8px;">
            ${block.content.unsubscribeNotice || 'Official residential correspondence.'}
          </div>
        </td>
      </tr>`;
        }
        return '';
      })
      .join('\n');

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject || emailTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;600;700&family=Space+Mono&family=Syne:wght@600;700&family=Caveat:wght@600&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Hidden preheader text preview -->
  <div style="display: none; font-size: 1px; color: #09090B; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader || ''}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; table-layout: fixed; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <!-- Email Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${maxWidth}px; background-color: ${cardColor}; border: 1px solid #27272A; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
${blocksHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }, [blocks, cardColor, maxWidth, preheader, subject, emailTitle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${emailTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Production HTML Email Studio"
      subtitle="Pure table-based responsive HTML with inline CSS compatible with Gmail, Apple Mail, Outlook, and web clients"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          {/* Dual Tabs */}
          <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-zinc-200 text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Rendered Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-zinc-200 text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source Code</span>
            </button>
          </div>

          {/* Sub-controls based on active tab */}
          <div className="flex items-center gap-2">
            {activeTab === 'preview' ? (
              <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setPreviewWidth('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    previewWidth === 'desktop'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewWidth('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    previewWidth === 'mobile'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .html</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Rendered Interactive Email Preview */}
        {activeTab === 'preview' && (
          <div className="flex flex-col items-center bg-[#09090B] rounded-2xl border border-zinc-800 p-4 sm:p-6 overflow-hidden">
            <div 
              style={{ width: previewWidth === 'mobile' ? '375px' : '100%', maxWidth: `${maxWidth + 40}px` }}
              className="transition-all duration-200 shadow-2xl rounded-xl border border-zinc-850 overflow-hidden bg-[#09090B]"
            >
              <div className="bg-[#141417] px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="text-[11px] font-mono text-zinc-400">
                  {previewWidth === 'mobile' ? 'Mobile Viewport (375px)' : `Desktop Viewport (${maxWidth}px)`}
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                  Inbox Rendering
                </span>
              </div>
              <iframe
                title="Rendered Email Preview"
                srcDoc={generatedHtml}
                className="w-full h-[520px] bg-[#09090B] border-none custom-scrollbar"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* Tab 2: HTML Source Code Box */}
        {activeTab === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono px-1">
              <span>TABLE-BASED EMAIL HTML (WITH INLINE CSS)</span>
              <span>{blocks.length} BLOCKS RENDERED</span>
            </div>
            <div className="rounded-xl bg-[#09090B] border border-zinc-800 p-4 h-[500px] overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed select-text custom-scrollbar">
              <pre className="whitespace-pre-wrap">{generatedHtml}</pre>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
