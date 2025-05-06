function validateInputs() {
  const n = parseInt(document.getElementById("itemCount").value);
  const weights = document
    .getElementById("weights")
    .value.split(",")
    .map(Number);
  const values = document.getElementById("values").value.split(",").map(Number);

  if (values.length !== n || weights.length !== n) {
    document.getElementById(
      "error"
    ).innerHTML = `Помилка: Очікується ${n} предметів. Введено ${weights.length} ваг та ${values.length} цінностей`;
    return false;
  }

  document.getElementById("error").innerHTML = "";
  return true;
}

async function solveKnapsack() {
  if (!validateInputs()) return;

  const n = parseInt(document.getElementById("itemCount").value);
  const W = parseInt(document.getElementById("maxWeight").value);
  const weights = document
    .getElementById("weights")
    .value.split(",")
    .map(Number);
  const values = document.getElementById("values").value.split(",").map(Number);

  const dp = Array(n + 1)
    .fill()
    .map(() => Array(W + 1).fill(0));

  const table = document.createElement("table");
  let html = "<tr><th>i\\w</th>";

  for (let w = 0; w <= W; w++) {
    html += `<th>${w}</th>`;
  }

  html += "</tr>";

  for (let i = 0; i <= n; i++) {
    html += `<tr><th>${i}</th>`;
    for (let w = 0; w <= W; w++) {
      html += `<td id="cell-${i}-${w}">${dp[i][w]}</td>`;
    }
    html += "</tr>";
  }

  table.innerHTML = html;
  document.getElementById("dpTable").innerHTML = "";
  document.getElementById("dpTable").appendChild(table);

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      await new Promise((resolve) => setTimeout(resolve, 150));

      const cell = document.getElementById(`cell-${i}-${w}`);
      cell.classList.add("highlight");

      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }

      cell.textContent = dp[i][w];
      await new Promise((resolve) => setTimeout(resolve, 150));
      cell.classList.remove("highlight");
    }
  }

  let res = dp[n][W];
  let w = W;
  const selected = [];

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      selected.push(i);
      res -= values[i - 1];

	  document.getElementById(`cell-${i}-${w}`).classList.add("highlight");

      w -= weights[i - 1];

    }
  }

  document.getElementById("result").classList.add("result");
  document.getElementById("result").innerHTML = `
                <h3>Результат:</h3>
                <p>Максимальна цінність: ${dp[n][W]}</p>
                <p>Обрані предмети: ${selected.reverse().join(", ")}</p>
            `;
}
