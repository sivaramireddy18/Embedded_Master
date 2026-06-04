import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Trophy, Timer, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const moduleMap = {
  'module-01': () => import('../../data/modules/module01-computer-fundamentals.js'),
  'module-02': () => import('../../data/modules/module02-intro-to-c.js'),
  'module-03': () => import('../../data/modules/module03-variables-datatypes.js'),
  'module-04': () => import('../../data/modules/module04-operators.js'),
  'module-05': () => import('../../data/modules/module05-control-statements.js'),
  'module-06': () => import('../../data/modules/module06-loops.js'),
  'module-07': () => import('../../data/modules/module07-functions.js'),
  'module-08': () => import('../../data/modules/module08-arrays.js'),
  'module-09': () => import('../../data/modules/module09-strings.js'),
  'module-10': () => import('../../data/modules/module10-pointers.js'),
};

export default function Assessments() {
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const state = useApp();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableModules, setAvailableModules] = useState([]);

  useEffect(() => {
    if (moduleId && moduleMap[moduleId]) {
      moduleMap[moduleId]().then(mod => {
        if (mod.module?.quiz?.questions) {
          setQuestions(mod.module.quiz.questions);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      // Load all modules' quizzes for selection
      setAvailableModules([
        { id: 'module-01', title: 'Computer Fundamentals', icon: '🖥️' },
        { id: 'module-02', title: 'Introduction to C', icon: '📝' },
        { id: 'module-03', title: 'Variables & Data Types', icon: '📦' },
        { id: 'module-04', title: 'Operators', icon: '⚙️' },
        { id: 'module-05', title: 'Control Statements', icon: '🔀' },
        { id: 'module-06', title: 'Control Flow: Loops', icon: '🔁' },
        { id: 'module-07', title: 'Functions & Scope', icon: '📦' },
        { id: 'module-08', title: 'Arrays & Contiguous Memory', icon: '📚' },
        { id: 'module-09', title: 'Strings & Character Arrays', icon: '🔤' },
        { id: 'module-10', title: 'Pointers & Memory Addresses', icon: '👉' },
      ]);
      setLoading(false);
    }
  }, [moduleId]);

  const handleSelect = (optionIndex) => {
    if (answered) return;
    setSelected(optionIndex);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const q = questions[currentQ];
    const isCorrect = selected === q.correct;
    setAnswered(true);
    setAnswers([...answers, { questionId: q.id, selected, correct: q.correct, isCorrect }]);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      const finalScore = Math.round(((score + (selected === questions[currentQ]?.correct ? 0 : 0)) / questions.length) * 100);
      if (moduleId) {
        state.completeQuiz(moduleId, Math.round((score / questions.length) * 100));
      }
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-20)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  // Module selection view
  if (!moduleId) {
    return (
      <div className="slide-up">
        <div className="page-header">
          <h1><Trophy size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-2)' }} /> Assessments</h1>
          <p>Test your knowledge with module quizzes</p>
        </div>
        <div className="module-grid">
          {availableModules.map(mod => (
            <Link key={mod.id} to={`/assessments?module=${mod.id}`} className="module-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="module-icon">{mod.icon}</div>
                <div>
                  <div className="module-title">{mod.title} Quiz</div>
                  <div className="module-desc">Test your knowledge</div>
                </div>
              </div>
              {state.quizScores[mod.id] !== undefined && (
                <span className="badge badge-success">Best: {state.quizScores[mod.id]}%</span>
              )}
              <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="slide-up quiz-container">
        <Link to="/assessments" className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to Assessments
        </Link>
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <h2>No Quiz Available</h2>
          <p style={{ marginTop: 'var(--space-2)' }}>Quiz questions for this module are coming soon!</p>
        </div>
      </div>
    );
  }

  // Results view
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    return (
      <div className="slide-up quiz-container">
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
          <p style={{ fontSize: 'var(--text-lg)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
            You scored <strong style={{ color: passed ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{score}/{questions.length}</strong> ({percentage}%)
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleRestart}>
              <RotateCcw size={16} /> Retry Quiz
            </button>
            <Link to="/assessments" className="btn btn-primary">
              <Trophy size={16} /> More Quizzes
            </Link>
          </div>

          {/* Answers Review */}
          <div style={{ marginTop: 'var(--space-8)', textAlign: 'left' }}>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Review Answers</h4>
            {answers.map((ans, i) => {
              const q = questions[i];
              return (
                <div key={i} style={{
                  padding: 'var(--space-3)', marginBottom: 'var(--space-2)',
                  background: ans.isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                  borderRadius: 'var(--radius-md)', border: `1px solid ${ans.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                    {ans.isCorrect ? <CheckCircle2 size={14} style={{ color: 'var(--accent-green)', verticalAlign: 'middle' }} /> : <XCircle size={14} style={{ color: 'var(--accent-red)', verticalAlign: 'middle' }} />}
                    {' '}Q{i + 1}: {q.question}
                  </div>
                  {!ans.isCorrect && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      Correct: {q.options[q.correct]}
                    </div>
                  )}
                  {q.explanation && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz view
  const q = questions[currentQ];
  return (
    <div className="slide-up quiz-container">
      <Link to="/assessments" className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)' }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="quiz-progress">
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="progress-text">{currentQ + 1}/{questions.length}</span>
      </div>

      <div className="question-card">
        <div className="question-number">
          Question {currentQ + 1}
          {q.difficulty && <span className={`badge badge-${q.difficulty === 'beginner' ? 'success' : q.difficulty === 'intermediate' ? 'warning' : 'danger'}`} style={{ marginLeft: 'var(--space-2)' }}>{q.difficulty}</span>}
        </div>
        <div className="question-text">{q.question}</div>

        <div className="option-list">
          {q.options.map((option, i) => {
            let className = 'option-item';
            if (answered) {
              if (i === q.correct) className += ' correct';
              else if (i === selected && i !== q.correct) className += ' incorrect';
            } else if (i === selected) {
              className += ' selected';
            }
            return (
              <div key={i} className={className} onClick={() => handleSelect(i)}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: '2px solid currentColor', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-xs)', fontWeight: 700, flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </div>
            );
          })}
        </div>

        {answered && q.explanation && (
          <div className="explanation-box">
            <strong>Explanation:</strong> {q.explanation}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          {!answered ? (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={selected === null}>
              Submit Answer
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>
              {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question'} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
