
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/menu';

export const createMenuItem = async (menuData) => {
    console.log('Sending menu data to API:', menuData);
    try {
        const response = await axios.post(API_URL, menuData);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API error:', error.response?.data || error.message);
        throw error;
    }
};

export const uploadMenuImage = async (formData) => {
    console.log('Uploading image to server...');
    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Upload API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Upload API error:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllMenuItems = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('Retrieved menu items:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching menu items:', error.response?.data || error.message);
        throw error;
    }
};