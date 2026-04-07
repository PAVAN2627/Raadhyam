import { useState } from 'react';
import { 
  Card, 
  PageHeader, 
  PrimaryBtn, 
  OutlineBtn, 
  Toolbar, 
  Table, 
  Pagination, 
  Badge, 
  RowActions, 
  Avatar, 
  StatCard, 
  Modal, 
  FormGrid, 
  Input, 
  Select, 
  FormActions, 
  SANS, 
  MUTED, 
  BORDER, 
  Y, 
  YL 
} from '../components/UI';

const HEADERS = ['User', 'Email', 'Plan', 'Streams', 'Status', 'Joined', 'Actions'];

// Get avatar initials from name or username
const getInitials = (user) => {
  if (user.name) {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  return 'U';
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// User Form Modal
const UserForm = ({ title, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
    country: '',
    plan: 'Free',
    status: 'Active',
    role: 'user',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain both letters and numbers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Input 
            label="Username" 
            placeholder="e.g. arjun_mehta" 
            required 
            value={formData.username}
            onChange={(e) => updateField('username', e.target.value)}
            error={errors.username}
          />
          <Input 
            label="Email" 
            placeholder="user@email.com" 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
          />
          <Input 
            label="Full Name" 
            placeholder="e.g. Arjun Mehta" 
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <Input 
            label="Phone" 
            placeholder="+91 00000 00000" 
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <Input 
            label="Country" 
            placeholder="e.g. India" 
            value={formData.country}
            onChange={(e) => updateField('country', e.target.value)}
          />
          <Select 
            label="Role" 
            options={['user', 'admin']}
            value={formData.role}
            onChange={(e) => updateField('role', e.target.value)}
          />
          <Select 
            label="Plan" 
            options={['Free', 'Monthly Premium', 'Annual Premium']}
            value={formData.plan}
            onChange={(e) => updateField('plan', e.target.value)}
          />
          <Select 
            label="Status" 
            options={['Active', 'Inactive', 'Suspended']}
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value)}
          />
          <Input 
            label="Password" 
            placeholder="Min 8 chars with letter + number" 
            type="password" 
            required 
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            error={errors.password}
          />
        </FormGrid>
        <FormActions 
          submitLabel={submitting || loading ? 'Saving...' : 'Save User'}
          onCancel={onClose}
          disabled={submitting || loading}
        />
      </form>
      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

// Users Page Component
const UsersPage = ({
  users = [],
  loading = false,
  error = null,
  search = '',
  setSearch = () => {},
  statusFilter = 'all',
  setStatusFilter = () => {},
  planFilter = 'all',
  setPlanFilter = () => {},
  onAddUser = () => {},
  onDeleteUser = () => {}
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  // Calculate stats from users data
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.plan && u.plan !== 'Free').length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const thisMonthUsers = users.filter(u => {
    if (!u.createdAt) return false;
    const created = new Date(u.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  // Map users to table rows
  const rows = users.map(user => [
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <Avatar name={getInitials(user)} size={32} />
      <div style={{ fontWeight: 500, color: '#1F2937' }}>
        {user.name || user.username || '-'}
      </div>
    </div>,
    <span style={{ color: '#6B7280' }}>{user.email || '-'}</span>,
    <Badge status={user.plan || 'Free'} />,
    <span style={{ color: '#6B7280' }}>{user.streams || 0}</span>,
    <Badge status={user.status || 'Active'} />,
    <span style={{ color: '#6B7280' }}>{formatDate(user.createdAt)}</span>,
    <RowActions 
      active={user.status !== 'Deleted'} 
      onDelete={() => onDeleteUser(user._id)} 
      hideEdit={true}
    />
  ]);

  // Handle add user form submission
  const handleAddUser = async (formData) => {
    setFormStatus({ type: 'loading', message: 'Creating user...' });
    
    // Import the createUser function
    const { createUser } = await import('../../api/adminUserService');
    const result = await createUser(formData);
    
    if (result.success) {
      setFormStatus({ type: 'success', message: result.message });
      setTimeout(() => {
        setShowForm(false);
        setFormStatus(null);
      }, 1000);
    } else {
      setFormStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div style={{ fontFamily: SANS }}>
      {showForm && (
        <UserForm 
          title="Add New User" 
          onClose={() => {
            setShowForm(false);
            setFormStatus(null);
          }}
          onSubmit={handleAddUser}
          loading={formStatus?.type === 'loading'}
        />
      )}

      <PageHeader 
        title="Users" 
        subtitle="Manage registered users"
        actions={[
          <OutlineBtn key="exp">Export</OutlineBtn>,
          <PrimaryBtn 
            key="add" 
            icon={PlusIcon} 
            onClick={() => setShowForm(true)}
          >
            Add User
          </PrimaryBtn>,
        ]} 
      />

      {/* Error message */}
      {error && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#FEF2F2', 
          border: '1px solid #FECACA',
          borderRadius: '8px',
          color: '#DC2626',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Success message */}
      {formStatus?.type === 'success' && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#ECFDF5', 
          border: '1px solid #A7F3D0',
          borderRadius: '8px',
          color: '#059669',
          marginBottom: '1rem'
        }}>
          {formStatus.message}
        </div>
      )}

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.25rem' }} className="user-stats">
        <StatCard label="Total Users" value={totalUsers} icon="👥" color="#3B82F6" bg="#EFF6FF" />
        <StatCard label="Premium Users" value={premiumUsers} icon="⭐" color="#8B5CF6" bg="#F5F3FF" />
        <StatCard label="Active Users" value={activeUsers} icon="🟢" color="#10B981" bg="#ECFDF5" />
        <StatCard label="New This Month" value={thisMonthUsers} icon="📈" color={Y} bg={YL} />
      </div>

      <Card noPad>
        {/* Search and Filters */}
        <Toolbar
          searchPlaceholder="Search by name, email..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={['All', 'Active', 'Inactive', 'Suspended']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
        
        {/* Plan filter tabs */}
        <div className="filter-tabs" style={{ display: 'flex', gap: 6, padding: '0.75rem 1.25rem', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap' }}>
          {['all', 'Free', 'Monthly Premium', 'Annual Premium'].map((f) => (
            <button 
              key={f}
              onClick={() => setPlanFilter(f)}
              style={{ 
                padding: '5px 12px', 
                borderRadius: 8, 
                border: `1.5px solid ${planFilter === f ? Y : BORDER}`, 
                background: planFilter === f ? Y : '#fff', 
                color: planFilter === f ? '#fff' : MUTED, 
                fontSize: '0.78rem', 
                fontWeight: 600, 
                cursor: 'pointer', 
                fontFamily: SANS, 
                whiteSpace: 'nowrap',
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'All Plans' : f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
            <div style={{ marginBottom: '0.5rem' }}>Loading users...</div>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <Table headers={HEADERS} rows={rows} checkable />
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && !error && (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 500, color: '#374151' }}>
              No users found
            </div>
            <div>Try adjusting your search or filters</div>
          </div>
        )}

        <Pagination label={`Showing 1–${users.length} of ${users.length} users`} />
      </Card>
      <style>{`@media(max-width:768px){.user-stats{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.user-stats{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

const PlusIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default UsersPage;
