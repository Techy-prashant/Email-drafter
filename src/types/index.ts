export type ViewMode = 'home' | 'canvas' | 'tasks' | 'templates' | 'sent';

export type BlockType =
  | 'header'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'columns3'
  | 'callout'
  | 'quote'
  | 'social'
  | 'badge'
  | 'footer';

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: {
    // Header & Heading
    text?: string;
    level?: 'h1' | 'h2' | 'h3';
    logoUrl?: string;
    logoRadius?: number;
    // Text
    html?: string;
    // Image
    src?: string;
    alt?: string;
    aspectRatio?: '16:9' | '3:2' | '1:1' | 'banner';
    caption?: string;
    // Button
    buttonText?: string;
    url?: string;
    buttonColor?: string;
    textColor?: string;
    borderRadius?: number;
    fullWidth?: boolean;
    // Spacer
    height?: number;
    // Divider
    style?: 'solid' | 'dashed' | 'glow';
    // Columns (2-col)
    col1Title?: string;
    col1Text?: string;
    col2Title?: string;
    col2Text?: string;
    // Columns (3-col)
    col3Title?: string;
    col3Text?: string;
    // Callout
    calloutTitle?: string;
    calloutText?: string;
    calloutType?: 'info' | 'important' | 'announcement';
    // Quote / Testimonial
    quoteText?: string;
    quoteAuthor?: string;
    quoteRole?: string;
    // Social Bar
    socialLinks?: { platform: string; url: string }[];
    // Badge / Pill
    badgeText?: string;
    badgeBg?: string;
    badgeColor?: string;
    // Footer
    organization?: string;
    address?: string;
    unsubscribeNotice?: string;
  };
  styles?: {
    align?: 'left' | 'center' | 'right' | 'justify';
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string | number;
    lineHeight?: number;
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    fontFamily?: string;
    letterSpacing?: string | number;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
  };
}

export interface EmailTemplate {
  id: string;
  title: string;
  category: 'event' | 'recruitment' | 'interview' | 'meetup' | 'results' | 'general' | 'announcement' | 'newsletter' | 'emergency' | 'formal';
  description: string;
  author: string;
  updatedAt: string;
  subject: string;
  preheader: string;
  blocks: EmailBlock[];
  thumbnailGradient?: string;
}

export interface EmailDraft {
  id: string;
  title: string;
  subject: string;
  preheader: string;
  status: 'draft' | 'review' | 'ready';
  updatedAt: string;
  blocks: EmailBlock[];
}

export interface Recipient {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  room: string;
  wing: string;
  role: string;
}

export interface TaskItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  description?: string;
}

export interface SentEmailRecord {
  id: string;
  title: string;
  subject: string;
  snippet: string;
  from: string;
  to: string;
  recipientsCount: number;
  sentAt: string;
  timestamp?: string;
  dateStr?: string;
  fullDate?: string;
  status?: 'delivered' | 'processing' | 'scheduled' | 'archived';
  openRate?: number;
  clickRate?: number;
  isStarred?: boolean;
  starred?: boolean;
  read?: boolean;
  category?: 'primary' | 'promotions' | 'social' | 'updates';
  blocks?: EmailBlock[];
  bodyHtml?: string;
}