import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  Filter,
  GraduationCap,
  Info,
  ExternalLink
} from 'lucide-react';
import { QUESTIONS } from './data/questions';
import { Question, Difficulty, GrammarPoint, UserAnswer } from './types';

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<GrammarPoint | 'All'>('All');

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter(q => {
      const diffMatch = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const catMatch = categoryFilter === 'All' || q.category === categoryFilter;
      return diffMatch && catMatch;
    });
  }, [difficultyFilter, categoryFilter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnswers([]);
    setQuizFinished(false);
  };

  const score = answers.filter(a => a.isCorrect).length;

  const getEncouragement = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio === 1) return "太棒了！你是语法大师！🌟";
    if (ratio >= 0.8) return "做得好！你对这些规则掌握得很扎实。👏";
    if (ratio >= 0.5) return "继续努力！多加练习会更进步。💪";
    return "加油！每一次错误都是通往掌握的一步。📚";
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4">
          <Filter className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-semibold text-slate-800">未找到题目</h2>
          <p className="text-slate-500">尝试调整筛选条件以查找更多练习。</p>
          <button 
            onClick={() => { setDifficultyFilter('All'); setCategoryFilter('All'); }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            清除筛选
          </button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6 border border-slate-100"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">练习完成！</h2>
            <p className="text-slate-500 text-lg">
              你的得分是 <span className="font-bold text-indigo-600">{score}</span> / <span className="font-bold">{filteredQuestions.length}</span>
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-700 font-medium italic">
              "{getEncouragement(score, filteredQuestions.length)}"
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider text-left">推荐复习</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                <span className="text-slate-700 text-sm font-medium">高级从句结构</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                <span className="text-slate-700 text-sm font-medium">非谓语动词指南</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </a>
            </div>
          </div>

          <button 
            onClick={resetQuiz}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <RotateCcw className="w-5 h-5" />
            再试一次
          </button>
        </motion.div>
      </div>
    );
  }

  const sentenceParts = currentQuestion.sentence.split('{{blank}}');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">语法闯关 (GrammarQuest)</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">互动练习系统</p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <select 
              value={difficultyFilter} 
              onChange={(e) => { setDifficultyFilter(e.target.value as any); setCurrentQuestionIndex(0); setAnswers([]); }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">所有难度</option>
              <option value={Difficulty.Beginner}>初级</option>
              <option value={Difficulty.Intermediate}>中级</option>
              <option value={Difficulty.Advanced}>高级</option>
            </select>
            <select 
              value={categoryFilter} 
              onChange={(e) => { setCategoryFilter(e.target.value as any); setCurrentQuestionIndex(0); setAnswers([]); }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">所有知识点</option>
              <option value={GrammarPoint.NonFiniteVerbs}>非谓语动词</option>
              <option value={GrammarPoint.RelativeClauses}>定语从句</option>
              <option value={GrammarPoint.Conjunctions}>连词</option>
              <option value={GrammarPoint.Tenses}>时态</option>
              <option value={GrammarPoint.Conditionals}>虚拟语气</option>
              <option value={GrammarPoint.Prepositions}>介词</option>
            </select>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>第 {currentQuestionIndex + 1} 题，共 {filteredQuestions.length} 题</span>
            <span>已完成 {Math.round(((currentQuestionIndex + 1) / filteredQuestions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
              className="h-full bg-indigo-600"
            />
          </div>
        </div>

        {/* Question Area */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 min-h-[300px] flex flex-col justify-center relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 blur-3xl" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    currentQuestion.difficulty === Difficulty.Beginner ? 'bg-emerald-100 text-emerald-700' :
                    currentQuestion.difficulty === Difficulty.Intermediate ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {currentQuestion.difficulty === Difficulty.Beginner ? '初级' : 
                     currentQuestion.difficulty === Difficulty.Intermediate ? '中级' : '高级'}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {currentQuestion.category === GrammarPoint.NonFiniteVerbs ? '非谓语动词' :
                     currentQuestion.category === GrammarPoint.RelativeClauses ? '定语从句' :
                     currentQuestion.category === GrammarPoint.Conjunctions ? '连词' :
                     currentQuestion.category === GrammarPoint.Tenses ? '时态' :
                     currentQuestion.category === GrammarPoint.Conditionals ? '虚拟语气' : '介词'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-medium leading-relaxed text-slate-800">
                  {sentenceParts[0]}
                  <span className={`inline-flex items-center justify-center min-w-[120px] px-4 py-1 mx-2 border-b-4 transition-all duration-300 ${
                    showExplanation 
                      ? (selectedOption === currentQuestion.correctAnswer ? 'border-emerald-500 text-emerald-600 font-bold' : 'border-rose-500 text-rose-600 font-bold')
                      : 'border-indigo-200 text-indigo-600 font-medium'
                  }`}>
                    {selectedOption || '_______'}
                  </span>
                  {sentenceParts[1]}
                </h2>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      disabled={showExplanation}
                      className={`py-4 px-6 rounded-2xl text-lg font-medium transition-all duration-200 border-2 ${
                        selectedOption === option
                          ? (showExplanation 
                              ? (option === currentQuestion.correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700')
                              : 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md shadow-indigo-100')
                          : (showExplanation && option === currentQuestion.correctAnswer
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50')
                      } ${showExplanation ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  {!showExplanation ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedOption}
                      className={`px-8 py-3 rounded-xl font-bold transition-all ${
                        selectedOption 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      提交答案
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      {currentQuestionIndex === filteredQuestions.length - 1 ? '完成练习' : '下一题'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Explanation Sidebar */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {showExplanation ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full space-y-6"
                >
                  <div className="flex items-center gap-3">
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <XCircle className="text-rose-600 w-6 h-6" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold">
                      {selectedOption === currentQuestion.correctAnswer ? '回答正确！' : '回答错误'}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <section className="space-y-2">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <BookOpen className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">语法规则</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {currentQuestion.explanation.rule}
                      </p>
                    </section>

                    <section className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">例句</h4>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 italic text-emerald-800">
                        "{currentQuestion.explanation.example}"
                      </div>
                    </section>

                    <section className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-600">
                        <XCircle className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">常见错误</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {currentQuestion.explanation.commonMistake}
                      </p>
                    </section>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
                  <Info className="w-12 h-12 text-slate-300" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-400">详解卡片</h3>
                    <p className="text-sm text-slate-400 max-w-[200px]">
                      提交答案后，这里将显示详细的语法规则和例句。
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
