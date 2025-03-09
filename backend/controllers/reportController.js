// const Transaction = require('../models/TransactionSchema'); // Removed as you're not using transactions
const generateFinancialReport = require('../utils/pdfGenerator'); // Path to your pdf generator utility
const sendNotificationWithPDF = require('../utils/mailer'); // Path to your mailer utility
const User = require('../models/User');

exports.getFinancialPdf = async (req, res) => {
    const userId = req.user.id; // Assuming user id is available from the authentication middleware

    try {
        // Fetch the report type from the query parameters
        

        // You would probably need to fetch user info from the database
        // Assuming you have a User model and the userId is valid
        const user = await User.findById(userId); // Assuming a 'User' model exists
       

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate the PDF report using the user info and the report type
        const filePath = await generateFinancialReport(user, "monthly");

        // Send the generated report via email
        await sendNotificationWithPDF(user.email, 'Your Financial Report', 'Please find your financial report attached.', filePath);

        // Respond to the client that the report has been sent
        res.status(200).json({ message: 'Financial report generated and sent successfully!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating and sending report', error: err.message });
    }
};
