import React from "react";

function SlotsList({ slots, selectedSlotId, onSelectSlot }) {
  if (!slots || slots.length === 0) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ color: '#9ca3af', margin: 0 }}>No available slots at this time.</p>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="slots-list">
      {slots.map(slot => (
        <button
          key={slot.id}
          className={
            "slot-item" + (selectedSlotId === slot.id ? " slot-item--selected" : "")
          }
          onClick={() => onSelectSlot(slot.id)}
        >
          <div>
            <div>
              <strong>{formatDateTime(slot.start)}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
              Duration: {slot.slot_duration} minutes
            </div>
          </div>
          <span className={`status-badge status-${slot.status}`}>
            {slot.status}
          </span>
        </button>
      ))}
      {slots.length > 0 && (
        <div style={{
          marginTop: '8px',
          padding: '12px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '0.85rem'
        }}>
          {slots.length} slot{slots.length !== 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
}

export default SlotsList;
