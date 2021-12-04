function checkForIndexedDb() {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB.");
    return false;
  }
  return true;
}


const request = window.indexedDB.open("budgetDb", 1);
let db;
  // tx,
  // store;

request.onupgradeneeded = function (e) {
  const db = request.result;
  db.createObjectStore("store", { keyPath: "_id" });
};

request.onerror = function (e) {
  console.log("There was an error");
};

request.onsuccess = function (e) {
  db = request.result;
  // tx = db.transaction(storeName, "readwrite");
  // store = tx.objectStore(storeName);

  db.onerror = function (e) {
    console.log("error");
  };
  // if (method === "put") {
  //   store.put(object);
  // } else if (method === "get") {
  //   const all = store.getAll();
  //   all.onsuccess = function () {
  //     resolve(all.result);
  //   };
  // } else if (method === "delete") {
  //   store.delete(object._id);
  // }
  // tx.oncomplete = function () {
  //   db.close();
  // };
};

// need to add additional code here
function checkDatabase() {
  const transaction = db.transaction(["store"], "readwrite");
  const store = transaction.objectStore("store");
  const getAll = store.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch ("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        }
      }).then (response => {
        return response.json();
      }).then (() => {
        const transaction = db.transaction(["store"], "readwrite");
        const store = transaction.objectStore("store");
        store.clear();
      })
    }
  }
}

function saveRecord(record) {
  const transaction = db.transaction(["store"], "readwrite");
  const store = transaction.objectStore("store");
  store.add(record);
}

window.addEventListener("online", checkDatabase);