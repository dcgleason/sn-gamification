const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

//request
// [
//     {
//         "name": "John Doe",
//         "tasks": [
//             {
//                 "type": "incident",
//                 "created": "2024-04-20T09:00:00.000Z",
//                 "firstComment": "2024-04-20T10:00:00.000Z",
//                 "assigned": "2024-04-20T09:30:00.000Z",
//                 "closed": "2024-04-21T09:00:00.000Z",
//                 "priority": "High"
//             }
//         ]
//     }
// ]


function calculateScores(data) {
    return data.map(user => {
        const { tasks } = user;
        let totalScore = 0;

        tasks.forEach(task => {
            let score = 0;
            const timeToFirstComment = (new Date(task.firstComment) - new Date(task.created)) / 3600000; // Hours
            const timeToClose = (new Date(task.closed) - new Date(task.assigned)) / 3600000; // Hours

            score += (24 - timeToFirstComment) * 10; // More points for faster first comment
            score += (72 - timeToClose) * 5; // More points for faster closure

            if (task.type === 'incident') {
                score *= adjustScoreByPriority(task.priority);
            }

            totalScore += score;
        });

        return {
            name: user.name,
            totalScore
        };
    });
}

function adjustScoreByPriority(priority) {
    switch (priority) {
        case 'High':
            return 1.5;
        case 'Medium':
            return 1.2;
        case 'Low':
            return 1;
        default:
            return 1;
    }
}

function rankUsers(users) {
    return users.sort((a, b) => b.totalScore - a.totalScore)
                .map((user, index) => ({ ...user, rank: index + 1 }));
}



app.use(bodyParser.json());

app.post('/calculate-scores', (req, res) => {
    const userData = req.body;
    const scoredData = calculateScores(userData);
    const rankedData = rankUsers(scoredData);

    res.send(rankedData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
