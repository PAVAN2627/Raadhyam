import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS  = "'Lato',system-ui,sans-serif";

const courses = [
  {
    name: 'Vocal Training',
    icon: '🎤',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80',
    tag: 'Most Popular',
    level: 'Beginner → Advanced',
    duration: '3 months+',
    desc: 'Indian Classical, Bollywood & Western vocals with voice modulation and stage performance.',
    details: [
      'Hindustani & Carnatic classical foundations',
      'Bollywood & Western vocal styles',
      'Breathing techniques & voice modulation',
      'Sur, Taal & Raga training',
      'Stage performance & mic technique',
      'Recording & playback sessions',
    ],
  },
  {
    name: 'Guitar',
    icon: '🎸',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending',
    level: 'Beginner → Pro',
    duration: '4 months+',
    desc: 'Acoustic & electric guitar — chords, fingerpicking, scales, and lead techniques.',
    details: [
      'Basic to advanced chord progressions',
      'Fingerpicking & strumming patterns',
      'Lead guitar & soloing techniques',
      'Music reading & tablature',
      'Bollywood, Classical & Western styles',
      'Live performance preparation',
    ],
  },
  {
    name: 'Keyboard & Piano',
    icon: '🎹',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80',
    tag: 'Classic',
    level: 'All Levels',
    duration: '3 months+',
    desc: 'Classical & contemporary piano — chords, scales, sight-reading & composition.',
    details: [
      'Western classical piano foundations',
      'Chords, scales & arpeggios',
      'Sight-reading & music notation',
      'Bollywood & film music arrangements',
      'Improvisation & composition',
      'Trinity / ABRSM exam preparation',
    ],
  },
  {
    name: 'Tabla & Percussion',
    icon: '🥁',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80',
    tag: 'Traditional',
    level: 'Beginner → Advanced',
    duration: '4 months+',
    desc: 'Tabla, Drums, Cajon, Dholak — rhythm cycles, hand techniques & coordination.',
    details: [
      'Tabla bols & taal cycles',
      'Western drum kit fundamentals',
      'Cajon & hand percussion',
      'Dholak for folk & devotional music',
      'Rhythm coordination exercises',
      'Ensemble & accompaniment skills',
    ],
  },
  {
    name: 'Violin',
    icon: '🎻',
    image: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=600&auto=format&fit=crop&q=80',
    tag: 'Classical',
    level: 'Beginner → Advanced',
    duration: '5 months+',
    desc: 'Indian classical & western violin — bowing, ragas, scales and performance.',
    details: [
      'Proper posture & bowing technique',
      'Indian classical ragas on violin',
      'Western scales & classical pieces',
      'Intonation & ear training',
      'Film & fusion violin styles',
      'Stage & orchestra performance',
    ],
  },
  {
    name: 'Flute',
    icon: '🪈',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
    tag: 'Soulful',
    level: 'Beginner → Advanced',
    duration: '3 months+',
    desc: 'Bansuri & western flute — breath control, ragas, notation and melodies.',
    details: [
      'Breath control & embouchure',
      'Bansuri for Indian classical music',
      'Western flute scales & pieces',
      'Raga-based improvisation',
      'Devotional & folk music styles',
      'Performance & recording techniques',
    ],
  },
  {
    name: 'Harmonium',
    icon: '🪗',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    tag: 'Devotional',
    level: 'All Levels',
    duration: '2 months+',
    desc: 'Harmonium for bhajans, classical & devotional music with sur and taal.',
    details: [
      'Sur & swara fundamentals',
      'Bhajan & kirtan accompaniment',
      'Classical raga-based playing',
      'Left hand bellows technique',
      'Taal & rhythm coordination',
      'Devotional & stage performance',
    ],
  },
  {
    name: 'Music Theory',
    icon: '🎼',
    image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=600&auto=format&fit=crop&q=80',
    tag: 'Foundation',
    level: 'All Levels',
    duration: '2 months+',
    desc: 'Notation, harmony, rhythm, scales, chords & composition — beautifully structured.',
    details: [
      'Music notation & sight-reading',
      'Scales, modes & intervals',
      'Chord theory & harmony',
      'Rhythm & time signatures',
      'Composition & arrangement basics',
      'Exam prep: Trinity, ABRSM, Gandharva',
    ],
  },
];

