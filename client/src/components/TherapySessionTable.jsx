import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import ConfirmDialog from './ConfirmDialog';

const TherapySessionTable = ({ sessions, onAdd, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState(null);

  // Form states for inline editing/adding
  const [formState, setFormState] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    physiotherapyTreatment: '',
    treatmentCost: '',
    paid: '',
    ptSign: '',
    day: format(new Date(), 'EEEE')
  });

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormState({
      date: format(new Date(), 'yyyy-MM-dd'),
      physiotherapyTreatment: '',
      treatmentCost: 0,
      paid: 0,
      ptSign: '',
      day: format(new Date(), 'EEEE')
    });
  };

  const handleStartEdit = (session) => {
    setEditingId(session._id);
    setIsAdding(false);
    setFormState({
      date: format(new Date(session.date), 'yyyy-MM-dd'),
      physiotherapyTreatment: session.physiotherapyTreatment || '',
      treatmentCost: session.treatmentCost || 0,
      paid: session.paid || 0,
      ptSign: session.ptSign || '',
      day: session.day || ''
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'date') {
        try {
          newState.day = format(new Date(value), 'EEEE');
        } catch (e) {
          newState.day = '';
        }
      }
      return newState;
    });
  };

  const handleSave = async (id) => {
    const payload = {
      ...formState,
      treatmentCost: Number(formState.treatmentCost) || 0,
      paid: Number(formState.paid) || 0
    };

    if (id) {
      await onUpdate(id, payload);
      setEditingId(null);
    } else {
      await onAdd(payload);
      setIsAdding(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteSessionId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteSessionId) {
      await onDelete(deleteSessionId);
      setDeleteSessionId(null);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Therapy Log & Session History</h3>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={handleStartAdd}>
            <FaPlus />
            <span>Add Session</span>
          </button>
        )}
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Sr. No.</th>
                <th style={{ width: '130px' }}>Date</th>
                <th>Physiotherapy Treatment</th>
                <th style={{ width: '100px' }}>Cost</th>
                <th style={{ width: '100px' }}>Paid</th>
                <th style={{ width: '100px' }}>Balance</th>
                <th style={{ width: '120px' }}>Pt. Sign</th>
                <th style={{ width: '120px' }}>Day</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Inline Add Row */}
              {isAdding && (
                <tr className="therapy-row" style={{ background: 'var(--teal-light)' }}>
                  <td>{sessions.length + 1}</td>
                  <td>
                    <input 
                      type="date" 
                      name="date" 
                      value={formState.date} 
                      onChange={handleInputChange} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      name="physiotherapyTreatment" 
                      placeholder="e.g. Spinal mobilization + IFT" 
                      value={formState.physiotherapyTreatment} 
                      onChange={handleInputChange} 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      name="treatmentCost" 
                      placeholder="Cost" 
                      value={formState.treatmentCost} 
                      onChange={handleInputChange} 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      name="paid" 
                      placeholder="Paid" 
                      value={formState.paid} 
                      onChange={handleInputChange} 
                    />
                  </td>
                  <td className={(Number(formState.treatmentCost) - Number(formState.paid) > 0) ? 'balance-positive' : 'balance-zero'}>
                    {(Number(formState.treatmentCost) || 0) - (Number(formState.paid) || 0)}
                  </td>
                  <td>
                    <input 
                      type="text" 
                      name="ptSign" 
                      placeholder="Initial/Name" 
                      value={formState.ptSign} 
                      onChange={handleInputChange} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      name="day" 
                      readOnly 
                      value={formState.day} 
                    />
                  </td>
                  <td style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button className="btn btn-primary btn-sm btn-ghost" style={{ color: 'var(--green)' }} onClick={() => handleSave(null)}>
                      <FaCheck />
                    </button>
                    <button className="btn btn-danger btn-sm btn-ghost" onClick={handleCancel}>
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              )}

              {/* Sessions List */}
              {sessions.length === 0 && !isAdding ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-400)' }}>
                    No therapy sessions logged yet for this patient. Click "Add Session" above to log today's treatment.
                  </td>
                </tr>
              ) : (
                sessions.map((session, index) => {
                  const isEditing = editingId === session._id;
                  const balance = (isEditing) 
                    ? (Number(formState.treatmentCost) || 0) - (Number(formState.paid) || 0)
                    : (session.treatmentCost || 0) - (session.paid || 0);

                  return (
                    <tr key={session._id} className={isEditing ? 'therapy-row' : ''} style={isEditing ? { background: 'var(--teal-light)' } : {}}>
                      <td>{session.srNo || index + 1}</td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="date" 
                            name="date" 
                            value={formState.date} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          format(new Date(session.date), 'dd MMM yyyy')
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="physiotherapyTreatment" 
                            value={formState.physiotherapyTreatment} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          session.physiotherapyTreatment
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="number" 
                            name="treatmentCost" 
                            value={formState.treatmentCost} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          `$${session.treatmentCost || 0}`
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="number" 
                            name="paid" 
                            value={formState.paid} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          `$${session.paid || 0}`
                        )}
                      </td>
                      <td className={balance > 0 ? 'balance-positive' : 'balance-zero'}>
                        {balance > 0 ? `$${balance}` : 'Settled'}
                      </td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="ptSign" 
                            value={formState.ptSign} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          session.ptSign || '-'
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="day" 
                            readOnly 
                            value={formState.day} 
                          />
                        ) : (
                          session.day || format(new Date(session.date), 'EEEE')
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button className="btn btn-primary btn-sm btn-ghost" style={{ color: 'var(--green)' }} onClick={() => handleSave(session._id)}>
                              <FaCheck />
                            </button>
                            <button className="btn btn-danger btn-sm btn-ghost" onClick={handleCancel}>
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button className="btn btn-secondary btn-sm btn-ghost" onClick={() => handleStartEdit(session)}>
                              <FaEdit style={{ color: 'var(--teal)' }} />
                            </button>
                            <button className="btn btn-secondary btn-sm btn-ghost" onClick={() => handleDeleteRequest(session._id)}>
                              <FaTrash style={{ color: 'var(--red)' }} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteSessionId}
        title="Delete Session"
        message="Are you sure you want to permanently delete this therapy session record? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteSessionId(null)}
      />
    </div>
  );
};

export default TherapySessionTable;
