import { useState, useEffect } from 'react';
import api from '../api/axios';

const ItemForm = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    contactInfo: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName,
        description: item.description,
        type: item.type,
        location: item.location,
        contactInfo: item.contactInfo
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item) {
        await api.put(`/items/${item._id}`, formData);
      } else {
        await api.post('/items', formData);
      }
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save item');
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{item ? 'Edit Item' : 'Report Item'}</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Item Name</label>
              <input type="text" className="form-control" name="itemName" value={formData.itemName} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Type</label>
              <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Location (Lost/Found)</label>
              <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Contact Info</label>
              <input type="text" className="form-control" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{item ? 'Update' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
