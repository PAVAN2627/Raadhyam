import React, { useEffect, useState } from 'react';
import { getUserCourses, createNote, getNoteById } from '../api/userDashboardService';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserNotesPage = () => {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNoteDetail, setShowNoteDetail] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Form state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getUserCourses();
    
    if (result.success) {
      setCourses(result.data || []);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    if (!selectedCourseId) {
      setSubmitError('Please select a course');
      return;
    }
    
    if (!noteContent.trim()) {
      setSubmitError('Note content is required');
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    const result = await createNote({
      courseId: selectedCourseId,
      content: noteContent.trim(),
      title: noteTitle.trim() || undefined
    });
    
    if (result.success) {
      // Add the new note to local state
      const newNote = {
        ...result.data,
        course: courses.find(c => c.courseId === selectedCourseId)
      };
      setNotes(prev => [newNote, ...prev]);
      
      // Reset form
      setSelectedCourseId('');
      setNoteTitle('');
      setNoteContent('');
      setShowCreateModal(false);
      setSubmitSuccess('Note created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(null), 3000);
    } else {
      setSubmitError(result.message);
    }
    
    setSubmitting(false);
  };

  const handleViewNote = async (noteId) => {
    setLoading(true);
    
    const result = await getNoteById(noteId);
    
    if (result.success) {
      setSelectedNote(result.data);
      setShowNoteDetail(true);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const filteredNotes = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const closeNoteDetail = () => {
    setShowNoteDetail(false);
    setSelectedNote(null);
  };

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>My Notes</h1>
            <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Create and manage notes for your enrolled courses</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            disabled={courses.length === 0}
            style={{ 
              background:`linear-gradient(135deg,${AMBER},#B45309)`,
              color:'#fff',
              border:'none',
              borderRadius:10,
              padding:'10px 20px',
              fontSize:'0.9rem',
              fontWeight:700,
              cursor: courses.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily:SANS,
              opacity: courses.length === 0 ? 0.5 : 1
            }}
          >
            + Create New Note
          </button>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div style={{ 
          padding:'1rem', 
          marginBottom:'1.5rem',
          background:'rgba(34,197,94,0.1)', 
          border:'1px solid rgba(34,197,94,0.3)',
          borderRadius:12, 
          color:'#16A34A',
          fontFamily:SANS,
          fontSize:'0.9rem'
        }}>
          ✓ {submitSuccess}
        </div>
      )}

      {/* Error Message */}
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
            onClick={fetchData}
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

      {/* Search */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search your notes..."
        style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:'0.9rem', fontFamily:SANS, color:SLATE, outline:'none', marginBottom:'1.5rem', background:'#fff' }}
        onFocus={e=>e.target.style.borderColor=AMBER} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />

      {/* Content */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>
          <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>⏳</div>
          Loading...
        </div>
      ) : filteredNotes.length === 0 && notes.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📝</div>
          {courses.length === 0 
            ? 'You need to enroll in courses before creating notes.'
            : 'You haven\'t created any notes yet.'}
          {courses.length > 0 && (
            <div style={{ marginTop:'1.5rem' }}>
              <button 
                onClick={() => setShowCreateModal(true)}
                style={{ 
                  background:`linear-gradient(135deg,${AMBER},#B45309)`,
                  color:'#fff',
                  border:'none',
                  borderRadius:10,
                  padding:'12px 24px',
                  fontSize:'0.9rem',
                  fontWeight:700,
                  cursor:'pointer',
                  fontFamily:SANS
                }}
              >
                Create Your First Note
              </button>
            </div>
          )}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
          No notes match your search.
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' }}>
          {filteredNotes.map((n, i) => (
            <div key={n.id || n._id || i} style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
              onClick={() => handleViewNote(n.id || n._id)}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(217,119,6,0.12)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,41,59,0.05)'; }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:12, background:'rgba(217,119,6,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>📝</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={{ fontFamily:SERIF, fontSize:'1.05rem', fontWeight:700, color:SLATE, marginBottom:4 }}>{n.title}</h3>
                  {n.course?.title && (
                    <span style={{ fontSize:'0.7rem', color:MUTED, fontFamily:SANS }}>📚 {n.course.title}</span>
                  )}
                </div>
              </div>
              {n.content && (
                <p style={{ color:MUTED, fontSize:'0.82rem', lineHeight:1.6, fontFamily:SANS, margin:'1rem 0', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {n.content}
                </p>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1rem', paddingTop:'0.75rem', borderTop:'1px solid #F1F5F9' }}>
                <span style={{ fontSize:'0.75rem', color:MUTED, fontFamily:SANS }}>
                  {n.createdAt ? formatDate(n.createdAt) : ''}
                </span>
                <span style={{ fontSize:'0.75rem', color:AMBER, fontWeight:600, fontFamily:SANS }}>View →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateModal && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000,
          padding:'1rem'
        }}>
          <div style={{
            background:'#fff',
            borderRadius:16,
            padding:'2rem',
            maxWidth:600,
            width:'100%',
            maxHeight:'90vh',
            overflow:'auto'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE }}>Create New Note</h2>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setSubmitError(null);
                  setSelectedCourseId('');
                  setNoteTitle('');
                  setNoteContent('');
                }}
                style={{ background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:MUTED }}
              >
                ×
              </button>
            </div>
            
            {submitError && (
              <div style={{ 
                padding:'0.75rem', 
                marginBottom:'1rem',
                background:'rgba(239,68,68,0.1)', 
                border:'1px solid rgba(239,68,68,0.3)',
                borderRadius:8, 
                color:'#DC2626',
                fontFamily:SANS,
                fontSize:'0.85rem'
              }}>
                ⚠️ {submitError}
              </div>
            )}
            
            <form onSubmit={handleCreateNote}>
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontFamily:SANS, fontSize:'0.9rem', fontWeight:600, color:SLATE, marginBottom:6 }}>
                  Select Course *
                </label>
                <select 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  required
                  style={{ 
                    width:'100%', 
                    padding:'10px 12px', 
                    border:'1.5px solid #E2E8F0', 
                    borderRadius:8, 
                    fontSize:'0.9rem', 
                    fontFamily:SANS, 
                    color:SLATE,
                    outline:'none',
                    background:'#fff'
                  }}
                >
                  <option value="">-- Select a course --</option>
                  {courses.map(c => (
                    <option key={c.courseId} value={c.courseId}>{c.title}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontFamily:SANS, fontSize:'0.9rem', fontWeight:600, color:SLATE, marginBottom:6 }}>
                  Note Title (Optional)
                </label>
                <input 
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  maxLength={200}
                  style={{ 
                    width:'100%', 
                    padding:'10px 12px', 
                    border:'1.5px solid #E2E8F0', 
                    borderRadius:8, 
                    fontSize:'0.9rem', 
                    fontFamily:SANS, 
                    color:SLATE,
                    outline:'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', fontFamily:SANS, fontSize:'0.9rem', fontWeight:600, color:SLATE, marginBottom:6 }}>
                  Note Content *
                </label>
                <textarea 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your notes here..."
                  required
                  rows={8}
                  style={{ 
                    width:'100%', 
                    padding:'10px 12px', 
                    border:'1.5px solid #E2E8F0', 
                    borderRadius:8, 
                    fontSize:'0.9rem', 
                    fontFamily:SANS, 
                    color:SLATE,
                    outline:'none',
                    resize:'vertical',
                    minHeight:150
                  }}
                />
              </div>
              
              <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSubmitError(null);
                  }}
                  style={{ 
                    padding:'10px 20px',
                    background:'transparent',
                    color:SLATE,
                    border:'1.5px solid #E2E8F0',
                    borderRadius:8,
                    fontSize:'0.9rem',
                    fontWeight:600,
                    cursor:'pointer',
                    fontFamily:SANS
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  style={{ 
                    padding:'10px 20px',
                    background:`linear-gradient(135deg,${AMBER},#B45309)`,
                    color:'#fff',
                    border:'none',
                    borderRadius:8,
                    fontSize:'0.9rem',
                    fontWeight:700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontFamily:SANS,
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Creating...' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Detail Modal */}
      {showNoteDetail && selectedNote && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000,
          padding:'1rem'
        }}>
          <div style={{
            background:'#fff',
            borderRadius:16,
            padding:'2rem',
            maxWidth:700,
            width:'100%',
            maxHeight:'90vh',
            overflow:'auto'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
              <div style={{ flex:1 }}>
                <h2 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:6 }}>{selectedNote.title}</h2>
                {selectedNote.course && (
                  <span style={{ fontSize:'0.85rem', color:MUTED, fontFamily:SANS }}>
                    📚 {selectedNote.course.title}
                  </span>
                )}
              </div>
              <button 
                onClick={closeNoteDetail}
                style={{ background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:MUTED }}
              >
                ×
              </button>
            </div>
            
            <div style={{ 
              padding:'1.5rem', 
              background:'#F8FAFC', 
              borderRadius:12, 
              marginBottom:'1.5rem',
              whiteSpace:'pre-wrap',
              fontFamily:SANS,
              fontSize:'0.95rem',
              lineHeight:1.8,
              color:SLATE
            }}>
              {selectedNote.content}
            </div>
            
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'1rem', borderTop:'1px solid #E2E8F0' }}>
              <div style={{ fontSize:'0.8rem', color:MUTED, fontFamily:SANS }}>
                {selectedNote.createdAt && (
                  <span>Created: {formatDate(selectedNote.createdAt)}</span>
                )}
                {selectedNote.updatedAt && selectedNote.updatedAt !== selectedNote.createdAt && (
                  <span style={{ marginLeft:'1rem' }}>Updated: {formatDate(selectedNote.updatedAt)}</span>
                )}
              </div>
              <button 
                onClick={closeNoteDetail}
                style={{ 
                  padding:'8px 16px',
                  background:`linear-gradient(135deg,${AMBER},#B45309)`,
                  color:'#fff',
                  border:'none',
                  borderRadius:8,
                  fontSize:'0.85rem',
                  fontWeight:600,
                  cursor:'pointer',
                  fontFamily:SANS
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotesPage;
