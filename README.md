# シナリオ
2年目と3年目で3チームに分かれてゲーム大会を行いました。  
ゲーム結果を
- チーム合計得点順
- ゲーム毎の最高得点者
- 個人成績順  
  
に集計するHTMLを作成したいです。

# 前提
- 修正範囲はtable.jsのみとする
- onloadイベント内は変更しない
- data.jsに定義されている情報を表示すること  

# 仕様
## チーム合計得点順
### **表示内容**
- チーム名
- チームの全ゲームの合計得点  
  
を表示すること。
### **ソート**
合計得点の降順であること。

***
  
## ゲーム毎の最高得点者
### **表示内容**
- ゲーム名
- 氏名
- チーム名
- そのゲームでの得点  

を表示すること。
### **ソート**
指定なし。

***

## 個人成績順
### **表示内容**
- 氏名
- チーム名
- 全ゲームの合計得点  
  
を表示すること。
### **ソート**
合計得点の降順であること。