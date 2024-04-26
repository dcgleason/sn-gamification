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
//           "state": 3,
//           "close_code": "resolved",
//           "priority": 1,
//           "urgency": 1,
//           "impact": 1
//         }
//       ]
//     }
//   ]
  

app.use(bodyParser.json());

app.post('/calculate-scores', (req, res) => {
    const userData = req.body;
  
    const scoredData = userData.map(user => {
      const { tasks } = user;
      let totalScore = 0;
  
      tasks.forEach(task => {
        let score = 0;
        const timeToClose = (new Date(task.closed_at) - new Date(task.opened_at)) / 3600000; // Hours
  
        if (task.state === 3 && task.close_code === 'resolved') {
          score += (72 - timeToClose) * 5; // More points for faster closure
        } else if (task.state === 3 && task.close_code === 'skipped') {
          score += (72 - timeToClose) * 2; // Fewer points for skipped tasks
        }
  
        score *= adjustScoreByPriority(task.priority);
        score *= adjustScoreByUrgency(task.urgency);
        score *= adjustScoreByImpact(task.impact);
  
        totalScore += score;
      });
  
      return {
        name: user.name,
        totalScore
      };
    });
  
    const rankedData = scoredData.sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  
    res.send(rankedData);
  });
  
  function adjustScoreByPriority(priority) {
    switch (priority) {
      case 1:
        return 1.5;
      case 2:
        return 1.3;
      case 3:
        return 1.1;
      default:
        return 1;
    }
  }
  
  function adjustScoreByUrgency(urgency) {
    switch (urgency) {
      case 1:
        return 1.4;
      case 2:
        return 1.2;
      case 3:
        return 1;
      default:
        return 1;
    }
  }
  
  function adjustScoreByImpact(impact) {
    switch (impact) {
      case 1:
        return 1.3;
      case 2:
        return 1.15;
      case 3:
        return 1;
      default:
        return 1;
    }
  }

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
