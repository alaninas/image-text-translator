const monthNames = [
    'January', 
    'Febuary', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
];

const languagesDict = {
    'Ja': 'ja',
    'En': 'en',
    'Fr': 'fr',
    'Es': 'es'
};

const accuracyDict = {
    '1': 'Low',
    '2': 'Intermediate',
    '3': 'High'
};

const geolocationStringRegex = /^\D+(\d+\D\d+),\D+(\d+\D\d+)$/;

module.exports = {
    monthNames,
    languagesDict,
    accuracyDict,
    geolocationStringRegex
}
