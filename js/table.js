// dataはこのグローバル変数を参照してください。
let users;
let teams;
let relationTeam;
let games;
let scores;
let table;

// 集計種別
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
  table.innerHTML = null; // 必ず初期化
  try {
    getDataRows(kind).forEach(row => {
      const tr = document.createElement('tr');
      getColumns(kind).forEach(column => {
        const td = document.createElement('td');
        // 配列指定があれば配列から値を取得
        td.innerText = column.array ? column.array[row[column.key]] : row[column.key];
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  } catch (err) {
    console.log(err);
    const error = document.createElement('p');
    error.innerText = 'エラーが発生しました！';
    document.body.appendChild(error);
  }
};

// 種別毎にデータを整形して取得
getDataRows = kind => {
  switch (kind) {
    case TEAM:
      return getTeamRows();
    case GAME:
      return getGameRows();
    case USER:
      return getUserRows();
    default:
      throw '存在しない種別';
  }
};

// チーム合計得点順情報返却
getTeamRows = () => {
  return getSumScoreRows(getTeamId);
};

// ゲーム毎最高得点者情報返却
getGameRows = () => {
  return Object.keys(games).map(gameKey =>
    getRowWithTeamId( // teamIdを付与して返却
      scores
        .filter(score => score.gameId === Number(gameKey)) // score配列をgameId毎にfilter
        .reduce((prev, target) => prev.score > target.score ? prev : target) // 最高得点者を取得
    )
  );
};

// 個人合計得点順情報返却
getUserRows = () => {
  return getSumScoreRows(getUserId)
    .map(row => getRowWithTeamId(row, row.id)); // teamIdを付与して返却
};

// 種別単位で合計金額を算出、ソートして返却
getSumScoreRows = getKeyHandler => {
  return Array.from(
      // 指定したKeyでMapに変換
      scores.reduce((map, target) => putIfAbsent(map, getKeyHandler(target), target), new Map())
    )
    .map(([key, scoreArray]) => getTotalScoreObj(key, scoreArray)) // Map内score合計をもつオブジェクト配列
    .sort((prev, target) => target.score - prev.score); // 降順にソート
};

// keyが存在すれば配列にpush
// keyが存在しなければset
// して返却
putIfAbsent = (map, key, target) => {
  if (map.has(key)) {
    map.get(key).push(target);
  } else {
    map.set(key, [target]);
  }
  return map;
};

// Map内scoreの合計を持つオブジェクトを返却
getTotalScoreObj = (key, scoreArray) => {
  return scoreArray.reduce((result, scoreObj) => {
    result.score += scoreObj.score;
    return result;
  }, { id: key, score: 0 })
}

// オブジェクトにteamIdをsetして返却
getRowWithTeamId = row => {
  // 個人合計得点順の場合、idプロパティからユーザIDを取得
  row.teamId = getTeamId(row);
  return row;
};

// ユーザが所属するteamIdを返却
getTeamId = row => {
  return Object.entries(relationTeam)
    .find(([key, value]) => value.includes(getUserId(row)))[0];
};

// ユーザIDを取得
getUserId = row => {
  return row.userId || row.id;
};

// 種別から表示用定義を取得
getColumns = kind => {
  switch (kind) {
    case TEAM:
      return [
        {
          array: teams,
          key: 'id',
        },
        {
          array: null,
          key: 'score',
        },
      ];
    case GAME:
      return [
        {
          array: games,
          key: 'gameId',
        },
        {
          array: users,
          key: 'userId',
        },
        {
          array: teams,
          key: 'teamId',
        },
        {
          array: null,
          key: 'score',
        },
      ];
    case USER:
      return [
        {
          array: users,
          key: 'id',
        },
        {
          array: teams,
          key: 'teamId',
        },
        {
          array: null,
          key: 'score',
        },
      ];
    default:
      throw '存在しない種別';
  }
};
