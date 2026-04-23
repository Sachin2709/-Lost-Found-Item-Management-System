import { useState, useEffect } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useState({ name: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const fetchItems = async () => {
    try {
      const query = new URLSearchParams();
      if (searchParams.name) query.append('name', searchParams.name);
      if (searchParams.type) query.append('type', searchParams.type);
      
      const res = await api.get(`/items/search?${query.toString()}`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setCurrentItem(null);
    fetchItems();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <button className="btn btn-success" onClick={() => { setCurrentItem(null); setShowForm(true); }}>
          + Report Item
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <ItemForm item={currentItem} onClose={closeForm} />
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-3">
            <div className="col-md-6">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name..." 
                name="name"
                value={searchParams.name}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-6">
              <select 
                className="form-select" 
                name="type" 
                value={searchParams.type}
                onChange={handleSearchChange}
              >
                <option value="">All Types</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        {items.length === 0 ? (
          <div className="col-12 text-center text-muted">No items found</div>
        ) : (
          items.map(item => (
            <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
              <ItemCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
