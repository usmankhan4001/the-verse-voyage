import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileQuestion } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { surahs } from '../data/surahs';
import type { AppState, Quiz, QuizQuestion } from '../data/store';
import { generateId } from '../data/store';
import './Quizzes.css';

interface QuizzesProps {
  state: AppState;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  removeQuiz: (id: string) => void;
}

export default function Quizzes({ state, addQuiz, removeQuiz }: QuizzesProps) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(surahs[0].num);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateId(),
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        answer: '',
      },
    ]);
  };

  const updateQuestion = (idx: number, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map((q, i) => (i === idx ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!quizTitle.trim() || questions.length === 0) return;
    addQuiz({
      surahNum: selectedSurah,
      title: quizTitle.trim(),
      questions,
    });
    setQuizTitle('');
    setQuestions([]);
    setShowBuilder(false);
  };

  const surahName = (num: number) => surahs.find(s => s.num === num)?.name || `Surah ${num}`;

  return (
    <motion.div
      className="quizzes-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="quizzes-page__head">
        <div>
          <h2 className="page-title">Quiz Bank</h2>
          <p className="page-subtitle">{state.quizzes.length} quizzes created</p>
        </div>
        <button className="quizzes-page__add-btn" onClick={() => setShowBuilder(!showBuilder)}>
          <Plus size={16} /> {showBuilder ? 'Cancel' : 'New Quiz'}
        </button>
      </div>

      {/* Quiz Builder */}
      {showBuilder && (
        <Card padding="lg" className="quizzes-page__builder">
          <h3 className="quizzes-page__builder-title">Create Quiz</h3>

          <div className="quizzes-page__builder-row">
            <label>Surah</label>
            <select value={selectedSurah} onChange={e => setSelectedSurah(Number(e.target.value))}>
              {surahs.map(s => (
                <option key={s.num} value={s.num}>
                  {s.num}. {s.name} — {s.arabic}
                </option>
              ))}
            </select>
          </div>

          <div className="quizzes-page__builder-row">
            <label>Quiz Title</label>
            <input
              type="text"
              placeholder="e.g., Post-Surah Quiz: Al-Fatiha"
              value={quizTitle}
              onChange={e => setQuizTitle(e.target.value)}
            />
          </div>

          {questions.map((q, i) => (
            <div key={q.id} className="quizzes-page__question">
              <div className="quizzes-page__question-head">
                <span>Question {i + 1}</span>
                <div className="quizzes-page__question-controls">
                  <select
                    value={q.type}
                    onChange={e => updateQuestion(i, { type: e.target.value as QuizQuestion['type'] })}
                  >
                    <option value="mcq">MCQ</option>
                    <option value="fill_blank">Fill in Blank</option>
                    <option value="reflection">Reflection</option>
                  </select>
                  <button className="quizzes-page__remove-q" onClick={() => removeQuestion(i)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Enter question..."
                value={q.question}
                onChange={e => updateQuestion(i, { question: e.target.value })}
              />

              {q.type === 'mcq' && q.options && (
                <div className="quizzes-page__options">
                  {q.options.map((opt, oi) => (
                    <input
                      key={oi}
                      type="text"
                      placeholder={`Option ${oi + 1}`}
                      value={opt}
                      onChange={e => {
                        const newOpts = [...q.options!];
                        newOpts[oi] = e.target.value;
                        updateQuestion(i, { options: newOpts });
                      }}
                    />
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Correct answer..."
                value={q.answer}
                onChange={e => updateQuestion(i, { answer: e.target.value })}
                className="quizzes-page__answer-input"
              />
            </div>
          ))}

          <div className="quizzes-page__builder-actions">
            <button className="quizzes-page__add-q-btn" onClick={addQuestion}>
              <Plus size={14} /> Add Question
            </button>
            <button className="quizzes-page__save-btn" onClick={handleSave} disabled={!quizTitle.trim() || questions.length === 0}>
              Save Quiz
            </button>
          </div>
        </Card>
      )}

      {/* Quiz List */}
      {state.quizzes.length > 0 ? (
        <div className="quizzes-page__list">
          {state.quizzes.map(quiz => (
            <Card key={quiz.id} padding="md" className="quizzes-page__quiz-card">
              <div className="quizzes-page__quiz-top">
                <div>
                  <h3 className="quizzes-page__quiz-title">{quiz.title}</h3>
                  <p className="quizzes-page__quiz-meta">
                    {surahName(quiz.surahNum)} · {quiz.questions.length} questions · {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="quizzes-page__quiz-delete" onClick={() => removeQuiz(quiz.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="quizzes-page__quiz-tags">
                {quiz.questions.map((q, i) => (
                  <Badge key={i} color={q.type === 'mcq' ? 'blue' : q.type === 'fill_blank' ? 'purple' : 'gold'} size="sm">
                    {q.type === 'mcq' ? 'MCQ' : q.type === 'fill_blank' ? 'Fill Blank' : 'Reflection'}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : !showBuilder ? (
        <div className="quizzes-page__empty">
          <FileQuestion size={48} />
          <h3>No quizzes yet</h3>
          <p>Create your first post-surah quiz.</p>
        </div>
      ) : null}
    </motion.div>
  );
}
