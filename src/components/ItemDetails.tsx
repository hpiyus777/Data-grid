import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../redux/store";
import * as actions from "../redux/actions";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const itemFromLocation = location.state?.item;
  const groupedItems = useSelector(
    (state: RootState) => state.grid.groupedItems
  );

  // Find item from grouped items or location state
  const findItem = () => {
    if (itemFromLocation) {
      return itemFromLocation;
    }

    if (!id) {
      return null;
    }

    const itemId = Number(id);

    // Search through all sections to find the item
    for (const section of groupedItems) {
      if (section.items && Array.isArray(section.items)) {
        const foundItem = section.items.find((item: any) => {
          return item.item_id === itemId;
        });

        if (foundItem) {
          return foundItem;
        }
      }
    }

    return null;
  };

  const item = findItem();

  const [formData, setFormData] = useState({
    subject: "",
    quantity: 0,
    unit_cost: 0,
    markup: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        subject: item.subject || "",
        quantity: Number(item.quantity) || 0,
        unit_cost: Number(item.unit_cost) || 0,
        markup: Number(item.markup) || 0,
      });
      setLoading(false);
    } else if (groupedItems.length > 0) {
      setLoading(false);
    }
  }, [item, groupedItems]);

  // Load data if not available
  useEffect(() => {
    if (groupedItems.length === 0) {
      dispatch(actions.fetchGridDataRequest());
    }
  }, [dispatch, groupedItems.length]);

  if (loading && groupedItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <div className="text-center">Loading item details...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <div className="text-center text-red-500">
          <h2 className="text-lg font-bold mb-2">Item not found</h2>
          <p>ID: {id || "No ID provided"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "subject" ? value : Number(value),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const updatedItem = {
        ...item,
        ...formData,
        total: formData.unit_cost * formData.quantity + (formData.markup || 0),
      };

      // Update item in Redux store
      dispatch(
        actions.updateItemRequest(item.section_id, item.item_id, updatedItem)
      );

      // Navigate back with success message
      navigate("/dashboard", {
        state: {
          message: "Item updated successfully!",
          updatedItemId: item.item_id,
        },
      });
    } catch (error) {
      console.error("Error updating item:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Item - {item.subject}</h2>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Display item info */}
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <p>
          <strong>Item ID:</strong> {item.item_id}
        </p>
        <p>
          <strong>Section:</strong> {item.section_name}
        </p>
        <p>
          <strong>Item Type:</strong> {item.item_type_display_name}
        </p>
        <p>
          <strong>Current Total:</strong> ₹{Number(item.total).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Subject</label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Quantity</label>
          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Unit Cost (₹)</label>
          <input
            name="unit_cost"
            type="number"
            step="0.01"
            value={formData.unit_cost}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Markup (₹)</label>
          <input
            name="markup"
            type="number"
            step="0.01"
            value={formData.markup}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
        </div>

        {/* Calculated total */}
        <div className="p-3 bg-blue-50 rounded">
          <p className="font-semibold">
            Calculated Total: ₹
            {(
              formData.unit_cost * formData.quantity +
              formData.markup
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleCancel}
            disabled={saving}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
