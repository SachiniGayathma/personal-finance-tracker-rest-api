const Transaction = require('../models/TransactionSchema'); 
const generateFinancialReport = require('../utils/pdfGenerator'); 
const sendNotificationWithPDF = require('../utils/mailer'); 
const User = require('../models/User');

exports.getFinancialPdf = async (req, res) => {
    const userId = req.user.id; 
    const {startDate = "", endDate = "",category = "",tags =[]} = req.query;
    const reportType = {startDate,endDate,category,tags}


    try {
     
        const user = await User.findById(userId); 
        const transactions = await Transaction.find({userId});
       

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate the PDF report using the user info and the report type
        const filePath = await generateFinancialReport(user,transactions, reportType);

        // Send the generated report via email
        await sendNotificationWithPDF(user.email, 'Your Financial Report', 'Please find your financial report attached.', filePath);

        // Respond to the client that the report has been sent
        res.status(200).json({ message: 'Financial report generated and sent successfully!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating and sending report', error: err.message });
    }
};
