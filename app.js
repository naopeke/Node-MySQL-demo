const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));

//フォームの値を受け取るために必要な定型文
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
//データベース名、パスワードなど接続情報を定数connectionに代入
    host: 'localhost',
    user: 'progate',
    password: 'password',
    database: 'list_app'
});

//画面を表示したい時はGET
app.get('/', (req, res) => {
    res.render('top.ejs');
  });


app.get('/index', (req, res) => {
//connection.query('クエリ', クエリ実行後の処理)と書くことで、Node.jsからデータベースに対してクエリを実行することができる
  connection.query(
    'SELECT * FROM items',
    //クエリ実行後の処理は2つの引数を取ることができる。
    //第1引数のerrorにはクエリが失敗したときのエラー情報が、第2引数のresultsにはクエリの実行結果（ここでは取得したメモ情報）が入る
    ( error, results ) => {
    console.log(results);
    //renderメソッドの第2引数に{プロパティ : 値}と書くことで、EJS側に値を渡すことができる
    res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
})

//データベースを変更したい時はPOST
//req.body.itemNameに「とまと」が入る
app.post('/create', (req, res) =>{
    //メモを追加する処理
    connection.query(

    )

    //フォームの値を取得する
    console.log(req.body.itemName);
    //一覧画面を表示する処理
    // connection.query(
    //     'SELECT * FROM items',
    //     (error, results) => {
    //         res.render('index.ejs', {items: results});
    //     }
    //    );
        
});


app.listen(3000);
