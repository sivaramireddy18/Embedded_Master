import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Award, BookOpen, Code2, Play, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DailyPlan() {
  const state = useApp();
  const [tasks, setTasks] = useState([
    {
      id: 'daily-read',
      type: 'read',
      title: 'Deep Dive: Volatile Keyword',
      desc: 'Read about volatile registers and compiler optimization prevention.',
      xp: 15,
      completed: false,
      details: 'The volatile keyword tells the compiler that the value of a variable may change at any time without any action being taken by the code nearby. This is critical when interfacing with memory-mapped peripheral registers, where hardware changes values asynchronously, or in ISRs.'
    },
    {
      id: 'daily-code',
      type: 'code',
      title: 'Debug: Pointer Offset Arithmetic',
      desc: 'Inspect pointer alignment offsets for structure members.',
      xp: 20,
      completed: false,
      code: `// Point to register address at offset 0x4
uint32_t *reg = (uint32_t *)0x40021000;
reg += 1; // What address does 'reg' point to now?`,
      choices: ['0x40021001', '0x40021004', '0x40021008', '0x40021002'],
      correct: 1,
      userAnswer: null
    },
    {
      id: 'daily-quiz',
      type: 'quiz',
      title: 'Concept Check: Interrupt Vector Table',
      desc: 'Quick MCQ on vector table relocation in bare-metal bootloaders.',
      xp: 15,
      completed: false,
      question: 'Which register in ARM Cortex-M controllers is responsible for relocating the vector table?',
      choices: ['VTOR', 'SCB', 'MSP', 'LR'],
      correct: 0,
      userAnswer: null
    }
  ]);

  const [activeTask, setActiveTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // Save/Load daily task state
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`embedmaster-daily-${today}`);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveTodayState = (updatedTasks) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`embedmaster-daily-${today}`, JSON.stringify(updatedTasks));
  };

  // Timer countdown to midnight
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const completeTask = (taskId, xpReward) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        if (!t.completed && state.completeLesson) {
          // Award XP via AppContext
          state.completeLesson(taskId, xpReward);
        }
        return { ...t, completed: true };
      }
      return t;
    });

    setTasks(updated);
    saveTodayState(updated);
    setActiveTask(null);
  };

  const handleQuizAnswer = (taskId, answerIndex) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const isCorrect = answerIndex === t.correct;
        return { ...t, userAnswer: answerIndex, completed: isCorrect };
      }
      return t;
    });

    setTasks(updated);
    saveTodayState(updated);
    
    const targetTask = updated.find(t => t.id === taskId);
    if (targetTask && targetTask.completed) {
      if (state.completeLesson) {
        state.completeLesson(taskId, targetTask.xp);
      }
      alert("Correct Answer! +XP awarded.");
    } else {
      alert("Incorrect answer. Check your calculation and try again!");
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="slide-up" style={{ maxWidth: '850px', margin: '0 auto', padding: 'var(--space-6)' }}>
      
      {/* Header */}
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Calendar size={28} className="text-accent-cyan" style={{ color: 'var(--accent-cyan)' }} />
            Daily Learning Plan
          </h1>
          <p>Complete 3 bite-sized daily milestones to build consistency.</p>
        </div>
        <div style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid var(--border-color)', padding: 'var(--space-2) var(--space-4)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Clock size={16} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', fontFamily: 'monospace' }}>
            Resets in: <span style={{ color: 'var(--accent-pink)' }}>{timeLeft}</span>
          </span>
        </div>
      </header>

      {/* Progress Card */}
      <div className="glass-card no-hover" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-8)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.02))' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '80px', height: '80px' }}>
            <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="34" 
              stroke="var(--accent-cyan)" 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - progressPercent / 100)}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{completedCount}/3</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Done</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 var(--space-1) 0' }}>Daily Streak Bonus</h3>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            {completedCount === 3 
              ? "Awesome! Today's tasks are complete. See you tomorrow!" 
              : "Finish all tasks today to extend your streak and secure extra XP."}
          </p>
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {tasks.map((task) => (
          <div key={task.id} className={`glass-card ${task.completed ? 'no-hover' : 'interactive'}`} style={{ 
            opacity: task.completed ? 0.75 : 1,
            borderColor: task.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)',
            padding: 'var(--space-5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1 }}>
              <div onClick={() => !task.completed && setActiveTask(task)} style={{ cursor: task.completed ? 'default' : 'pointer' }}>
                {task.completed ? (
                  <CheckCircle2 className="text-emerald-500" style={{ color: 'var(--accent-emerald)' }} />
                ) : (
                  <Circle className="text-gray-500" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-base)', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </h3>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '10px', padding: '2px 8px' }}>
                    +{task.xp} XP
                  </span>
                </div>
                <p style={{ margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                  {task.desc}
                </p>
              </div>
            </div>
            
            {!task.completed && (
              <button onClick={() => setActiveTask(task)} className="btn btn-outline" style={{ padding: 'var(--space-2) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <Play size={12} /> Start
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {activeTask && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 'var(--space-4)' }}>
          <div className="glass-card no-hover" style={{ maxWidth: '600px', width: '100%', padding: 'var(--space-6)', background: '#1f2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                  Daily {activeTask.type}
                </span>
                <h2 style={{ marginTop: 'var(--space-2)' }}>{activeTask.title}</h2>
              </div>
              <button onClick={() => setActiveTask(null)} className="btn btn-ghost" style={{ padding: '4px' }}>✕</button>
            </div>

            {/* Read Task Details */}
            {activeTask.type === 'read' && (
              <div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-4)', borderRadius: '8px', marginBottom: 'var(--space-6)', lineHeight: 1.6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {activeTask.details}
                </div>
                <button onClick={() => completeTask(activeTask.id, activeTask.xp)} className="btn btn-primary" style={{ width: '100%' }}>
                  Mark as Read & Claim +{activeTask.xp} XP
                </button>
              </div>
            )}

            {/* Code / Debug Task */}
            {activeTask.type === 'code' && (
              <div>
                <pre style={{ background: 'black', color: '#10B981', padding: 'var(--space-4)', borderRadius: '8px', fontFamily: 'monospace', fontSize: 'var(--text-sm)', overflowX: 'auto', marginBottom: 'var(--space-4)' }}>
                  <code>{activeTask.code}</code>
                </pre>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  {activeTask.choices.map((choice, index) => (
                    <button 
                      key={index}
                      onClick={() => handleQuizAnswer(activeTask.id, index)}
                      className="btn btn-outline"
                      style={{ textAlign: 'left', display: 'flex', alignItems: 'center', padding: 'var(--space-3)' }}
                    >
                      <span style={{ fontWeight: 'bold', marginRight: 'var(--space-2)', color: 'var(--accent-cyan)' }}>{String.fromCharCode(65 + index)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Concept Check Task */}
            {activeTask.type === 'quiz' && (
              <div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontWeight: '500' }}>
                  {activeTask.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  {activeTask.choices.map((choice, index) => (
                    <button 
                      key={index}
                      onClick={() => handleQuizAnswer(activeTask.id, index)}
                      className="btn btn-outline"
                      style={{ textAlign: 'left', display: 'flex', alignItems: 'center', padding: 'var(--space-3)' }}
                    >
                      <span style={{ fontWeight: 'bold', marginRight: 'var(--space-2)', color: 'var(--accent-pink)' }}>{String.fromCharCode(65 + index)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
