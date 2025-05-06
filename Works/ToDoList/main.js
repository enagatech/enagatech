let addButton = document.getElementById("addButton");
let input = document.getElementById("input");
let completedBy = document.getElementById("completedBy");
let todoList = document.getElementById("todoList");
let completedList = document.getElementById("completedList");

// タスクデータを保存する配列
// ローカルストレージから tasks を復元して、なければ空配列から始める
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// 初期表示（localStorageから読み込み）
tasks.forEach(task => {
    if (task.status === "WIP"){
        createTodoItem(task.text, task.due, task.status);
    } else if (task.status === "Completed") {
        moveToCompleted(task.text, task.due, task.completedAt);
    }
});

// addButtonボタン押下時の動作
addButton.addEventListener("click", () => {
    let inputValue = input.value;
    let completedByValue = completedBy.value;
    if(inputValue && completedByValue) {
        createTodoItem(inputValue, completedByValue, "WIP");
        tasks.push({
            text: inputValue,
            due: completedByValue,
            status: "WIP"
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // 入力値をリセット
        input.value = "";
        completedBy.value = "";

    } else {
        // 警告を表示
        alert("タスク名と期日の両方を入力してください");
   }
});

function createTodoItem(text, due, status) {
        // trタグを作成
        let itemRowTag = document.createElement("tr");

        // 入力フォームのtext要素を取得
        let listItem = document.createElement("td");
        listItem.textContent = text;
        itemRowTag.appendChild(listItem);

        // 期日を取得
        let dueItem = document.createElement("td");
        dueItem.textContent = due;
        itemRowTag.appendChild(dueItem);
        
        // ステータスプルダウンを生成
        let statusItem = document.createElement("td");
        let statusSelect = document.createElement("select");
        statusSelect.innerHTML = `<option value = "WIP">WIP</option><option value ="Completed">Completed</option>`;
        statusSelect.value = status;
        statusItem.appendChild(statusSelect);
        itemRowTag.appendChild(statusItem);

        todoList.appendChild(itemRowTag);

        // Status: Completedに変更された場合
        statusSelect.addEventListener("change", () => {
          if(statusSelect.value === "Completed"){

            todoList.removeChild(itemRowTag);
            const now = new Date().toLocaleString();
            moveToCompleted(text, due, now);
            tasks = tasks.map(t =>
                t.text === text && t.due === due ? { ...t, status: "Completed", completedAt: now } : t
            );
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

    });
}

// ToDoリストからタスクを削除 → Completedにタスクを新規作成       
function moveToCompleted(text, due, completedAt) {
    // Completedテーブルに要素を追加
    let completedRow = document.createElement("tr");

    // Completed - タスク名
    let item = document.createElement("td");
    item.textContent = text;
    completedRow.appendChild(item);

    // Completed - 期日
    let dueItem = document.createElement("td")
    dueItem.textContent = due;
    completedRow.appendChild(dueItem);

    // Completed - 完了日
    let completedOn = document.createElement("td");
    completedOn.textContent = completedAt;
    completedRow.appendChild(completedOn);

    completedList.appendChild(completedRow);
}

//メモ
// 1. データが保持されるようにしたい 　👈済
// 2. レスポンシブ対応
// 3. todoを日付順でソートできるようにしたい
// 4. todoに削除ボタンを追加
// 5. 完了時のアニメーション追加;