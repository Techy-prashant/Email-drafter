import React, { useState } from 'react';
import { 
  Send, 
  FileSpreadsheet, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Eye, 
  ShieldCheck, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { EmailDraft, EmailTemplate, Recipient } from '@/types';
import { MOCK_RECIPIENTS } from '@/data/mockData';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface CampaignsViewProps {
  drafts: EmailDraft[];
  templates: EmailTemplate[];
  selectedDraftId?: string;
  onOpenCanvas?: (draft: EmailDraft) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  drafts,
  templates,
  selectedDraftId,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Campaign State
  const [campaignTitle, setCampaignTitle] = useState('Monsoon GBM Term Announcement 2026');
  const [fromName, setFromName] = useState('Namdapha House Council');
  const fromEmail = 'council@namdapha.iitm.ac.in';
  const [replyTo, setReplyTo] = useState('warden.namdapha@iitm.ac.in');
  const [subjectLine, setSubjectLine] = useState('[Namdapha] Notice: Monsoon Term GBM & Cultural Night');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    selectedDraftId || drafts[0]?.id || templates[0]?.id || ''
  );

  // Recipient Data
  const [recipients] = useState<Recipient[]>(MOCK_RECIPIENTS);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(MOCK_RECIPIENTS[0]?.id || '');
  const importedFileName = 'Namdapha_All_Wings_A_to_F_Roster.xlsx';

  // Modal Confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const activeRecipient = recipients.find((r) => r.id === selectedRecipientId) || recipients[0];

  const handleInsertToken = (token: string) => {
    setSubjectLine((prev) => `${prev} {{${token}}}`);
  };

  const handleSimulateTestSend = () => {
    setTestSuccess(true);
    setTimeout(() => {
      setTestSuccess(false);
      setIsTestModalOpen(false);
    }, 2000);
  };

  const handleConfirmBroadcast = () => {
    setIsConfirmModalOpen(false);
    setScheduleSuccess(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Step Progress Stepper */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#181514] border border-[#2C221F] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D0A050]">
              Broadcast Dispatch Workflow
            </span>
            <h2 className="text-lg font-bold text-[#F7F4EE]">
              {campaignTitle || 'New Email Campaign'}
            </h2>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { num: 1, label: 'Content' },
              { num: 2, label: 'Recipients' },
              { num: 3, label: 'Sender' },
              { num: 4, label: 'Verify' },
            ].map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num as 1 | 2 | 3 | 4)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-[#C85A32] text-white shadow-md shadow-black/40'
                      : isPast
                      ? 'bg-[#221B19] text-[#B6AD89] border border-[#2C221F]'
                      : 'bg-transparent text-[#7A7060] border border-[#2C221F]'
                  }`}
                >
                  <span className="font-mono text-[10px]">
                    {isPast ? '✓' : `0${step.num}`}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Banner if Scheduled */}
      {scheduleSuccess && (
        <div className="p-4 rounded-2xl bg-[#221B19] border border-[#2C221F] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#D0A050] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F7F4EE]">
                Broadcast Validated and Staged!
              </h4>
              <p className="text-xs text-[#B6AD89] mt-0.5">
                Campaign &quot;{campaignTitle}&quot; has passed all 854 recipient email syntax checks and template rendering checks. Ready for Phase 2 SMTP transmission.
              </p>
            </div>
          </div>
          <button
            onClick={() => setScheduleSuccess(false)}
            className="text-xs text-[#B6AD89] hover:text-[#F7F4EE]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STEP 1: Select Email Template / Draft */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-[#181514] border border-[#2C221F] space-y-6">
          <div className="border-b border-[#2C221F] pb-4">
            <h3 className="text-sm font-semibold text-[#F7F4EE]">
              Step 1: Campaign Metadata & Email Selection
            </h3>
            <p className="text-xs text-[#B6AD89] mt-0.5">
              Name your broadcast initiative and select an existing email draft or house template.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B6AD89]">
                Campaign Name (Internal Reference)
              </label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#221B19] border border-[#2C221F] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C85A32]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#B6AD89]">
                Choose Email Content Source
              </label>
              <span className="text-[11px] text-[#D0A050]">
                {drafts.length} drafts, {templates.length} templates available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => setSelectedTemplateId(draft.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    selectedTemplateId === draft.id
                      ? 'bg-[#221B19] border-[#C85A32] shadow-lg shadow-black/30 ring-1 ring-[#C85A32]'
                      : 'bg-[#181514] border-[#2C221F] hover:border-[#877246]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="gold" size="sm">DRAFT</Badge>
                    <span className="text-[10px] text-[#B6AD89]">
                      Updated {draft.updatedAt}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#F7F4EE] truncate">
                    {draft.title}
                  </h4>
                  <p className="text-[11px] text-[#B6AD89] truncate mt-1">
                    {draft.subject}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2C221F] flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34E2A] text-white text-xs font-semibold transition-all"
            >
              <span>Next: Recipient Roster</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Recipient Import & Column Mapping */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-[#181514] border border-[#2C221F] space-y-6">
          <div className="border-b border-[#2C221F] pb-4">
            <h3 className="text-sm font-semibold text-[#F7F4EE]">
              Step 2: Excel / CSV Recipient Import & Column Mapping
            </h3>
            <p className="text-xs text-[#B6AD89] mt-0.5">
              Upload resident spreadsheet files or use the verified hostel registry.
            </p>
          </div>

          {/* Upload Dropzone Simulator */}
          <div className="p-6 rounded-2xl bg-[#221B19]/60 border-2 border-dashed border-[#2C221F] hover:border-[#C85A32]/60 transition-colors text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/15 border border-[#C85A32]/30 flex items-center justify-center text-[#D0A050] mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F7F4EE]">
                Current Active File: <span className="text-[#D0A050] font-mono">{importedFileName}</span>
              </p>
              <p className="text-[11px] text-[#B6AD89] mt-1">
                Drag and drop Excel (.xlsx, .xls) or CSV files here to update roster.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#221B19] text-[#B6AD89] border border-[#2C221F] text-[11px]">
              <Check className="w-3.5 h-3.5 text-[#D0A050]" />
              <span>854 valid student email records parsed successfully</span>
            </div>
          </div>

          {/* Mapped Columns Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#B6AD89]">
                Recognized Excel Column Tags for Personalization
              </span>
              <span className="text-[11px] text-[#7A7060] font-mono">
                Click tag in Step 3 to auto-insert
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { tag: 'name', label: 'Student Name', sample: 'Aditya Sharma' },
                { tag: 'rollNo', label: 'Roll Number', sample: 'CS23B042' },
                { tag: 'room', label: 'Room No', sample: '312' },
                { tag: 'wing', label: 'Wing (A-F)', sample: 'Wing C' },
                { tag: 'role', label: 'Academic Program', sample: '3rd Year B.Tech CS' },
              ].map((col) => (
                <div
                  key={col.tag}
                  className="px-3 py-2 rounded-xl bg-[#221B19] border border-[#2C221F] text-xs space-y-0.5"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#D0A050] font-mono text-[11px]">
                      {`{{${col.tag}}}`}
                    </span>
                    <span className="text-[#B6AD89] text-[10px]">({col.label})</span>
                  </div>
                  <div className="text-[10px] text-[#7A7060] truncate">
                    Sample: {col.sample}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Roster Preview Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#B6AD89]">
              Parsed Sample Roster (Showing top 8 records)
            </span>
            <div className="rounded-xl border border-[#2C221F] overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs text-[#B6AD89]">
                  <thead className="bg-[#221B19] text-[11px] uppercase font-mono text-[#D0A050] sticky top-0 border-b border-[#2C221F]">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Room</th>
                      <th className="p-2.5">Wing</th>
                      <th className="p-2.5">Program</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C221F] bg-[#181514]">
                    {recipients.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 font-mono text-[#F7F4EE]/90">{r.rollNo}</td>
                        <td className="p-2.5 font-medium text-[#F7F4EE]">{r.name}</td>
                        <td className="p-2.5 font-mono text-[11px] text-[#B6AD89]">{r.email}</td>
                        <td className="p-2.5 font-mono text-[#D0A050]">{r.room}</td>
                        <td className="p-2.5">{r.wing}</td>
                        <td className="p-2.5 text-[11px]">{r.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2C221F] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#B6AD89] hover:text-[#F7F4EE]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34E2A] text-white text-xs font-semibold"
            >
              <span>Next: Sender & Subject</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Sender & Subject Personalization */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-[#181514] border border-[#2C221F] space-y-6">
          <div className="border-b border-[#2C221F] pb-4">
            <h3 className="text-sm font-semibold text-[#F7F4EE]">
              Step 3: Sender Configuration & Personalized Subject Line
            </h3>
            <p className="text-xs text-[#B6AD89] mt-0.5">
              Verify your authenticated Google sender address and personalize the email subject.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B6AD89]">
                Sender Display Name
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#221B19] border border-[#2C221F] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B6AD89] flex items-center justify-between">
                <span>Sender Google Account</span>
                <span className="text-[10px] text-[#D0A050] font-mono">OAuth2 Verified</span>
              </label>
              <input
                type="email"
                value={fromEmail}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl bg-[#221B19]/60 border border-[#2C221F] text-xs text-[#B6AD89] cursor-not-allowed font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B6AD89]">
                Reply-To Address
              </label>
              <input
                type="email"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#221B19] border border-[#2C221F] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C85A32] font-mono"
              />
            </div>
          </div>

          {/* Subject Line with Token Inserter */}
          <div className="space-y-2 pt-2 border-t border-[#2C221F]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-[#B6AD89]">
                Broadcast Subject Line
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[#B6AD89]">Insert Token:</span>
                {['name', 'room', 'wing'].map((token) => (
                  <button
                    key={token}
                    onClick={() => handleInsertToken(token)}
                    className="px-2 py-0.5 rounded bg-[#221B19] hover:bg-[#C85A32]/20 text-[#D0A050] border border-[#2C221F] font-mono text-[10px] transition-colors"
                  >
                    +{token}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#221B19] border border-[#2C221F] text-xs text-[#F7F4EE] focus:outline-none focus:border-[#C85A32]"
            />

            {/* Live Subject Preview */}
            <div className="p-3 rounded-xl bg-[#221B19] border border-[#2C221F] text-xs text-[#B6AD89] flex items-center gap-2">
              <span className="text-[#D0A050] font-semibold text-[11px]">Inbox Preview:</span>
              <span className="text-[#F7F4EE] font-medium">
                {subjectLine
                  .replace(/\{\{name\}\}/g, activeRecipient.name)
                  .replace(/\{\{room\}\}/g, activeRecipient.room)
                  .replace(/\{\{wing\}\}/g, activeRecipient.wing)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2C221F] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#B6AD89] hover:text-[#F7F4EE]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34E2A] text-white text-xs font-semibold"
            >
              <span>Next: Review & Test Dispatch</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Final Verification, Personalization Test & Confirmation */}
      {currentStep === 4 && (
        <div className="p-6 rounded-2xl bg-[#181514] border border-[#2C221F] space-y-6">
          <div className="border-b border-[#2C221F] pb-4">
            <h3 className="text-sm font-semibold text-[#F7F4EE]">
              Step 4: Review, Personalization Simulation & Dispatch
            </h3>
            <p className="text-xs text-[#B6AD89] mt-0.5">
              Select any resident to preview how the final email will render with their personalized variables.
            </p>
          </div>

          {/* Recipient Switcher for Live Test */}
          <div className="p-4 rounded-xl bg-[#221B19] border border-[#2C221F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C85A32]/15 border border-[#C85A32]/30 flex items-center justify-center text-[#D0A050]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#B6AD89] uppercase font-mono block">
                  Simulating View For
                </span>
                <span className="text-xs font-bold text-[#F7F4EE]">
                  {activeRecipient.name} ({activeRecipient.rollNo})
                </span>
                <span className="text-[11px] text-[#D0A050] block">
                  Room {activeRecipient.room}, Wing {activeRecipient.wing}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B6AD89]">Switch Resident:</span>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#181514] border border-[#2C221F] text-xs text-[#F7F4EE] focus:outline-none"
              >
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (Room {r.room})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campaign Summary Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#221B19] border border-[#2C221F] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#B6AD89]">Total Audience</span>
              <div className="text-base font-bold text-[#F7F4EE]">854 Residents</div>
              <span className="text-[11px] text-[#D0A050]">All Wings A to F</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#221B19] border border-[#2C221F] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#B6AD89]">Verified Sender</span>
              <div className="text-base font-bold text-[#F7F4EE] truncate">{fromName}</div>
              <span className="text-[11px] text-[#D0A050] font-mono">{fromEmail}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#221B19] border border-[#2C221F] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#B6AD89]">HTML Engine</span>
              <div className="text-base font-bold text-[#F7F4EE]">MJML / Table V2</div>
              <span className="text-[11px] text-[#D0A050]">Zero syntax errors</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#2C221F] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#B6AD89] hover:text-[#F7F4EE]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTestModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#221B19] hover:bg-[#2C221F] text-[#F7F4EE] text-xs font-medium border border-[#2C221F]"
              >
                <Eye className="w-3.5 h-3.5 text-[#D0A050]" />
                <span>Send Test Preview</span>
              </button>

              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34E2A] text-white text-xs font-semibold shadow-lg shadow-black/40 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Confirm & Stage Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Broadcast Dispatch"
        subtitle="Final verification before staging delivery queue"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#221B19] border border-[#2C221F] space-y-2">
            <div className="flex items-center gap-2 text-[#D0A050] font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Ready for Staging</span>
            </div>
            <p className="text-[11px] text-[#B6AD89] leading-relaxed">
              You are staging <strong className="text-white">{campaignTitle}</strong> for <strong>854 residents</strong> from sender <code className="text-[#D0A050] font-mono">{fromEmail}</code>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#221B19] border border-[#2C221F] space-y-1.5 text-[11px] text-[#B6AD89]">
            <div className="flex items-center gap-1.5 text-[#D0A050] font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Phase 1 Sandbox Notice</span>
            </div>
            <p>
              In this UI foundation phase, clicking Confirm validates all templates and marks the campaign as ready. Live transmission via Gmail API occurs in Phase 2.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 rounded-xl text-[#B6AD89] hover:text-[#F7F4EE]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBroadcast}
              className="px-5 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B34E2A] text-white font-semibold shadow-md"
            >
              Confirm Broadcast
            </button>
          </div>
        </div>
      </Modal>

      {/* Test Send Modal */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Send Test Dispatch"
        subtitle="Simulate sending to personal inbox"
        maxWidth="sm"
      >
        {testSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#D0A050] mx-auto" />
            <h4 className="text-sm font-semibold text-[#F7F4EE]">Test Broadcast Sent!</h4>
            <p className="text-xs text-[#B6AD89]">Simulated dispatch delivered to council.test@iitm.ac.in</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] text-[#B6AD89]">Target Email</label>
              <input
                type="email"
                defaultValue="council.test@iitm.ac.in"
                className="w-full px-3 py-2 rounded-lg bg-[#221B19] border border-[#2C221F] text-[#F7F4EE] font-mono focus:outline-none focus:border-[#C85A32]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-3 py-1.5 text-[#B6AD89] hover:text-[#F7F4EE]"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateTestSend}
                className="px-4 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34E2A] text-white font-semibold"
              >
                Send Test
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
