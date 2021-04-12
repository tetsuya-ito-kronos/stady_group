// data、tableのDOMはこのグローバル変数を参照してください。
let users; // ユーザ一覧
let teams; // チーム一覧
let relationTeam; // だれがどこのチームに属するか
let games; // ゲーム一覧
let scores; // 誰がどのゲームで何点とったか
let table; // tableのDOM要素

const TEAM = '1';
const GAME = '2';
const USER = '3';

// onloadイベント内コールバックは変更しないでください。
window.onload = () => {
  // data.js内データを参照
  users = userData;
  teams = teamData;
  relationTeam = relationTeamData;
  games = gameData;
  scores = scoreData;
  // tableDom取得
  table = document.getElementById('table');
  // イベント設定
  const select = document.getElementById('kind');
  select.onchange = e => createTable(e.target.value);
  // 初期表示
  createTable(select.value);
};

createTable = kind => {
  table.innerHTML = null;
  try {
    switch (kind) {
      case TEAM:
        return createTeamTable();
      case GAME:
        return createGameTable();
      case USER:
        return createUserTable();
      default:
        throw '存在しない種別';
    }
  } catch (err) {
    console.log(err);
    const error = document.createElement('p');
    error.innerText = 'エラーが発生しました！';
    document.body.appendChild(error);
  }
};

createTeamTable = () => {
  const rows = Array.from(
    scores
      .reduce((map, target) => {
        const key = getTeamId(target.userId);
        if (map.has(key)) {
          map.get(key).push(target);
        } else {
          map.set(key, [target]);
        }
        return map;
      }, new Map())
    )
    .map(([key, userArray]) =>
      userArray.reduce((user, target) => {
        user.score += target.score;
        return user;
      }, { id: key, score: 0 })
    )
    .sort((prev, target) => target.score - prev.score);
  
  rows.forEach(row => {
    const tr = document.createElement('tr');
    const teamTd = document.createElement('td');
    teamTd.innerText = teams[row.id];
    const scoreTd = document.createElement('td');
    scoreTd.innerText = row.score;
    tr.appendChild(teamTd);
    tr.appendChild(scoreTd);
    table.appendChild(tr);
  });
};

createGameTable = () => {
  const rows = Object.keys(games).map(gameKey =>
    scores
      .filter(score => score.gameId === Number(gameKey))
      .reduce((prev, target) => prev.score > target.score ? prev : target)
  );

  rows.forEach(row => {
    const tr = document.createElement('tr');
    const gameTd = document.createElement('td');
    gameTd.innerText = games[row.gameId];
    const nameTd = document.createElement('td');
    nameTd.innerText = users[row.userId];
    const teamTd = document.createElement('td');
    teamTd.innerText = teams[getTeamId(row.userId)];
    const scoreTd = document.createElement('td');
    scoreTd.innerText = row.score;
    tr.appendChild(gameTd);
    tr.appendChild(nameTd);
    tr.appendChild(teamTd);
    tr.appendChild(scoreTd);
    table.appendChild(tr);
  });
};

createUserTable = () => {
  const rows = Array.from(
    scores
      .reduce((map, target) => {
        const key = target.userId;
        if (map.has(key)) {
          map.get(key).push(target);
        } else {
          map.set(key, [target]);
        }
        return map;
      }, new Map())
    )
    .map(([key, userArray]) =>
      userArray.reduce((user, target) => {
        user.score += target.score;
        return user;
      }, { id: key, score: 0 })
    )
    .sort((prev, target) => target.score - prev.score);
  
  rows.forEach(row => {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.innerText = users[row.id];
    const teamTd = document.createElement('td');
    teamTd.innerText = teams[getTeamId(row.id)];
    const scoreTd = document.createElement('td');
    scoreTd.innerText = row.score;
    tr.appendChild(nameTd);
    tr.appendChild(teamTd);
    tr.appendChild(scoreTd);
    table.appendChild(tr);
  });
};

getTeamId = userId => {
  return Object.entries(relationTeam)
    .find(([key, value]) => value.includes(userId))[0];
};