/* ── Course Card ─────────────────────────────────────────────────────────── */
const CourseCard = ({ course, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(course)}
      style={{
        borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hovered ? '0 24px 56px rgba(217,119,6,0.22)' : '0 4px 20px rgba(30,41,59,0.08)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        background: '#fff',
        border: `1px solid ${hovered ? 'rgba(217,119,6,0.4)' : '#E2E8F0'}`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <img src={course.image} alt={course.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(217,119,6,0.75) 0%, transparent 55%)'
            : 'linear-gradient(to top, rgba(30,41,59,0.6) 0%, transparent 55%)',
          transition: 'background 0.4s',
        }} />
        {/* Tag badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'linear-gradient(135deg,#D97706,#B45309)',
          color: '#fff', fontSize: '0.7rem', fontWeight: 800,
          padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em',
          textTransform: 'uppercase', fontFamily: SANS,
        }}>{course.tag}</div>
        {/* Icon */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          fontSize: '2rem',
          transform: hovered ? 'scale(1.2) rotate(-8deg)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}>{course.icon}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{
          fontFamily: SERIF, fontSize: '1.25rem', fontWeight: 700,
          color: '#1E293B', marginBottom: '0.4rem',
        }}>{course.name}</h3>

        <div style={{ display: 'flex', gap: 10, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, color: '#D97706',
            background: 'rgba(217,119,6,0.1)', padding: '3px 10px',
            borderRadius: 20, fontFamily: SANS,
          }}>📊 {course.level}</span>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, color: '#475569',
            background: '#F1F5F9', padding: '3px 10px',
            borderRadius: 20, fontFamily: SANS,
          }}>⏱ {course.duration}</span>
        </div>

        <p style={{
          color: '#64748B', fontSize: '0.85rem', lineHeight: 1.7,
          margin: '0 0 1rem',
        }}>{course.desc}</p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '0.78rem', fontWeight: 700, color: '#D97706',
            letterSpacing: '0.06em', fontFamily: SANS,
            opacity: hovered ? 1 : 0.6,
            transition: 'opacity 0.3s',
          }}>View Details →</span>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: hovered ? 'linear-gradient(135deg,#D97706,#B45309)' : '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', transition: 'background 0.3s',
          }}>
            <span style={{ color: hovered ? '#fff' : '#94A3B8', fontSize: '0.9rem' }}>+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Modal ───────────────────────────────────────────────────────────────── */
