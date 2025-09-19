# ESB-internship
ESB Internship Tasks repository containing 14 WSO2 Micro Integrator APIs, mock Node.js server for testing, and Postman collections with environments. Includes end-to-end service flows such as RBT inquiry, activation, and training tasks, ready for deployment and validation.
ESB Internship Tasks

This repository contains 14 tasks developed during the ESB internship using WSO2 Micro Integrator (MI). Each task includes the Synapse API configuration, a mock Node.js server for testing, and Postman collections with environments for validation.

📂 Repository Structure
ESB-Internship-Tasks/
├── apis/                # Synapse API XML files (Task1–Task17)
├── mock-server/         # Node.js mock server
│   ├── server.js
│   ├── package.json
├── postman/             # Postman exports
│   ├── TrainingTasks.postman_collection.json
│   ├── RBT.postman_environment.json
└── README.md

🚀 Setup & Usage
1️⃣ Run the Mock Server
cd mock-server
npm install
node server.js


Mock server runs on http://localhost:3000

2️⃣ Deploy APIs in WSO2 MI

Copy API XML files from apis/ into:

{MI_HOME}/repository/deployment/server/synapse-configs/default/api/


Start WSO2 MI:

sh {MI_HOME}/bin/micro-integrator.sh


APIs will be available on http://localhost:8290/services/

3️⃣ Test with Postman

Import TrainingTasks.postman_collection.json from postman/

Import RBT.postman_environment.json and select it

Run requests like:

GET http://localhost:8290/services/training/v1.0/task/9/{categoryId}

🛠 Tech Stack

WSO2 Micro Integrator 4.4.0

Node.js / Express.js (for mock services)

Postman (collections + environments for testing)

📌 Notes

Tasks cover API mediation, property mediation, error handling, REST flows, and integration with mock services.

Example scenarios: RBT tone inquiry & activation, bill inquiry, category details, error handling.

✨ Author

Developed by Sajad Hadadian during ESB Internship.
