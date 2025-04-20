import React, { useState, useEffect } from 'react';
import i18n from './i18n';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

interface FoodItem {
  id: number;
  name: string;
  expirationDate: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation(); // Destructure t and i18n from useTranslation
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
      setError(t('error.missingFields')); // Use t for translations
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/fooditems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, expirationDate }),
      });

      if (response.status === 409) {
        setError(t('error.duplicateItem')); // Use t for translations
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        setError(text || t('error.addFailed')); // Use t for translations
        return;
      }

      setName('');
      setExpirationDate('');
      fetchFoodItems();
    } catch (err) {
      setError(t('error.addFailed')); // Use t for translations
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/fooditems/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setError(t('error.deleteFailed')); // Use t for translations
        return;
      }
      fetchFoodItems();
    } catch (err) {
      setError(t('error.deleteFailed')); // Use t for translations
    }
  };

  const getStatus = (expirationDate: string) => {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (diffDays <= 7) {
      return { text: t('status.expiringSoon'), color: 'red' }; // Use t for translations
    }
    return { text: t('status.goodToUse'), color: 'green' }; // Use t for translations
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{t('title')}</h1>
        <select onChange={handleLanguageChange} className="form-select w-auto">
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>

        </select>
      </div>

      <form onSubmit={handleAdd} className="mb-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">{t('form.foodName')}</label>
          <input
            id="name"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="expirationDate" className="form-label">{t('form.expirationDate')}</label>
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

        <button type="submit" className="btn btn-primary">{t('form.addButton')}</button>
      </form>

      <h2>{t('foodItems.title')}</h2>
      {foodItems.length === 0 ? (
        <p>{t('foodItems.noItems')}</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{t('foodItems.name')}</th>
              <th>{t('foodItems.expirationDate')}</th>
              <th>{t('foodItems.status')}</th>
              <th>{t('foodItems.actions')}</th>
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
                      {t('foodItems.delete')}
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
