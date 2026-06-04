import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Trophy, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Dynamic module loader
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
  'module-11': () => import('../../data/modules/module11-structs-unions.js'),
  'module-12': () => import('../../data/modules/module12-bit-manipulation-advanced.js'),
  'module-13': () => import('../../data/modules/module13-dynamic-memory.js'),
  'module-14': () => import('../../data/modules/module14-preprocessor.js'),
  'module-15': () => import('../../data/modules/module15-embedded-specifics.js'),
};

export default function ModulePage() {
  const { moduleId } = useParams();
  const state = useApp();
  const [moduleData, setModuleData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loader = moduleMap[moduleId];
    if (loader) {
      loader().then(mod => {
        setModuleData(mod.module);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-20)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="slide-up">
        <Link to="/dashboard" className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <h2>Module Not Found</h2>
          <p style={{ marginTop: 'var(--space-2)' }}>This module is coming soon! 🚀</p>
        </div>
      </div>
    );
  }

  const completedCount = moduleData.lessons.filter(l =>
    state.completedLessons.includes(l.id)
  ).length;
  const totalLessons = moduleData.lessons.length;
  const progress = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="slide-up">
      <Link to="/dashboard" className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Module Header */}
      <div className="glass-card no-hover" style={{
        marginBottom: 'var(--space-6)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '2.5rem' }}>{moduleData.icon}</span>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)' }}>{moduleData.title}</h1>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{moduleData.description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            <BookOpen size={16} /> {totalLessons} Lessons
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            <Clock size={16} /> ~{moduleData.estimatedHours || 4} hours
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            <Trophy size={16} /> {completedCount}/{totalLessons} completed
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <h3 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
        <BookOpen size={20} /> Lessons
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {moduleData.lessons.map((lesson, index) => {
          const isCompleted = state.completedLessons.includes(lesson.id);
          return (
            <Link
              key={lesson.id}
              to={`/lesson/${moduleId}/${lesson.id}`}
              className="module-card"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-4)' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                color: isCompleted ? 'var(--accent-green)' : 'var(--text-tertiary)',
                fontWeight: 700, fontSize: 'var(--text-sm)', flexShrink: 0,
              }}>
                {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div className="module-title">{lesson.title}</div>
                {lesson.content && (
                  <div className="module-desc" style={{
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', maxWidth: 500,
                  }}>
                    {typeof lesson.content === 'string'
                      ? lesson.content.replace(/[#*`]/g, '').slice(0, 100)
                      : ''
                    }...
                  </div>
                )}
              </div>
              <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </Link>
          );
        })}
      </div>

      {/* Quiz Section */}
      {moduleData.quiz && moduleData.quiz.questions && moduleData.quiz.questions.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <h3 className="section-title">
            <Trophy size={20} /> Module Quiz
          </h3>
          <Link
            to={`/assessments?module=${moduleId}`}
            className="glass-card interactive"
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              textDecoration: 'none', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-violet)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                Take the Module Quiz
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                {moduleData.quiz.questions.length} questions · Test your knowledge
              </div>
            </div>
            {state.quizScores[moduleId] !== undefined && (
              <span className="badge badge-success">Score: {state.quizScores[moduleId]}%</span>
            )}
            <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
          </Link>
        </div>
      )}
    </div>
  );
}
