import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Code2, AlertTriangle, HelpCircle, Lightbulb, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import BinaryConverter from '../../components/simulators/BinaryConverter';
import MemoryViewer from '../../components/simulators/MemoryViewer';
import BitManipulator from '../../components/simulators/BitManipulator';
import FlowchartViewer from '../../components/simulators/FlowchartViewer';
import CallStackViewer from '../../components/simulators/CallStackViewer';
import ArrayVisualizer from '../../components/simulators/ArrayVisualizer';
import PointerTracer from '../../components/simulators/PointerTracer';
import StructMemoryViewer from '../../components/simulators/StructMemoryViewer';
import HeapVisualizer from '../../components/simulators/HeapVisualizer';

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

const simulatorMap = {
  BinaryConverter,
  MemoryViewer,
  BitManipulator,
  FlowchartViewer,
  CallStackViewer,
  ArrayVisualizer,
  PointerTracer,
  StructMemoryViewer,
  HeapVisualizer,
};

function renderMarkdown(text) {
  if (!text) return null;
  // Simple markdown-to-JSX: headings, bold, code blocks, bullets
  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} style={{ margin: 'var(--space-3) 0' }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3);
      }
      return;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>{line.slice(4)}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-2)' }}>{line.slice(3)}</h3>);
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-2)' }}>{line.slice(2)}</h2>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', paddingLeft: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{formatInline(line.slice(2))}</span>
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 'var(--space-2)' }} />);
    } else {
      elements.push(
        <p key={i} style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-1)' }}>
          {formatInline(line)}
        </p>
      );
    }
  });

  return elements;
}

