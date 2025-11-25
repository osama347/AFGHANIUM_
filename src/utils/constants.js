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

// Departments
export const DEPARTMENTS = [
    {
        id: 'orphan-children',
        name: {
            en: 'Orphan Children Support',
            dari: 'حمایت از کودکان یتیم',
            pashto: 'د یتیمو ماشومانو ملاتړ'
        },
        description: {
            en: 'Providing shelter, education, and care for orphaned children across Afghanistan',
            dari: 'فراهم کردن سرپناه، آموزش و مراقبت برای کودکان یتیم در سراسر افغانستان',
            pashto: 'په افغانستان کې د یتیمو ماشومانو لپاره د سرپناه، زده کړې او پاملرنې چمتو کول'
        },
        icon: '👶',
    },
    {
        id: 'widows-support',
        name: {
            en: 'Widows Support',
            dari: 'حمایت از بیوه زنان',
            pashto: 'د کونډو میرمنو ملاتړ'
        },
        description: {
            en: 'Empowering widowed women with vocational training and financial assistance',
            dari: 'توانمندسازی زنان بیوه با آموزش حرفه‌ای و کمک مالی',
            pashto: 'د مسلکي روزنې او مالي مرستې سره د کونډو میرمنو پیاوړتیا'
        },
        icon: '👩',
    },
    {
        id: 'poor-families',
        name: {
            en: 'Poor & Vulnerable Families',
            dari: 'خانواده‌های فقیر و آسیب‌پذیر',
            pashto: 'بې وزله او زیان منونکي کورنۍ'
        },
        description: {
            en: 'Supporting struggling families with essential resources and livelihood programs',
            dari: 'حمایت از خانواده‌های در مبارزه با منابع ضروری و برنامه‌های معیشتی',
            pashto: 'د اړینو سرچینو او ژوند پالنې پروګرامونو سره د مبارزو کورنیو ملاتړ'
        },
        icon: '🏠',
    },
    {
        id: 'emergency-food',
        name: {
            en: 'Emergency Food Packs',
            dari: 'بسته‌های غذایی اضطراری',
            pashto: 'د بیړني خوړو کڅوړې'
        },
        description: {
            en: 'Delivering urgent food supplies to families in crisis',
            dari: 'تحویل مواد غذایی فوری به خانواده‌های در بحران',
            pashto: 'په بحران کې کورنیو ته د بیړني خوړو رسول'
        },
        icon: '🍞',
    },
    {
        id: 'education-aid',
        name: {
            en: 'Education Aid',
            dari: 'کمک آموزشی',
            pashto: 'د زده کړې مرسته'
        },
        description: {
            en: 'Providing school supplies, uniforms, and educational support',
            dari: 'فراهم کردن لوازم مدرسه، یونیفورم و پشتیبانی آموزشی',
            pashto: 'د ښوونځي سامان، یونیفورم او تعلیمي مرستې چمتو کول'
        },
        icon: '📚',
    },
    {
        id: 'winter-relief',
        name: {
            en: 'Winter Relief',
            dari: 'کمک زمستانی',
            pashto: 'د ژمي مرسته'
        },
        description: {
            en: 'Distributing warm clothing, blankets, and heating supplies for harsh winters',
            dari: 'توزیع لباس گرم، پتو و وسایل گرمایشی برای زمستان‌های سخت',
            pashto: 'د سختو ژمو لپاره د ګرمو جامو، بلینکیټونو او تودوخې سامان ویش'
        },
        icon: '🧥',
    },
    {
        id: 'medical-assistance',
        name: {
            en: 'Medical Assistance',
            dari: 'کمک‌های پزشکی',
            pashto: 'طبي مرستې'
        },
        description: {
            en: 'Providing healthcare services and medical supplies to underserved communities',
            dari: 'فراهم کردن خدمات بهداشتی و لوازم پزشکی به جوامع محروم',
            pashto: 'د محرومو ټولنو ته د روغتیا پاملرنې خدماتو او طبي سامان چمتو کول'
        },
        icon: '🏥',
    },
    {
        id: 'clean-water',
        name: {
            en: 'Clean Water Wells',
            dari: 'چاه‌های آب تمیز',
            pashto: 'د پاکو اوبو کانونه'
        },
        description: {
            en: 'Building wells to provide access to clean drinking water',
            dari: 'ساخت چاه برای فراهم کردن دسترسی به آب آشامیدنی تمیز',
            pashto: 'د پاکو څښاک اوبو ته د لاسرسي چمتو کولو لپاره د کانونو جوړول'
        },
        icon: '💧',
    },
    {
        id: 'refugee-support',
        name: {
            en: 'Refugee / IDP Support',
            dari: 'حمایت از پناهندگان / آوارگان',
            pashto: 'د کډوالو / بې ځایه شویو ملاتړ'
        },
        description: {
            en: 'Assisting displaced persons with shelter, food, and essential services',
            dari: 'کمک به افراد بی‌جاشده با سرپناه، غذا و خدمات ضروری',
            pashto: 'د بې ځایه شویو افرادو سره د سرپناه، خوړو او اړینو خدماتو مرسته'
        },
        icon: '⛺',
    },
    {
        id: 'ramadan-zakat',
        name: {
            en: 'Ramadan Food Packs / Zakat',
            dari: 'بسته‌های غذایی رمضان / زکات',
            pashto: 'د رمضان خوړو کڅوړې / زکات'
        },
        description: {
            en: 'Distributing food packages and Zakat assistance during Ramadan',
            dari: 'توزیع بسته‌های غذایی و کمک زکات در ماه رمضان',
            pashto: 'په رمضان کې د خوړو کڅوړو او د زکات مرستې ویش'
        },
        icon: '🌙',
    },
];

// Emergency/Urgent Departments
export const EMERGENCY_DEPARTMENTS = [
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

// Payment Methods
export const PAYMENT_METHODS = {
    STRIPE: 'stripe',
    PAYPAL: 'paypal',
    CRYPTO: 'crypto',
    BANK_TRANSFER: 'bank_transfer',
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
