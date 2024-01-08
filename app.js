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
    //フォームからの値をクエリに使うときは、VALUESに「?」。次に「connection.query()」の第2引数に渡したい配列を指定。この配列の要素が「?」の部分に入り実行。 
    //第1引数：itemsテーブルのnameカラムにフォームの値を追加するクエリ。ただし、nameカラムに追加する値には?を使用。
    connection.query(
   'INSERT INTO items (name) VALUES (?)',
      [req.body.itemName],
      (error, results) => {
        //クエリ実行後の処理 ＝＞　リロードするとアイテムが増えるので削除
        // connection.query(
        //   'SELECT * FROM items',
        //     (error, results) => {
        //     res.render('index.ejs', {items: results});
        //   }
        // );  
        res.redirect('/index');
      }
    );


    //フォームの値を取得する
    // console.log(req.body.itemName);

    //一覧画面を表示する処理　＝＞削除
    // connection.query(
    //     'SELECT * FROM items',
    //     (error, results) => {
    //         res.render('index.ejs', {items: results});
    //     }
    //    );
        
});

//メモを削除
app.post('/delete/:id', (req, res) =>{
  //req.params.ルートパラメータ名でルートパラメータの値を受け取れる
  // console.log(req.params.id);
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) =>{
      res.redirect('/index');
    }
  );
});

//メモを編集
app.get('/edit/:id', (req, res) =>{
  connection.query(
    // 選択されたメモをデータベースから取得する処理
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) =>{
      //クエリの取得結果は件数に関わらず配列になる。配列resultsから1件目の要素を取り出し、edit.ejsにitemプロパティを渡す
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

//メモを更新
app.post('/update/:id', (req, res) =>{
  //req:{body:{itemName:'とまと'}} 
  connection.query(
    //メモのidはルートパラメータとparamsで受け渡す。更新する値はフォームとbodyで受け渡す
    'UPDATE items SET name = ? WHERE id = ?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3000);
