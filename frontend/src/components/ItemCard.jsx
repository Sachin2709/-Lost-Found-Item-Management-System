const ItemCard = ({ item, onEdit, onDelete }) => {
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  
  // Check if current user is the owner
  const isOwner = currentUser && item.createdBy && currentUser.id === (typeof item.createdBy === 'object' ? item.createdBy._id : item.createdBy);

  const badgeColor = item.type === 'Lost' ? 'bg-danger' : 'bg-success';

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <span className={`badge ${badgeColor}`}>{item.type}</span>
        <small className="text-muted">{new Date(item.date).toLocaleDateString()}</small>
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold">{item.itemName}</h5>
        <p className="card-text text-muted small">{item.description}</p>
        <hr />
        <p className="mb-1"><i className="bi bi-geo-alt"></i> <strong>Location:</strong> {item.location}</p>
        <p className="mb-1"><i className="bi bi-telephone"></i> <strong>Contact:</strong> {item.contactInfo}</p>
        <p className="mb-0 small text-muted">Reported by: {item.createdBy?.name || 'Unknown'}</p>
      </div>
      {isOwner && (
        <div className="card-footer bg-white border-top-0 d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary w-50" onClick={() => onEdit(item)}>Edit</button>
          <button className="btn btn-sm btn-outline-danger w-50" onClick={() => onDelete(item._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