const CourseModal = ({ course, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 1rem 1rem',
        animation: 'fadeUp 0.25s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24, overflow: 'hidden',
          maxWidth: 620, width: '100%',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
          animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Image header */}
        <div style={{ position: 'relative', height: 240 }}>
          <img src={course.image} alt={course.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 50%)',
          }} />
          {/* Close btn */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none',
            cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#D97706'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          >✕</button>
          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: 20, left: 24 }}>
            <div style={{
              background: 'linear-gradient(135deg,#D97706,#B45309)',
              color: '#fff', fontSize: '0.7rem', fontWeight: 800,
              padding: '3px 12px', borderRadius: 20, letterSpacing: '0.08em',
              textTransform: 'uppercase', display: 'inline-block', marginBottom: 8,
              fontFamily: SANS,
            }}>{course.tag}</div>
            <h2 style={{
              fontFamily: SERIF, fontSize: '1.9rem', fontWeight: 700,
              color: '#fff', margin: 0,
            }}>{course.icon} {course.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem 2rem 2rem' }}>
          {/* Meta badges */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.78rem', fontWeight: 700, color: '#D97706',
              background: 'rgba(217,119,6,0.1)', padding: '5px 14px',
              borderRadius: 20, fontFamily: SANS,
            }}>📊 {course.level}</span>
            <span style={{
              fontSize: '0.78rem', fontWeight: 700, color: '#475569',
              background: '#F1F5F9', padding: '5px 14px',
              borderRadius: 20, fontFamily: SANS,
            }}>⏱ {course.duration}</span>
            <span style={{
              fontSize: '0.78rem', fontWeight: 700, color: '#059669',
              background: 'rgba(5,150,105,0.1)', padding: '5px 14px',
              borderRadius: 20, fontFamily: SANS,
            }}>✓ Online & Offline</span>
          </div>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {course.desc}
          </p>

          {/* What you'll learn */}
          <div style={{
            background: 'linear-gradient(135deg,#FFF8EE,#FEF3C7)',
            border: '1px solid rgba(217,119,6,0.2)',
            borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.75rem',
          }}>
            <h4 style={{
              fontFamily: SERIF, fontSize: '1.1rem', fontWeight: 700,
              color: '#1E293B', marginBottom: '1rem',
            }}>What You'll Learn</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {course.details.map((d, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  color: '#475569', fontSize: '0.85rem', lineHeight: 1.6,
                }}>
                  <span style={{ color: '#D97706', fontWeight: 700, marginTop: 1 }}>◆</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" style={{ textDecoration: 'none', flex: 1 }}>
              <button style={{
                width: '100%', background: 'linear-gradient(135deg,#D97706,#B45309)',
                color: '#fff', border: 'none', borderRadius: 12,
                padding: '13px', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: SANS, letterSpacing: '0.04em',
                boxShadow: '0 6px 20px rgba(217,119,6,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(217,119,6,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(217,119,6,0.35)'; }}
              >Enroll Now</button>
            </Link>
            <Link to="/Contact-Us" style={{ textDecoration: 'none', flex: 1 }}>
              <button style={{
                width: '100%', background: 'transparent',
                color: '#1E293B', border: '2px solid #1E293B',
                borderRadius: 12, padding: '13px', fontSize: '0.95rem',
                fontWeight: 700, cursor: 'pointer', fontFamily: SANS,
                transition: 'background 0.25s, color 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E293B'; }}
              >Free Enquiry</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────────────────────────── */
const CoursesPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: SANS }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      <NavBarpage />

      {/* Hero banner */}
      <section style={{
        paddingTop: 70, minHeight: '38vh',
        background: 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 50%,#FFFBF5 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(217,119,6,0.12) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle,rgba(217,119,6,0.15) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)',
            color: '#D97706', padding: '5px 16px', borderRadius: 24,
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', marginBottom: '1rem', fontFamily: SANS,
          }}>✦ Our Programs</div>
          <h1 style={{
            fontFamily: SERIF, color: '#1E293B', fontWeight: 700,
            fontSize: 'clamp(2.2rem,5vw,3.2rem)', marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            Music Programs for{' '}
            <span style={{
              background: 'linear-gradient(90deg,#D97706,#F59E0B,#D97706)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
            }}>Every Soul</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: 560, lineHeight: 1.75, margin: '0 auto' }}>
            Structured courses for all ages and skill levels — certified instructors, real-time practice, and personalized feedback. Click any course to explore details.
          </p>
        </div>
      </section>

      {/* Cards grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem',
        }}>
          {courses.map((course, i) => (
            <div key={i} style={{
              animation: `fadeUp 0.6s ease ${i * 80}ms both`,
            }}>
              <CourseCard course={course} onOpen={setSelected} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '1.25rem' }}>
            Not sure which course to pick? We'll help you choose.
          </p>
          <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg,#D97706,#B45309)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px 40px', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: SANS, letterSpacing: '0.04em',
              boxShadow: '0 6px 20px rgba(217,119,6,0.35)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(217,119,6,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(217,119,6,0.35)'; }}
            >Get Free Counselling</button>
          </Link>
        </div>
      </section>

      <FooterPage />

      {/* Modal */}
      {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default CoursesPage;
