import React, { useEffect, useState } from 'react';
import { getUserCourses } from '../api/userDashboardService';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getUserCourses();
    
    if (result.success) {
      setCourses(result.data || []);
    } else {
      setError(result.message);
      setCourses([]);
    }
    
    setLoading(false);
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.shortDescription?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatProgress = (progress) => {
    if (progress === undefined || progress === null) return '0%';
    return `${Math.round(progress)}%`;
  };

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>My Enrolled Courses</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Continue learning from your enrolled courses</p>
      </div>

      {error && (
        <div style={{ 
          padding:'1rem', 
          marginBottom:'1.5rem',
          background:'rgba(239,68,68,0.1)', 
          border:'1px solid rgba(239,68,68,0.3)',
          borderRadius:12, 
          color:'#DC2626',
          fontFamily:SANS,
          fontSize:'0.9rem'
        }}>
          ⚠️ {error}
          <button 
            onClick={fetchEnrolledCourses}
            style={{
              marginLeft:'1rem',
              padding:'6px 12px',
              background:AMBER,
              color:'#fff',
              border:'none',
              borderRadius:6,
              cursor:'pointer',
              fontSize:'0.8rem'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search enrolled courses..."
        style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:'0.9rem', fontFamily:SANS, color:SLATE, outline:'none', marginBottom:'1.5rem', background:'#fff' }}
        onFocus={e=>e.target.style.borderColor=AMBER} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>
          <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>⏳</div>
          Loading your courses...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📚</div>
          {search ? 'No courses match your search.' : 'You have not enrolled in any courses yet.'}
          {!search && (
            <div style={{ marginTop:'1rem' }}>
              <a href="/courses" style={{ 
                color:AMBER, 
                textDecoration:'underline',
                fontWeight:600
              }}>Browse available courses</a>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
          {filtered.map((c, i) => (
            <div key={c.courseId || i} style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(217,119,6,0.14)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,41,59,0.05)'; }}>
              
              {/* Thumbnail */}
              {c.thumbnailUrl
                ? <img src={c.thumbnailUrl} alt={c.title} style={{ width:'100%', height:160, objectFit:'cover' }} />
                : <div style={{ width:'100%', height:160, background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🎵</div>
              }
              
              <div style={{ padding:'1.25rem' }}>
                {/* Tags */}
                <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                  {c.level && <span style={{ fontSize:'0.7rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.level}</span>}
                  {c.category && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#8B5CF6', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.category}</span>}
                </div>
                
                {/* Title & Description */}
                <h3 style={{ fontFamily:SERIF, fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:6 }}>{c.title}</h3>
                <p style={{ color:MUTED, fontSize:'0.82rem', lineHeight:1.6, fontFamily:SANS, marginBottom:'1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.shortDescription || c.subtitle || 'No description available'}</p>
                
                {/* Progress Bar */}
                {c.enrollment?.progress !== undefined && (
                  <div style={{ marginBottom:'0.75rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:'0.75rem', color:MUTED, fontFamily:SANS }}>Progress</span>
                      <span style={{ fontSize:'0.75rem', color:AMBER, fontWeight:600, fontFamily:SANS }}>{formatProgress(c.enrollment.progress)}</span>
                    </div>
                    <div style={{ width:'100%', height:6, background:'#E2E8F0', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ 
                        width:`${c.enrollment.progress || 0}%`, 
                        height:'100%', 
                        background:`linear-gradient(90deg,${AMBER},#F59E0B)`,
                        borderRadius:3,
                        transition:'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}
                
                {/* Meta Info & Action */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.78rem', color:MUTED, fontFamily:SANS }}>
                    {c.enrollment?.enrolledAt ? `Enrolled ${formatDate(c.enrollment.enrolledAt)}` : `🕐 ${c.duration || 'Self-paced'}`}
                  </span>
                  <button style={{ background:`linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:SANS }}>Continue</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCoursesPage;
