const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/calculate-scores', (req, res) => {
  const userData = req.body;

  if (!userData || userData.length === 0) {
    return res.status(400).send('No user data provided');
  }

  const scoredData = userData.map(user => {
    const { tasks } = user;
    let totalScore = 0;

    if (tasks && tasks.length > 0) {
      const { state, priority, urgency, impact } = tasks[0];
      totalScore = adjustScoreByState(state) * adjustScoreByPriority(priority) *
        adjustScoreByUrgency(urgency) * adjustScoreByImpact(impact);
    }

    return {
      name: user.name,
      totalScore
    };
  });

  const rankedData = scoredData.sort((a, b) => b.totalScore - a.totalScore)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  res.send(rankedData);
});

function adjustScoreByState(state) {
  switch (state) {
    case 3:
      return 1.5;
    case 2:
      return 1.2;
    case 1:
      return 1;
    default:
      return 1;
  }
}

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