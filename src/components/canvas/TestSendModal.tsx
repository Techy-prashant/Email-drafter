import React, { useState } from 'react';
import { Send, CheckCircle2, Shield, Info, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';

interface TestSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailTitle: string;
  subject: string;
}

export const TestSendModal: React.FC<TestSendModalProps> = ({
  isOpen,
  onClose,
  emailTitle,
  subject,
}) => {
  const [testEmail, setTestEmail] = useState('council.test@iitm.ac.in');
  const [sampleRecipientName, setSampleRecipientName] = useState('Aditya Sharma');
  const [sampleRoom, setSampleRoom] = useState('312');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setSentSuccess(false);

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        // keep open so user sees confirmation, close after 3s if desired
      }, 2000);
    }, 1200);
  };

  const handleReset = () => {
    setSentSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Send Test Broadcast Preview"
      subtitle="Deliver a test rendition directly to your inbox to check mobile rendering and spam filters"
      maxWidth="lg"
    >
      {sentSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#F7F4EE]">
              Test Email Dispatched!
            </h4>
            <p className="text-xs text-[#B6AD89] mt-1 max-w-sm mx-auto">
              Simulated delivery sent to <span className="text-[#D0A050] font-mono">{testEmail}</span> with token tags replaced by <span className="text-[#F7F4EE] font-medium">{sampleRecipientName} (Room {sampleRoom})</span>.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-[#221B19] hover:bg-[#2C221F] text-[#F7F4EE] text-xs font-medium border border-[#2C221F]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* From / Verified Account Status */}
          <div className="p-3 rounded-xl bg-[#221B19] border border-[#2C221F] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D0A050]" />
              <span className="text-[#B6AD89]">Sender Service:</span>
              <span className="font-semibold text-[#F7F4EE]">council@namdapha.iitm.ac.in</span>
            </div>
            <span className="text-[10px] font-mono text-[#D0A050] bg-[#161312] border border-[#2C221F] px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          {/* Test Email Target */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#B6AD89]">
              Recipient Email for Test
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#221B19] border border-[#2C221F] text-xs font-mono text-[#F7F4EE] focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          {/* Subject Preview */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#B6AD89]">
              Subject Line
            </label>
            <div className="p-2.5 rounded-lg bg-[#221B19] border border-[#2C221F] text-[#F7F4EE] font-medium truncate">
              [TEST] {subject || emailTitle}
            </div>
          </div>

          {/* Dynamic Substitution Preview */}
          <div className="p-2.5 rounded-lg bg-[#221B19] border border-[#2C221F] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#D0A050] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulated Variable Substitutions</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#877246] block mb-0.5">{'{{name}}'}</span>
                <input
                  type="text"
                  value={sampleRecipientName}
                  onChange={(e) => setSampleRecipientName(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#161312] border border-[#2C221F] text-white text-xs"
                />
              </div>
              <div>
                <span className="text-[#877246] block mb-0.5">{'{{room}}'}</span>
                <input
                  type="text"
                  value={sampleRoom}
                  onChange={(e) => setSampleRoom(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#161312] border border-[#2C221F] text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[10px] text-[#7A7060] bg-[#161312] p-2.5 rounded-lg border border-[#2C221F]">
            <Info className="w-3.5 h-3.5 text-[#D0A050] flex-shrink-0 mt-0.5" />
            <span>
              Preview simulation mode: Verifies template rendering and variable substitution without live dispatch.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-[#B6AD89] hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34E2A] text-white font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Simulating...' : 'Send Test'}</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
