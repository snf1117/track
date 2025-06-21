
const API_BASE_URL = 'http://localhost:3001/api';

export interface Shipment {
  id: number;
  tracking_number: string;
  customer_email: string;
  item_description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
}

class ApiService {
  async register(email: string, password: string): Promise<{ message: string; id: number }> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async adminLogin(username: string, password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Admin login failed');
    }

    return response.json();
  }

  async createShipment(customerEmail: string, itemDescription: string): Promise<{ message: string; trackingNumber: string; id: number }> {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerEmail, itemDescription }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create shipment');
    }

    return response.json();
  }

  async getShipmentsByEmail(email: string): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE_URL}/shipments/${encodeURIComponent(email)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch shipments');
    }

    return response.json();
  }

  async getAllShipments(email?: string): Promise<Shipment[]> {
    const url = email 
      ? `${API_BASE_URL}/admin/shipments?email=${encodeURIComponent(email)}`
      : `${API_BASE_URL}/admin/shipments`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch shipments');
    }

    return response.json();
  }

  async updateShipmentStatus(trackingNumber: string, status: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/shipments/${trackingNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update shipment');
    }

    return response.json();
  }

  async trackShipment(trackingNumber: string): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/track/${trackingNumber}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Shipment not found');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
