// Brand Colors
export const COLORS = {
    primary: '#3A9D58',
    primaryDark: '#1F5130',
    primaryLight: '#4DB86E',
    secondary: '#C4D7C4',
    secondaryLight: '#E5F0E5',
    secondaryDark: '#A8C4A8',
    gold: '#D4AF37',
    white: '#FFFFFF',
    black: '#000000',
};

// Emergency/Urgent Campaigns
export const EMERGENCY_CAMPAIGNS = [
    {
        id: 'earthquake-herat-2024',
        name: {
            en: 'Herat Earthquake Relief 2024',
            dari: 'کمک به زلزله‌زدگان هرات ۲۰۲۴',
            pashto: 'د ۲۰۲۴ کال د هرات د زلزلې مرسته'
        },
        description: {
            en: 'Emergency aid for families affected by the devastating October 2024 earthquakes in Herat province',
            dari: 'کمک‌های اضطراری برای خانواده‌های آسیب‌دیده از زلزله‌های ویرانگر اکتبر ۲۰۲۴ در ولایت هرات',
            pashto: 'د هرات په ولایت کې د ۲۰۲۴ کال د اکتوبر ویجاړونکو زلزلو څخه زیانمن شویو کورنیو لپاره بیړنۍ مرستې'
        },
        icon: '🏚️',
        isUrgent: true,
        urgentUntil: '2025-06-30T23:59:59',
        goalAmount: 150000,
        currentAmount: 67500,
        priority: 1,
        impactMessage: {
            en: 'Your $50 provides emergency shelter for one family for one month',
            dari: '۵۰ دلار شما سرپناه اضطراری برای یک خانواده برای یک ماه فراهم می‌کند',
            pashto: 'ستاسو ۵۰ ډالر د یوې کورنۍ لپاره د یوې میاشتې لپاره بیړني سرپناه چمتو کوي'
        },
        quickAmounts: [25, 50, 100, 250]
    },
    {
        id: 'winter-emergency-2025',
        name: {
            en: 'Winter Emergency Relief 2025',
            dari: 'کمک‌های اضطراری زمستانی ۲۰۲۵',
            pashto: 'د ۲۰۲۵ کال د ژمي بیړنۍ مرستې'
        },
        description: {
            en: 'Providing warm clothing, blankets, and heating supplies for families facing harsh winter conditions',
            dari: 'فراهم کردن لباس گرم، پتو و وسایل گرمایشی برای خانواده‌های مواجه با شرایط سخت زمستانی',
            pashto: 'د سختو ژمنیو شرایطو سره مخ کورنیو ته د ګرمو جامو، بلینکیټونو او تودوخې سامان چمتو کول'
        },
        icon: '❄️',
        isUrgent: true,
        urgentUntil: '2025-03-15T23:59:59',
        goalAmount: 85000,
        currentAmount: 38250,
        priority: 2,
        impactMessage: {
            en: 'Your $30 provides warm blankets and winter clothing for one child',
            dari: '۳۰ دلار شما پتوی گرم و لباس زمستانی برای یک کودک فراهم می‌کند',
            pashto: 'ستاسو ۳۰ ډالر د یوه ماشوم لپاره ګرم بلینکیټونه او د ژمي جامې چمتو کوي'
        },
        quickAmounts: [30, 75, 150, 300]
    },
    {
        id: 'flood-relief-2024',
        name: {
            en: 'Flash Flood Emergency Relief',
            dari: 'کمک‌های اضطراری سیلاب ناگهانی',
            pashto: 'د ناڅاپي سیلاب بیړنۍ مرستې'
        },
        description: {
            en: 'Urgent assistance for families displaced by recent flash flooding in northern provinces',
            dari: 'کمک فوری برای خانواده‌های آواره شده توسط سیلاب‌های اخیر در ولایات شمالی',
            pashto: 'په شمالي ولایتونو کې د وروستیو ناڅاپي سیلابونو له امله بې ځایه شویو کورنیو لپاره بیړنۍ مرستې'
        },
        icon: '🌊',
        isUrgent: true,
        urgentUntil: '2025-12-31T23:59:59',
        goalAmount: 50000,
        currentAmount: 15800,
        priority: 3,
        impactMessage: {
            en: 'Your $40 provides clean water and food supplies for one family for one week',
            dari: '۴۰ دلار شما آب تمیز و مواد غذایی برای یک خانواده برای یک هفته فراهم می‌کند',
            pashto: 'ستاسو ۴۰ ډالر د یوې کورنۍ لپاره د یوې اونۍ لپاره پاکې اوبه او خوړه چمتو کوي'
        },
        quickAmounts: [40, 80, 160]
    }
];

// Payment Methods (Traditional Money Transfer)
export const PAYMENT_METHODS = {
    HAWALA: 'hawala',
    WESTERN_UNION: 'western_union',
    BANK_TRANSFER: 'bank_transfer',
    MONEYGRAM: 'moneygram',
};

export const CRYPTO_CURRENCIES = [
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { code: 'USDT', name: 'Tether (USDT)', icon: '₮' },
    { code: 'USDC', name: 'USD Coin', icon: '$' },
];

// Languages
export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'dari', name: 'Dari', nativeName: 'دری' },
    { code: 'pashto', name: 'Pashto', nativeName: 'پښتو' },
];

// Donation Status
export const DONATION_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
};

// Preset Donation Amounts
export const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AFGHANIUM';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

// Social Media Links
export const SOCIAL_LINKS = {
    facebook: 'https://facebook.com/afghanium',
    twitter: 'https://twitter.com/afghanium',
    instagram: 'https://instagram.com/afghanium',
    linkedin: 'https://linkedin.com/company/afghanium',
};

// Contact Information
export const CONTACT_INFO = {
    email: 'info@afghanium.org',
    phone: '+93 (0) 700 123 456',
    address: 'Kabul, Afghanistan',
};

// Receiver Information for Money Transfers
export const RECEIVER_INFO = {
    bank_transfer: {
        name: 'AFGHANIUM Charity Organization',
        account_number: '1234567890',
        bank_name: 'Da Afghanistan Bank',
        swift_code: 'DABAAFGX',
        iban: 'AF12 3456 7890 1234 5678 9012',
        address: 'Kabul, Afghanistan',
    },
    hawala: {
        name: 'AFGHANIUM Charity',
        hawala_provider: 'Al-Baraka Exchange',
        location: 'Kabul Main Branch',
        agent_name: 'Ahmad Rahmani',
        phone: '+93 700 123 456',
        instructions: 'Mention "AFGHANIUM Donation" in the transfer notes',
    },
    western_union: {
        name: 'AFGHANIUM Charity Organization',
        city: 'Kabul',
        country: 'Afghanistan',
        phone: '+93 700 123 456',
        instructions: 'Send to Kabul, Afghanistan. Include donation ID in message.',
    },
    moneygram: {
        name: 'AFGHANIUM Charity Organization',
        city: 'Kabul',
        country: 'Afghanistan',
        phone: '+93 700 123 456',
        instructions: 'Send to Kabul, Afghanistan. Include donation ID in message.',
    },
};
