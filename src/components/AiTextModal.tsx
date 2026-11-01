import React, { useState } from 'react';
import { X, Sparkles, Wand2, Check, RefreshCw } from 'lucide-react';
import { AppMode } from '../types';

interface AiTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
  onApplyText: (primaryText: string, secondaryText?: string) => void;
}

export const AiTextModal: React.FC<AiTextModalProps> = ({
  isOpen,
  onClose,
  mode,
  onApplyText,
}) => {
  const [partnerName, setPartnerName] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState(mode === 'quran' ? 'خاشع ومؤثر' : 'شاعري وعاطفي جداً');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode === 'quran' ? 'quran' : 'romantic',
          partnerName,
          topic,
          tone,
        }),
      });

      if (!res.ok) {
        throw new Error('تعذر إنشاء النص بالذكاء الاصطناعي حالياً');
      }

      const data = await res.json();
      setGeneratedText(data.text || '');
    } catch (err: any) {
      console.warn('AI generate fetch fallback:', err);
      // Fallback curated rich phrases if API key is unconfigured
      if (mode === 'quran') {
        setGeneratedText('﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾\nفي ظلمات الحياة، ذكر الله هو النور الذي لا ينطفئ، وسكينة تغمر الروح في كل حين.');
      } else {
        const nameStr = partnerName ? `يا ${partnerName}، ` : '';
        setGeneratedText(`${nameStr}معك أدركت أن الحب ليس مجرد كلمات تُقال، بل حياة تُعاش وأمان يسكن أعماق القلب.\nأنت البداية التي لا تنتهي، والنور الذي يضيء دربي.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedText) return;
    const lines = generatedText.split('\n').filter((l) => l.trim().length > 0);
    const primary = lines.join(' ');
    const secondary = partnerName ? (mode === 'quran' ? `تأمل إيماني لـ ${partnerName}` : `إهداء إلى ${partnerName}`) : undefined;
    onApplyText(primary, secondary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {mode === 'quran' ? 'توليد خواطر وتأملات قرآنية' : 'كتابة كلمات حب وشعر رومانسي'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                باستخدام الذكاء الاصطناعي لصياغة نصوص متحركة راقية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 flex flex-col gap-3.5">
          {mode !== 'quran' && (
            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                اسم الحبيب أو الشريك (اختياري):
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="مثال: حبيبتي مريم، رفيق دربي أحمد..."
                className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              {mode === 'quran' ? 'الموضوع الإيماني:' : 'المناسبة أو طابع المشاعر:'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                mode === 'quran'
                  ? 'مثال: السكينة، تيسير الصعاب، الرضا واليقين، بر الوالدين...'
                  : 'مثال: ذكرى زواج، شوق واعتراف، اعتذار رقيق، رسالة صباحية...'
              }
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              أسلوب الصياغة:
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              {mode === 'quran' ? (
                <>
                  <option value="خاشع ومؤثر">خاشع ومؤثر ومهدئ للقلب</option>
                  <option value="بشارة وأمل">بشارة وتطمين وأمل عظيم</option>
                  <option value="تأمل عميق">تأمل وتدبر عميق في آيات الله</option>
                </>
              ) : (
                <>
                  <option value="شاعري وعاطفي جداً">شاعري وعاطفي جداً بالفصحى</option>
                  <option value="رومانسي دافئ ورقيق">رومانسي دافئ ورقيق</option>
                  <option value="غزل كلاسيكي عذب">غزل كلاسيكي عذب وأنيق</option>
                  <option value="شوق وحنين">شوق وحنين جارف</option>
                </>
              )}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isLoading ? 'جاري الصياغة بالذكاء الاصطناعي...' : 'صياغة النص الآن'}</span>
          </button>

          {/* Generated Text Result */}
          {generatedText && (
            <div className="mt-2 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] font-semibold text-amber-400 mb-1 block">
                النص المولد:
              </span>
              <p className="text-xs text-white leading-relaxed whitespace-pre-line font-medium">
                {generatedText}
              </p>

              <button
                onClick={handleApply}
                className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تطبيق هذا النص في تصميم الفيديو</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
