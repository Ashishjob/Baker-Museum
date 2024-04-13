const controller = require('./controller');

function router(req, res) {
    const url = req.url;
    const method = req.method;

    if (url === '/branch-directors' && method === 'GET') {
        controller.getBranchDirectors(req, res);
    } 
    else if (url === '/manage-employees' && method === 'GET') {
        controller.getEmployees(req, res);
    } 
    else if (url === '/manage-employees' && method === 'POST') {
        controller.addEmployee(req, res);
    } 
    else if (url === '/manage-employees' && method === 'PUT') {
        const contentType = req.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on('end', () => {
                const data = JSON.parse(body);
                const { action, ...requestData } = data; // Destructure 'action' field and get the rest of the data
                if (data.action === 'update') {
                    controller.updateEmployeeInfo(requestData, res);
                } else if (data.action === 'markForDeletion') {
                    controller.markEmployeeForDeletion(req, res);
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid action' }));
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid content type' }));
        }
    } 
    else if(url === '/manage-exhibits' && method === 'GET'){
        controller.getExhibits(req, res);
    }
    else if(url === '/manage-exhibits' && method === 'POST'){
        controller.addExhibits(req, res);
    }
    else if(url === '/complaints' && method === 'POST'){
        controller.insertComplaints(req, res);
    }
    else if (url === '/complaints' && method === 'GET') {
        controller.getComplaints(req, res);
    } 
    else if (url === '/login' && method === 'POST') {
        controller.authenticateUser(req, res);
    }
    else if (url === '/signup' && method === 'POST') {
        controller.addCustomer(req, res);
    }
    else if (url.startsWith('/customer/') && method === 'GET') {
        // Extract the customer ID from the URL
        const customerId = url.split('/')[2]; // Assuming the customer ID is the third segment of the URL
        controller.getCustomerInfo(customerId, res);
    }
    else if (url.startsWith('/decodeToken') && method === 'POST') {
        controller.decodeToken(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
}

module.exports = router;