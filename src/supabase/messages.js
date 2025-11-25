import { supabase } from './client.js';

const TABLE = 'messages';

/**
 * Create a new message
 * @param {object} messageData - { name, email, subject, message }
 * @returns {Promise<object>} Created message
 */
export const createMessage = async (messageData) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .insert([
                {
                    name: messageData.name,
                    email: messageData.email,
                    subject: messageData.subject,
                    message: messageData.message,
                    read: false,
                    created_at: new Date().toISOString(),
                },
            ]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error creating message:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all messages
 * @returns {Promise<object>} Array of messages
 */
export const getMessages = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Mark message as read
 * @param {number} id - Message ID
 * @returns {Promise<object>} Updated message
 */
export const markMessageAsRead = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .update({ read: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error marking message as read:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete message
 * @param {number} id - Message ID
 * @returns {Promise<object>} Result
 */
export const deleteMessage = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting message:', error);
        return { success: false, error: error.message };
    }
};
/**
 * Get count of unread messages
 * @returns {Promise<object>} Count
 */
export const getUnreadCount = async () => {
    try {
        const { count, error } = await supabase
            .from(TABLE)
            .select('*', { count: 'exact', head: true })
            .eq('read', false);

        if (error) throw error;

        return { success: true, count };
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return { success: false, error: error.message };
    }
};
