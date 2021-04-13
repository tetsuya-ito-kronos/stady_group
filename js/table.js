// data、tableのDOMはこのグローバル変数を参照してください。
let users; // ユーザ一覧
let teams; // チーム一覧
let relationTeam; // だれがどこのチームに属するか
let games; // ゲーム一覧
let scores; // 誰がどのゲームで何点とったか
let table; // tableのDOM要素

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
    // データ取得
    let rows = [];
    if (kind === '1') {
      // チーム毎の場合
      rows = getTeamRows();
    } else if (kind === '2') {
      // ゲーム毎の場合
      rows = getGameRows();
    } else {
      // ユーザ毎の場合
      rows = getUserRows();
    }

    // テーブル作成
    rows.forEach(row => {
      const tr = document.createElement('tr');
      if (kind === '1') {
        // チーム毎の時は最初にチーム名
        const teamTd = document.createElement('td');
        teamTd.innerText = teams[row.teamId];
        tr.appendChild(teamTd);
      } else if (kind === '2') {
        // ゲーム毎の時は最初にゲーム名
        const gameTd = document.createElement('td');
        gameTd.innerText = games[row.gameId];
        tr.appendChild(gameTd);
      }
      // チーム毎以外の時はユーザ名、チーム名出力
      if (kind !== '1') {
        const nameTd = document.createElement('td');
        nameTd.innerText = users[row.userId];
        tr.appendChild(nameTd);
        const teamTd = document.createElement('td');
        teamTd.innerText = teams[getTeamId(row.userId)];
        tr.appendChild(teamTd);
      }
      // どの種別でもスコアは必ず表示
      const scoreTd = document.createElement('td');
      scoreTd.innerText = row.score;
      tr.appendChild(scoreTd);
      table.appendChild(tr); // table要素に追加
    });
  } catch (err) {
    console.log(err);
    const error = document.createElement('p');
    error.innerText = 'エラーが発生しました！';
    document.body.appendChild(error);
  }
};

// チーム毎用集計配列を返却
getTeamRows = () => {
  // チームIDをkeyにMapを作成
  const teamMap = scores.reduce((map, target) => {
    const key = getTeamId(target.userId);
    // Mapにキーが存在するか
    if (map.has(key)) {
      map.get(key).push(target); // 存在すれば配列にpush
    } else {
      map.set(key, [target]); // 存在しなければset
    }
    return map;
  }, new Map());

  // Map内のscoreを合計してひとつのオブジェクトにする
  const sumScoreArray = Array.from(teamMap).map(([key, userArray]) =>
    userArray.reduce((user, target) => {
      user.score += target.score;
      return user;
    }, { teamId: key, score: 0 })
  );

  // ソートして返却
  return sumScoreArray.sort((prev, target) => target.score - prev.score);
};

// ゲーム毎用集計配列を返却
getGameRows = () => {
  return Object.keys(games).map(gameKey => {
    // ゲームID毎にfilter
    const filterScores = scores
      .filter(score => score.gameId === Number(gameKey));
    // 最もscoreが高いオブジェクトを返却
    const maxScoreInGame = filterScores
      .reduce((prev, target) => prev.score > target.score ? prev : target);
    return maxScoreInGame;
  });
};

// ユーザ毎用集計配列を返却
getUserRows = () => {
  // ユーザIDをkeyにMapを作成
  const teamMap = scores.reduce((map, target) => {
    const key = target.userId;
    // Mapにキーが存在するか
    if (map.has(key)) {
      map.get(key).push(target); // 存在すれば配列にpush
    } else {
      map.set(key, [target]); // 存在しなければset
    }
    return map;
  }, new Map());

  // Map内のscoreを合計してひとつのオブジェクトにする
  const sumScoreArray = Array.from(teamMap).map(([key, userArray]) =>
    userArray.reduce((user, target) => {
      user.score += target.score;
      return user;
    }, { userId: key, score: 0 })
  );

  // ソートして返却
  return sumScoreArray.sort((prev, target) => target.score - prev.score);
};

// ユーザIDが紐づくチームIDを取得
getTeamId = userId => {
  return Object.entries(relationTeam)
    .find(([key, value]) => value.includes(userId))[0];
};
