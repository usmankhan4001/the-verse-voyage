import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileQuestion } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
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
    <div className="quizzes-page">
      <div className="quizzes-page__header">
        <div className="quizzes-page__title-area">
          <h2>Quiz Library</h2>
          <p>{state.quizzes.length} Mastered Assessments</p>
        </div>
        <Button 
          variant="primary"
          icon={<Plus size={16} />} 
          onClick={() => setShowBuilder(true)}
        >
          Create Quiz
        </Button>
      </div>

      <AnimatePresence>
        {showBuilder && (
          <motion.div 
            className="quizzes-page__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="quizzes-page__modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="quizzes-page__modal-head">
                <h3>Build Assessment</h3>
                <button className="quizzes-page__modal-close" onClick={() => setShowBuilder(false)}><X size={20} /></button>
              </div>

              <div className="quizzes-page__modal-scroll">
                <div className="quizzes-page__field">
                  <label>Surah Context</label>
                  <select value={selectedSurah} onChange={e => setSelectedSurah(Number(e.target.value))}>
                    {surahs.map(s => (
                      <option key={s.num} value={s.num}>Surah {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="quizzes-page__field">
                  <label>Assessment Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Post-Session Review"
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                  />
                </div>

                <div className="quizzes-page__questions-list">
                  {questions.map((q, i) => (
                    <div key={q.id} className="quizzes-page__q-item">
                      <div className="quizzes-page__q-head">
                        <span>Question {i + 1}</span>
                        <button onClick={() => removeQuestion(i)}><Trash2 size={14} /></button>
                      </div>
                      <input
                        type="text"
                        placeholder="What is the meaning of..."
                        value={q.question}
                        onChange={e => updateQuestion(i, { question: e.target.value })}
                      />
                      {q.type === 'mcq' && q.options && (
                        <div className="quizzes-page__q-options">
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
                        placeholder="Correct Answer"
                        value={q.answer}
                        onChange={e => updateQuestion(i, { answer: e.target.value })}
                        className="quizzes-page__q-ans"
                      />
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" fullWidth onClick={addQuestion} icon={<Plus size={14} />}>
                  Add Question
                </Button>
              </div>

              <div className="quizzes-page__modal-footer">
                <Button variant="ghost" onClick={() => setShowBuilder(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={!quizTitle.trim() || questions.length === 0}>
                  Publish Quiz
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="quizzes-page__grid">
        {state.quizzes.map(quiz => (
          <Card key={quiz.id} padding="md" className="quiz-tile">
            <div className="quiz-tile__head">
              <Badge color="gray">{surahName(quiz.surahNum)}</Badge>
              <button onClick={() => window.confirm('Delete quiz?') && removeQuiz(quiz.id)}><Trash2 size={14} /></button>
            </div>
            <h3 className="quiz-tile__title">{quiz.title}</h3>
            <p className="quiz-tile__meta">{quiz.questions.length} Questions · {new Date(quiz.createdAt).toLocaleDateString()}</p>
          </Card>
        ))}
      </div>

      {state.quizzes.length === 0 && !showBuilder && (
        <div className="quizzes-page__empty">
          <FileQuestion size={48} />
          <h3>No assessments found</h3>
          <p>Create a quiz to test student mastery.</p>
        </div>
      )}
    </div>
  );
}
