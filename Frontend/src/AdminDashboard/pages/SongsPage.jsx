import { useState, useEffect, useCallback } from 'react';
import { 
  Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, SkeletonRows, 
  Pagination, Badge, RowActions, Cover, Modal, FormGrid, Input, Select, 
  Textarea, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL,
  Alert 
} from '../components/UI';
import { 
  getAllMusic, 
  getMusicById, 
  createMusic, 
  deleteMusic,
  formatDuration 
} from '../../api/musicService';

/**
 * SongsPage - Music management page for admin dashboard
 * 
 * Connects to backend music API:
 * - GET /api/music - List all music
 * - GET /api/music/:id - Get single music item
 * - POST /api/music - Create new music (admin, requires auth)
 * - DELETE /api/music/:id - Delete music (admin, requires auth)
 * 
 * Note: File upload is handled separately via /api/upload endpoint.
 * The create flow expects a pre-uploaded file URL to be passed in.
 */

const HEADERS = ['Song', 'Artist', 'Album', 'Genre', 'Duration', 'Status', 'Actions'];

// Helper to map status values to Badge-compatible format
const mapStatus = (status) => {
  if (!status) return 'Active';
  const s = status.toLowerCase();
  if (s === 'inactive') return 'Inactive';
  if (s === 'draft') return 'Draft';
  return 'Active';
};

/**
 * SongForm - Modal form for creating/editing/viewing songs
 * 
 * @param {string} mode - 'add' | 'edit' | 'view'
 * @param {Object} song - Song data for edit/view mode
 * @param {Function} onClose - Close handler
 * @param {Function} onSubmit - Submit handler for create/update
 * @param {boolean} loading - Loading state for submit
 */