function formatInline(text) {
  // Handle **bold** and `code` inline
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const codeMatch = remaining.match(/`(.*?)`/);

    let firstMatch = null;
    let matchType = null;

    if (boldMatch && (!codeMatch || boldMatch.index <= codeMatch.index)) {
      firstMatch = boldMatch;
      matchType = 'bold';
    } else if (codeMatch) {
      firstMatch = codeMatch;
      matchType = 'code';
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    if (firstMatch.index > 0) {
      parts.push(remaining.slice(0, firstMatch.index));
    }

    if (matchType === 'bold') {
      parts.push(<strong key={key++} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{firstMatch[1]}</strong>);
    } else {
      parts.push(<code key={key++}>{firstMatch[1]}</code>);
    }

    remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
  }

  return parts;
}

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const state = useApp();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('concept');

  useEffect(() => {
    const loader = moduleMap[moduleId];
    if (loader) {
      loader().then(mod => { setModuleData(mod.module); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  const lesson = useMemo(() => {
    if (!moduleData) return null;
    return moduleData.lessons.find(l => l.id === lessonId);
  }, [moduleData, lessonId]);

  const lessonIndex = useMemo(() => {
    if (!moduleData) return -1;
    return moduleData.lessons.findIndex(l => l.id === lessonId);
  }, [moduleData, lessonId]);

  const prevLesson = moduleData?.lessons[lessonIndex - 1];
  const nextLesson = moduleData?.lessons[lessonIndex + 1];
  const isCompleted = state.completedLessons.includes(lessonId);

  const handleComplete = () => {
    if (!isCompleted) {
      state.completeLesson(lessonId, 25);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-20)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="slide-up">
        <Link to={`/module/${moduleId}`} className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to Module
        </Link>
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <h2>Lesson Not Found</h2>
          <p style={{ marginTop: 'var(--space-2)' }}>This lesson is coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-up">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-tertiary)' }}>Dashboard</Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <Link to={`/module/${moduleId}`} style={{ color: 'var(--text-tertiary)' }}>{moduleData?.title}</Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{lesson.title}</span>
      </div>

      <div className="lesson-layout">
        {/* Main Content */}
        <div className="lesson-content">
          {/* Lesson Header */}
          <div className="content-section" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.03))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lesson {lessonIndex + 1} of {moduleData.lessons.length}
                </span>
                <h2 style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xl)' }}>{lesson.title}</h2>
              </div>
              {isCompleted && (
                <span className="badge badge-success"><CheckCircle2 size={12} /> Completed</span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {['concept', 'examples', 'practice', 'interview'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'concept' && <><BookOpen size={14} /> Concept</>}
                {tab === 'examples' && <><Code2 size={14} /> Examples</>}
                {tab === 'practice' && <><Lightbulb size={14} /> Practice</>}
                {tab === 'interview' && <><HelpCircle size={14} /> Interview</>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'concept' && (
            <div className="content-section">
              <span className="section-badge concept"><BookOpen size={12} /> Concept</span>
              <div>{renderMarkdown(lesson.content)}</div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="content-section">
              <span className="section-badge example"><Code2 size={12} /> Code Examples</span>
              {lesson.codeExamples && lesson.codeExamples.length > 0 ? (
                lesson.codeExamples.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 'var(--space-5)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>{ex.title}</h4>
                    <div className="code-editor-wrapper">
                      <div className="code-editor-header">
                        <span className="file-name">example_{i + 1}.c</span>
                      </div>
                      <pre style={{ margin: 0, borderRadius: 0 }}><code>{ex.code}</code></pre>
                      {ex.output && (
                        <div className="code-output">
                          <span className="output-success">Output: </span>{ex.output}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No code examples available for this lesson yet.</p>
              )}
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="content-section">
              <span className="section-badge task"><Lightbulb size={12} /> Practice</span>
              {lesson.keyPoints && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>Key Points to Remember</h4>
                  {lesson.keyPoints.map((point, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--accent-green)' }}>✓</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{point}</span>
                    </div>
                  ))}
                </div>
              )}
              {lesson.commonMistakes && (
                <div>
                  <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-amber)' }}>
                    <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: 'var(--space-1)' }} />
                    Common Mistakes
                  </h4>
                  {lesson.commonMistakes.map((mistake, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--accent-red)' }}>✗</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{mistake}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Link to="/playground" className="btn btn-primary">
                  <Code2 size={16} /> Open Playground to Practice
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="content-section">
              <span className="section-badge interview"><HelpCircle size={12} /> Interview Questions</span>
              {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 ? (
                lesson.interviewQuestions.map((q, i) => (
                  <InterviewQuestion key={i} index={i} question={q.question} answer={q.answer} />
                ))
              ) : (
                <p>Interview questions coming soon for this topic.</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
            {prevLesson ? (
              <Link to={`/lesson/${moduleId}/${prevLesson.id}`} className="btn btn-secondary">
                <ArrowLeft size={16} /> {prevLesson.title}
              </Link>
            ) : <div />}

            {!isCompleted && (
              <button className="btn btn-primary" onClick={handleComplete}>
                <CheckCircle2 size={16} /> Mark Complete (+25 XP)
              </button>
            )}

            {nextLesson ? (
              <Link to={`/lesson/${moduleId}/${nextLesson.id}`} className="btn btn-primary">
                {nextLesson.title} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to={`/module/${moduleId}`} className="btn btn-secondary">
                Back to Module <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar: Simulator */}
        <div className="lesson-sidebar">
          <div className="glass-card no-hover" style={{ padding: 'var(--space-4)' }}>
            <h4 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              <Eye size={16} style={{ verticalAlign: 'middle', marginRight: 'var(--space-1)' }} />
              Interactive Tool
            </h4>
            {moduleId === 'module-01' && <BinaryConverter />}
            {moduleId === 'module-04' && <BitManipulator />}
            {(moduleId === 'module-05' || moduleId === 'module-06') && <FlowchartViewer />}
            {moduleId === 'module-03' && <MemoryViewer />}
            {moduleId === 'module-07' && <CallStackViewer />}
            {moduleId === 'module-08' && <ArrayVisualizer />}
            {moduleId === 'module-10' && <PointerTracer />}
            {(moduleId === 'module-02' || moduleId === 'module-09') && (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                <Code2 size={32} style={{ opacity: 0.3, marginBottom: 'var(--space-2)' }} />
                <p>Use the Code Playground to practice!</p>
                <Link to="/playground" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-3)' }}>
                  Open Playground
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InterviewQuestion({ index, question, answer }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{
      marginBottom: 'var(--space-4)', padding: 'var(--space-4)',
      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
    }}>
      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
        Q{index + 1}: {question}
      </div>
      {!revealed ? (
        <button className="btn btn-ghost btn-sm" onClick={() => setRevealed(true)}>
          <Eye size={14} /> Reveal Answer
        </button>
      ) : (
        <div className="explanation-box">{answer}</div>
      )}
    </div>
  );
}
