const fs = require('fs');

const filePath = 'workout_recommendations.json'; // Update with your file name
const outputFile = 'workout_fixed.json'; // New file after fixing

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('❌ Error reading file:', err);
        return;
    }

    // Replace all NaN values with "Unknown"
    const fixedData = data.replace(/: NaN/g, ': "Unknown"');

    fs.writeFile(outputFile, fixedData, (err) => {
        if (err) {
            console.error('❌ Error writing file:', err);
            return;
        }
        console.log('✅ NaN values replaced successfully! New file saved as:', outputFile);
    });
});
