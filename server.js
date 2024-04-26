const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

//request

// [
//     {
//       "name": "John Doe",
//       "tasks": [
//         {
//           "opened_at": "2024-04-20T09:00:00.000Z",
//           "closed_at": "2024-04-21T09:00:00.000Z",
//           "urgency": 1
//         }
//       ]
//     }
//   ]


function calculateScores(data) {
    return data.map(user => {
      const { tasks } = user;
      let totalScore = 0;
  
      tasks.forEach(task => {
        let score = 0;
        const timeToClose = (new Date(task.closed_at) - new Date(task.opened_at)) / 3600000; // Hours
  
        score += (72 - timeToClose) * 5; // More points for faster closure
  
        if (task.urgency) {
          score *= adjustScoreByUrgency(task.urgency);
        }
  
        totalScore += score;
      });
  
      return {
        name: user.name,
        totalScore
      };
    });
  }
  
  function adjustScoreByUrgency(urgency) {
    switch (urgency) {
      case 1:
        return 1.5;
      case 2:
        return 1.2;
      case 3:
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
