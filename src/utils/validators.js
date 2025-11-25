/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate donation amount
 * @param {number} amount - Amount to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateAmount = (amount) => {
    if (!amount || amount <= 0) {
        return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (amount < 5) {
        return { isValid: false, error: 'Minimum donation amount is $5' };
    }

    if (amount > 1000000) {
        return { isValid: false, error: 'Maximum donation amount is $1,000,000' };
    }

    return { isValid: true, error: null };
};

/**
 * Validate full name
 * @param {string} name - Name to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, error: 'Name is required' };
    }

    if (name.trim().length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters' };
    }

    if (name.trim().length > 100) {
        return { isValid: false, error: 'Name must be less than 100 characters' };
    }

    return { isValid: true, error: null };
};

/**
 * Validate donation form
 * @param {object} data - Form data
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateDonationForm = (data) => {
    const errors = {};

    // Validate name
    const nameValidation = validateName(data.fullName);
    if (!nameValidation.isValid) {
        errors.fullName = nameValidation.error;
    }

    // Validate email
    if (!validateEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Validate amount
    const amountValidation = validateAmount(data.amount);
    if (!amountValidation.isValid) {
        errors.amount = amountValidation.error;
    }

    // Validate department
    if (!data.department) {
        errors.department = 'Please select a department';
    }

    // Validate payment method
    if (!data.paymentMethod) {
        errors.paymentMethod = 'Please select a payment method';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate donation ID format
 * @param {string} id - Donation ID
 * @returns {boolean} True if valid format
 */
export const validateDonationId = (id) => {
    if (!id) return false;
    const idRegex = /^AFG-[A-Z0-9]{10}$/i;
    return idRegex.test(id);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/;
    return phoneRegex.test(phone);
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
};
