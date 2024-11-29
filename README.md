# Draw GeoJson on GoogleMap

GoogleMap 上に GeoJson を描画するウェブアプリ。

## 機能
* GoogleMap 上に GeoJson を描画
* Uber による H3 の 六角形描画
* MySQL に保存するためのコード出力
* 解像度を下げる機能
* 指定した頂点数以下のポリゴンを削除
* 解像度や削除後の GeoJson を出力する機能
* 描画されたポリゴンの情報を表示
  - 個数
  - 重心

## 使用準備

### Github からコードをクローンする
```cli
cd your-directory
git clone git@github.com:shimonhaga/geojson-polygon-googlemap.git
```

### .envファイルを書き換える
1. `.env.example` をコピーして `.env` ファイルを作成する
2. `GOOGLE_API_KEY` を 自分で取得したキーに書き換える
3. (必要に応じて) `PORT`, `SERVER_PORT`, `UI_PORT` を書き換える。

### アプリケーションの構築
1. module をインストールする
2. アプリケーション用の js をビルドする

#### moduleのインストール
##### npm 利用の場合
`npm install`
##### yarn 利用の場合
`yarn install`

#### アプリケーション用の js をビルドする
##### npm 利用の場合
`npm run build`
##### yarn 利用の場合
`yarn run build`


-----


## 利用する
### サーバを立ち上げる
#### npm 利用の場合
`npm run start`
#### yarn 利用の場合
`yarn run start`

### ブラウザを開く
`localhost:3002` を開く。
(.env の SERVER_PORT を変更している場合は 3002 のところをその数字にする)

### GeoJson を読み込ませる
1. 取得した GeoJson をコピペしてテキストエリアに入れる
2. `読み込み` ボタンを押す
3. `地域の選択` のプルダウンがアクティベートされるので、好きな地域を選ぶ
4. `表示する` ボタンを押す


-----


## 開発モード
当アプリケーションをカスタマイズする時は、ホットリロードでの開発が可能。
以下のコマンドを実行すると、自動的にブラウザが立ち上がる。
`src` 配下のファイルを変更すると、自動的にリロードがかかる。
### npm 利用の場合
`npm run hot`
### yarn 利用の場合
`yarn run hot`


-----

## トラブルシューティング
### ブラウザ開いたときに地図が表示されない
.env の `GOOGLE_API_KEY` の値が正しく無い

### localhost:3002 が存在しないと言われる (アクセスできません)
* .env の `SERVER_PORT` の数値があっているか確認する
* サーバの起動が成功しているか確認する

### ボタンを押してもなんともならない
* GeoJson が正しいか確認する
* JS のコンパイルをしたか確認する
* デバッガやコンソールでエラーが出ていないか確認する

### コンパイルできない
* node のバージョンを確認する (推奨環境は `18.18.1` だが、その周辺でならだいたい動くと思われる)
* module がインストール済みか確認する


-----


## 関連
* [H3](https://h3geo.org/)
* [国土数値情報ダウンロード](http://nlftp.mlit.go.jp/ksj/ )
* [concaveman](https://github.com/mapbox/concaveman)
