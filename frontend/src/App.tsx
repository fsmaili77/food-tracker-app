import React, { useEffect, useState } from 'react';

interface FoodItem {
  id: number;
  name: string;
  expirationDate: string;
}

const App: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');

  const fetchFoodItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/fooditems');
      if (!response.ok) throw new Error('Failed to fetch food items');
      const data = await response.json();
      setFoodItems(data);
    } catch (err) {
      setError('Error loading food items');
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !expirationDate) {
      setError('Please enter both name and expiration date');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/fooditems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, expirationDate }),
      });

      if (response.status === 409) {
        setError('Food item with this name already exists');
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        setError(text || 'Failed to add food item');
        return;
      }

      setName('');
      setExpirationDate('');
      fetchFoodItems();
    } catch (err) {
      setError('Failed to add food item');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/fooditems/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setError('Failed to delete food item');
        return;
      }
      fetchFoodItems();
    } catch (err) {
      setError('Failed to delete food item');
    }
  };

  const getStatus = (expirationDate: string) => {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (diffDays <= 7) {
      return { text: 'Expiring soon', color: 'red' };
    }
    return { text: 'Good to use', color: 'green' };
  };

  return (
    <div className="container mt-4">
      <h1>Food Expiration Tracker</h1>

      <form onSubmit={handleAdd} className="mb-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Food Name</label>
          <input
            id="name"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
          <input
            id="expirationDate"
            type="date"
            className="form-control"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">Add Food Item</button>
      </form>

      <h2>Food Items</h2>
      {foodItems.length === 0 ? (
        <p>No food items found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Expiration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map(item => {
              const status = getStatus(item.expirationDate);
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{new Date(item.expirationDate).toLocaleDateString()}</td>
                  <td style={{ color: status.color }}>{status.text}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