const SongForm = ({ mode, song, onClose, onSubmit, loading }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: '',
    language: '',
    status: 'Active',
    releaseDate: '',
    description: '',
    // NOTE: fileUrl and thumbnailUrl will be populated after file upload integration
    // For now, these fields are prepared but not connected to upload
    fileUrl: '',
    thumbnailUrl: '',
    publicId: ''
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});

  // Initialize form data for edit/view mode
  useEffect(() => {
    if (mode === 'edit' && song) {
      setFormData({
        title: song.title || '',
        artist: song.artist || '',
        album: song.album || '',
        genre: song.genre || '',
        duration: song.duration ? String(song.duration) : '',
        language: song.language || '',
        status: song.status || 'Active',
        releaseDate: song.releaseDate ? song.releaseDate.split('T')[0] : '',
        description: song.description || '',
        fileUrl: song.fileUrl || '',
        thumbnailUrl: song.thumbnailUrl || '',
        publicId: song.publicId || ''
      });
    } else if (mode === 'view' && song) {
      setFormData({
        title: song.title || '',
        artist: song.artist || '',
        album: song.album || '',
        genre: song.genre || '',
        duration: song.duration ? String(song.duration) : '',
        language: song.language || '',
        status: song.status || 'Active',
        releaseDate: song.releaseDate ? song.releaseDate.split('T')[0] : '',
        description: song.description || '',
        fileUrl: song.fileUrl || '',
        thumbnailUrl: song.thumbnailUrl || '',
        publicId: song.publicId || ''
      });
    }
  }, [mode, song]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist.trim()) newErrors.artist = 'Artist is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    // fileUrl will be required after upload integration
    // For now, we allow creation without it for testing purposes
    // if (!formData.fileUrl.trim()) newErrors.fileUrl = 'Audio file is required';
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare data for API
    const musicData = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim() || undefined,
      genre: formData.genre.trim(),
      duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
      language: formData.language || undefined,
      status: formData.status,
      releaseDate: formData.releaseDate || undefined,
      description: formData.description.trim() || undefined,
      // These will be populated after upload integration:
      fileUrl: formData.fileUrl || undefined,
      thumbnailUrl: formData.thumbnailUrl || undefined,
      publicId: formData.publicId || undefined
    };

    // Remove undefined values
    Object.keys(musicData).forEach(key => {
      if (musicData[key] === undefined) delete musicData[key];
    });

    onSubmit(musicData, mode === 'edit' ? song._id : null);
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'add' ? 'Add New Song' : mode === 'edit' ? 'Edit Song' : 'Song Details';

  return (
    <Modal title={title} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <div>
            <Input 
              label="Song Title" 
              placeholder="e.g. Midnight Echoes" 
              required 
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={isReadOnly}
            />
            {errors.title && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{errors.title}</span>}
          </div>
          <div>
            <Input 
              label="Artist Name" 
              placeholder="e.g. Luna Ray" 
              required 
              value={formData.artist}
              onChange={(e) => handleChange('artist', e.target.value)}
              disabled={isReadOnly}
            />
            {errors.artist && <span style={{ color: '#EF4444', fontSize: '0.72rem' }}>{errors.artist}</span>}
          </div>
        </FormGrid>
        
        <FormGrid>
          <Input 
            label="Album" 
            placeholder="e.g. Neon Dreams" 
            value={formData.album}
            onChange={(e) => handleChange('album', e.target.value)}
            disabled={isReadOnly}
          />
          <Select 
            label="Genre" 
            options={['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Indie', 'Synthwave', 'Folk', 'Other']}
            required
            value={formData.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            disabled={isReadOnly}
          />
        </FormGrid>
        
        <FormGrid>
          <Input 
            label="Duration (seconds)" 
            placeholder="e.g. 225 for 3:45" 
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            disabled={isReadOnly}
          />
          <Select 
            label="Language" 
            options={['English', 'Hindi', 'Spanish', 'French', 'Japanese', 'Korean', 'German', 'Other']}
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            disabled={isReadOnly}
          />
        </FormGrid>
        
        <FormGrid>
          <Select 
            label="Status" 
            options={['Active', 'Inactive', 'Draft']}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={isReadOnly}
          />
          <Input 
            label="Release Date" 
            type="date" 
            value={formData.releaseDate}
            onChange={(e) => handleChange('releaseDate', e.target.value)}
            disabled={isReadOnly}
          />
        </FormGrid>

        <Textarea 
          label="Description" 
          placeholder="Short description of the song..." 
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          disabled={isReadOnly}
        />

        {/* 
          FILE UPLOAD SECTION - Prepared for upload integration
          Currently shows placeholder boxes. After upload integration:
          - Replace UploadBox with actual upload component
          - On successful upload, set formData.fileUrl and formData.publicId
        */}
        <div style={{ 
          background: '#FFF8E1', 
          border: '1px dashed #FFC107', 
          borderRadius: 10, 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontSize: '0.82rem', color: '#92400E', margin: '0 0 0.5rem', fontWeight: 600 }}>
            🎵 Audio File (Upload Integration Pending)
          </p>
          <p style={{ fontSize: '0.72rem', color: '#92400E', margin: 0 }}>
            {formData.fileUrl 
              ? `Uploaded: ${formData.fileUrl}` 
              : 'File upload will be handled via /api/upload endpoint. This field is prepared to receive the uploaded file URL.'
            }
          </p>
          {!isReadOnly && !formData.fileUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <Input 
                label="Audio File URL (Temporary)" 
                placeholder="Enter pre-uploaded file URL for testing"
                value={formData.fileUrl}
                onChange={(e) => handleChange('fileUrl', e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={{ 
          background: '#EFF6FF', 
          border: '1px dashed #3B82F6', 
          borderRadius: 10, 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontSize: '0.82rem', color: '#1E40AF', margin: '0 0 0.5rem', fontWeight: 600 }}>
            🖼️ Cover Image (Upload Integration Pending)
          </p>
          <p style={{ fontSize: '0.72rem', color: '#1E40AF', margin: 0 }}>
            {formData.thumbnailUrl 
              ? `Uploaded: ${formData.thumbnailUrl}` 
              : 'Cover image upload will be handled via /api/upload endpoint.'
            }
          </p>
          {!isReadOnly && !formData.thumbnailUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <Input 
                label="Cover Image URL (Temporary)" 
                placeholder="Enter pre-uploaded image URL for testing"
                value={formData.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              />
            </div>
          )}
        </div>

        {!isReadOnly && (
          <FormActions 
            submitLabel={loading ? 'Saving...' : mode === 'edit' ? 'Update Song' : 'Save Song'}
            onCancel={onClose}
            disabled={loading}
          />
        )}
        {isReadOnly && (
          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: `1px solid ${BORDER}` }}>
            <OutlineBtn onClick={onClose}>Close</OutlineBtn>
          </div>
        )}
      </form>
      <style>{`
        .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
        @media(max-width: 540px) { .form-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </Modal>
  );
};

/**
 * ConfirmDeleteModal - Confirmation dialog for delete operations
 */
const ConfirmDeleteModal = ({ song, onConfirm, onCancel, loading }) => (
  <Modal title="Confirm Delete" onClose={onCancel}>
    <p style={{ fontFamily: SANS, marginBottom: '1rem' }}>
      Are you sure you want to delete <strong>"{song?.title}"</strong>? This action cannot be undone.
    </p>
    <FormActions 
      submitLabel={loading ? 'Deleting...' : 'Delete Song'}
      onCancel={onCancel}
      disabled={loading}
    />
  </Modal>
);

const SongsPage = () => {
  // Data state
  const [songs, setSongs] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Modal state
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selectedSong, setSelectedSong] = useState(null);
  const [deleteConfirmSong, setDeleteConfirmSong] = useState(null);
  
  // Form state
  const [formLoading, setFormLoading] = useState(false);
  
  // Filter/search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  /**
   * Fetch all music from the API
   */
  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllMusic({
        page: pagination.currentPage,
        limit: 20
      });
      
      if (result.success) {
        setSongs(result.data || []);
        setPagination(result.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
      } else {
        setError(result.message || 'Failed to load songs');
        setSongs([]);
      }
    } catch (err) {
      setError('An unexpected error occurred while loading songs');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage]);

  // Initial fetch
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  /**
   * Handle view song
   */
  const handleView = async (song) => {
    setSelectedSong(song);
    setModal('view');
  };

  /**
   * Handle edit song - fetch latest data before opening
   */
  const handleEdit = async (song) => {
    try {
      const result = await getMusicById(song._id);
      if (result.success) {
        setSelectedSong(result.data);
      } else {
        setSelectedSong(song); // Fallback to passed song
      }
    } catch {
      setSelectedSong(song); // Fallback to passed song
    }
    setModal('edit');
  };

  /**
   * Handle delete song - show confirmation
   */
  const handleDeleteClick = (song) => {
    setDeleteConfirmSong(song);
  };

  /**
   * Confirm and execute delete
   */
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmSong) return;
    
    setFormLoading(true);
    
    try {
      const result = await deleteMusic(deleteConfirmSong._id);
      
      if (result.success) {
        setSuccessMessage(`"${deleteConfirmSong.title}" has been deleted successfully`);
        setDeleteConfirmSong(null);
        // Refresh the list
        fetchSongs();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || 'Failed to delete song');
      }
    } catch {
      setError('An unexpected error occurred while deleting the song');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle create/update song
   */
  const handleSubmit = async (formData, editId) => {
    setFormLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (editId) {
        // Update existing song (not implemented in backend, but prepared)
        result = { success: false, message: 'Update functionality not yet implemented' };
      } else {
        // Create new song
        result = await createMusic(formData);
      }
      
      if (result.success) {
        setSuccessMessage(editId 
          ? 'Song updated successfully' 
          : `"${formData.title}" has been added successfully`
        );
        setModal(null);
        setSelectedSong(null);
        // Refresh the list
        fetchSongs();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || 'Failed to save song');
        // Show validation errors if any
        if (result.missing && result.missing.length > 0) {
          setError(prev => `${result.message}. Missing: ${result.missing.join(', ')}`);
        }
      }
    } catch {
      setError('An unexpected error occurred while saving the song');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  /**
   * Handle status filter
   */
  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  /**
   * Filter and sort songs for display
   */
  const getFilteredSongs = () => {
    let filtered = [...songs];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song => 
        song.title?.toLowerCase().includes(query) ||
        song.artist?.toLowerCase().includes(query) ||
        song.album?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(song => 
        mapStatus(song.status) === statusFilter
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'Title A–Z':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'Title Z–A':
        filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'Newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'Oldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  // Build table rows from filtered songs
  const buildRows = () => {
    const filteredSongs = getFilteredSongs();
    
    if (filteredSongs.length === 0 && !loading) {
      return [
        [
          <span key="empty" style={{ color: MUTED, fontSize: '0.85rem' }}>
            {songs.length === 0 ? 'No songs found. Click "Add Song" to create one.' : 'No songs match your filters.'}
          </span>,
          '', '', '', '', '', ''
        ]
      ];
    }
    
    return filteredSongs.map(song => [
      <div key={song._id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <Cover size={34} />
        <div>
          <div style={{ fontWeight: 500, color: TEXT, fontSize: '0.85rem' }}>{song.title || 'Untitled'}</div>
          {song.artist && <div style={{ fontSize: '0.72rem', color: MUTED }}>{song.artist}</div>}
        </div>
      </div>,
      <span key="artist" style={{ color: MUTED }}>{song.artist || '-'}</span>,
      <span key="album" style={{ color: MUTED }}>{song.album || '-'}</span>,
      <span key="genre" style={{ color: MUTED }}>{song.genre || '-'}</span>,
      <span key="duration" style={{ color: MUTED }}>{formatDuration(song.duration)}</span>,
      <Badge key="status" status={mapStatus(song.status)} />,
      <RowActions 
        key="actions"
        onView={() => handleView(song)}
        onEdit={() => handleEdit(song)}
        onDelete={() => handleDeleteClick(song)}
        active={mapStatus(song.status) === 'Active'}
      />
    ]);
  };

  // Calculate pagination label
  const getPaginationLabel = () => {
    if (loading) return 'Loading...';
    const { currentPage, totalItems } = pagination;
    const start = (currentPage - 1) * 20 + 1;
    const end = Math.min(currentPage * 20, totalItems);
    return `Showing ${start}–${end} of ${totalItems} songs`;
  };

  return (
    <div style={{ fontFamily: SANS }}>
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Modals */}
      {modal === 'add' && (
        <SongForm 
          mode="add" 
          onClose={() => { setModal(null); setSelectedSong(null); }}
          onSubmit={handleSubmit}
          loading={formLoading}
        />
      )}
      {modal === 'edit' && selectedSong && (
        <SongForm 
          mode="edit" 
          song={selectedSong}
          onClose={() => { setModal(null); setSelectedSong(null); }}
          onSubmit={handleSubmit}
          loading={formLoading}
        />
      )}
      {modal === 'view' && selectedSong && (
        <SongForm 
          mode="view" 
          song={selectedSong}
          onClose={() => { setModal(null); setSelectedSong(null); }}
        />
      )}
      {deleteConfirmSong && (
        <ConfirmDeleteModal 
          song={deleteConfirmSong}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmSong(null)}
          loading={formLoading}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        title="Songs" 
        subtitle={`Manage all songs (${pagination.totalItems} total)`}
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={() => setModal('add')}>Add Song</PrimaryBtn>,
        ]} 
      />

      {/* Main Content */}
      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by title, artist, album..."
          filters={['Active', 'Inactive', 'Draft']}
          sortOptions={['Title A–Z', 'Title Z–A', 'Newest', 'Oldest', 'Most Played']}
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          activeFilter={statusFilter}
          onFilterChange={handleFilterChange}
        />
        
        {loading ? (
          <Table 
            headers={HEADERS} 
            rows={Array.from({ length: 5 }).map((_, i) => [
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Cover size={34} />
                <div>
                  <div style={{ width: 100, height: 11, background: '#F3F4F6', borderRadius: 4, marginBottom: 4 }} />
                  <div style={{ width: 70, height: 10, background: '#F3F4F6', borderRadius: 4 }} />
                </div>
              </div>,
              <div key="artist" style={{ width: 80, height: 11, background: '#F3F4F6', borderRadius: 4 }} />,
              <div key="album" style={{ width: 90, height: 11, background: '#F3F4F6', borderRadius: 4 }} />,
              <div key="genre" style={{ width: 60, height: 11, background: '#F3F4F6', borderRadius: 4 }} />,
              <div key="duration" style={{ width: 40, height: 11, background: '#F3F4F6', borderRadius: 4 }} />,
              <Badge key="status" status="Active" />,
              <RowActions key="actions" />
            ])} 
            checkable 
          />
        ) : (
          <Table headers={HEADERS} rows={buildRows()} checkable />
        )}
        
        <Pagination label={getPaginationLabel()} />
      </Card>

      <style>{`
        @media(max-width: 768px) {
          .tbl-wrap { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
};

const PlusIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default SongsPage;
